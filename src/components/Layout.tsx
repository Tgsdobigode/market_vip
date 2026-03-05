import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, Crown, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tighter flex items-center gap-2">
          <span className="text-gold">LUX</span>
          <span className="text-white">MARKET</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link to="/search" className="hover:text-gold transition-colors">Explorar</Link>
          <Link to="/premium" className="hover:text-gold transition-colors flex items-center gap-1">
            <Crown className="w-4 h-4 text-gold" />
            Premium
          </Link>
          <Link to="/verify" className="hover:text-gold transition-colors">Verificação</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                {user.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover border border-gold/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
                {user.name.split(' ')[0]}
              </Link>
              <button 
                onClick={logout}
                className="text-zinc-500 hover:text-wine transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <div className="flex flex-col items-center">
                <Link to="/create-ad" className="px-5 py-2.5 rounded-full gold-gradient text-black text-sm font-bold hover:opacity-90 transition-opacity">
                  Anunciar
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Entrar</Link>
              <div className="flex flex-col items-center">
                <Link to="/register" className="px-5 py-2.5 rounded-full gold-gradient text-black text-sm font-bold hover:opacity-90 transition-opacity">
                  Anunciar
                </Link>
                <span className="text-[9px] text-gold font-bold uppercase tracking-tighter mt-1">R$ 60/mês</span>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export const ProfileCard = ({ profile }: { profile: any, key?: any }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/50"
    >
      <Link to={`/profile/${profile.id}`}>
        <div className="aspect-[3/4] relative">
          <img
            src={profile.main_image || `https://picsum.photos/seed/${profile.id}/600/800`}
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            {profile.is_verified && (
              <div className="bg-blue-500 text-white p-1 rounded-full shadow-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
            {profile.is_premium && (
              <div className="bg-gold text-black p-1 rounded-full shadow-lg">
                <Crown className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white">{profile.name}</h3>
            <div className="flex items-center gap-1 text-zinc-300 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              {profile.city}
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-gold font-bold">R$ {profile.price}</span>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Star className="w-3 h-3 fill-gold text-gold" />
                4.9 (24)
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
