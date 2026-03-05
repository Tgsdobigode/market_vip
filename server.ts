import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.sqlite");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const JWT_SECRET = process.env.JWT_SECRET || "luxmarket-secret-key-2024";

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Token inválido" });
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Register
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
      const result = stmt.run(name, email, hashedPassword);
      
      const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET);
      res.status(201).json({ token, user: { id: result.lastInsertRowid, name, email } });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "E-mail já cadastrado" });
      } else {
        res.status(500).json({ error: "Erro ao criar conta" });
      }
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });

  // Get Profile
  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user: any = db.prepare("SELECT id, name, email, profile_image, created_at FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // Update Profile
  app.put("/api/auth/profile", authenticateToken, (req: any, res) => {
    const { profile_image } = req.body;
    try {
      db.prepare("UPDATE users SET profile_image = ? WHERE id = ?").run(profile_image, req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
  });

  // Get Ads
  app.get("/api/ads", (req, res) => {
    const ads = db.prepare("SELECT * FROM ads ORDER BY created_at DESC").all();
    res.json(ads);
  });

  // Create Ad
  app.post("/api/ads", authenticateToken, (req: any, res) => {
    const { title, price, category, location, image, description } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO ads (user_id, title, price, category, location, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
      const result = stmt.run(req.user.id, title, price, category, location, image, description);
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar anúncio" });
    }
  });

  // Get User Ads
  app.get("/api/my-ads", authenticateToken, (req: any, res) => {
    const ads = db.prepare("SELECT * FROM ads WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(ads);
  });

  // Get Single Ad
  app.get("/api/ads/:id", (req, res) => {
    const ad: any = db.prepare(`
      SELECT ads.*, users.name as user_name, users.email as user_email 
      FROM ads 
      JOIN users ON ads.user_id = users.id 
      WHERE ads.id = ?
    `).get(req.params.id);
    
    if (!ad) return res.status(404).json({ error: "Anúncio não encontrado" });
    res.json(ad);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
