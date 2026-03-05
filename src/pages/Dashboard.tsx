import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Package, Plus, LogOut, Settings, ExternalLink, Camera, Save, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [myAds, setMyAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(user?.profile_image || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyAds = async () => {
      try {
        const response = await fetch('/api/my-ads', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMyAds(data);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyAds();
  }, [user, token, navigate]);

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    setProfileError(null);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile_image: newProfileImage }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar perfil');
      
      updateUser({ profile_image: newProfileImage });
      setIsEditingProfile(false);
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass p-8 rounded-[2.5rem] text-center space-y-4 relative overflow-hidden">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 overflow-hidden">
                  {user.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gold" />
                  )}
                </div>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="absolute bottom-0 right-0 p-2 bg-gold text-black rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {isEditingProfile ? (
                <div className="space-y-3 pt-2">
                  <input 
                    type="text" 
                    placeholder="URL da foto de perfil"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-4 text-xs text-white outline-none focus:border-gold"
                    value={newProfileImage}
                    onChange={(e) => setNewProfileImage(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdateProfile}
                      disabled={isUpdatingProfile}
                      className="flex-1 py-2 bg-gold text-black rounded-xl text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {isUpdatingProfile ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Salvar
                    </button>
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="p-2 bg-zinc-900 text-zinc-400 rounded-xl hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {profileError && <p className="text-wine text-[10px]">{profileError}</p>}
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">{user.name}</h2>
                  <p className="text-zinc-500 text-sm flex items-center justify-center gap-2 mt-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800 flex justify-center gap-4">
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="p-2 bg-zinc-900 rounded-xl text-zinc-400 hover:text-gold transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={logout}
                  className="p-2 bg-zinc-900 rounded-xl text-zinc-400 hover:text-wine transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="glass p-6 rounded-[2rem] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-2xl font-bold text-white">{myAds.length}</span>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Anúncios</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-2xl font-bold text-white">0</span>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Visualizações</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ads List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif font-bold text-white">Meus Anúncios</h2>
              <Link 
                to="/create-ad"
                className="flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-black font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Novo Anúncio
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : myAds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAds.map((ad) => (
                  <div key={ad.id} className="glass rounded-3xl overflow-hidden group">
                    <div className="aspect-video relative">
                      <img 
                        src={ad.image} 
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/60 backdrop-blur-md text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                          {ad.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-gold transition-colors">{ad.title}</h4>
                        <p className="text-zinc-500 text-sm mt-1">{ad.location}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <span className="text-xl font-bold text-white">R$ {ad.price}</span>
                        <button className="text-zinc-500 hover:text-white transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass p-20 rounded-[3rem] text-center space-y-6">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-10 h-10 text-zinc-700" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Nenhum anúncio ainda</h3>
                  <p className="text-zinc-500">Comece a anunciar seus serviços agora mesmo.</p>
                </div>
                <Link 
                  to="/create-ad"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full gold-gradient text-black font-bold hover:opacity-90 transition-opacity"
                >
                  Criar Primeiro Anúncio
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
