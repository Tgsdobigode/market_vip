import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AgeVerification } from './components/AgeVerification';
import { Navbar } from './components/Layout';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CreateAd } from './pages/CreateAd';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-950">
        <AgeVerification />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-ad" 
              element={
                <ProtectedRoute>
                  <CreateAd />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
            <div className="text-2xl font-serif font-bold tracking-tighter">
              <span className="text-gold">LUX</span>
              <span className="text-white">MARKET</span>
            </div>
            <div className="flex justify-center gap-8 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
              <a href="#" className="hover:text-white transition-colors">Denunciar</a>
            </div>
            <p className="text-xs text-zinc-600 max-w-2xl mx-auto">
              LuxMarket é uma plataforma de anúncios. Não temos vínculo com os anunciantes e não nos responsabilizamos pelos serviços prestados. Proibido para menores de 18 anos.
            </p>
            <div className="text-zinc-700 text-[10px] uppercase tracking-widest">
              © 2024 LuxMarket - Todos os direitos reservados
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
