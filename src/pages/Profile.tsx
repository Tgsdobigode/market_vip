import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, MessageSquare, Phone, ShieldCheck, Crown, Info, Camera, Heart, Share2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`/api/ads/${id}`);
        if (!response.ok) throw new Error('Anúncio não encontrado');
        const data = await response.json();
        setAd(data);
      } catch (error) {
        console.error('Error fetching ad:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAd();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!ad) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-28 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden glass relative">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6 flex gap-3">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-xl">
                <ShieldCheck className="w-4 h-4" />
                Verificada
              </div>
              <div className="bg-gold text-black px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-xl">
                <Crown className="w-4 h-4" />
                Premium
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden glass">
                <img 
                  src={`https://picsum.photos/seed/${ad.id + i}/800/800`} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-serif font-bold text-white">{ad.user_name}</h1>
              <div className="flex gap-2">
                <button className="p-3 rounded-full glass hover:bg-white/10 transition-colors">
                  <Heart className="w-5 h-5 text-zinc-400" />
                </button>
                <button className="p-3 rounded-full glass hover:bg-white/10 transition-colors">
                  <Share2 className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-zinc-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gold" />
                {ad.location}
              </div>
              <div className="w-1 h-1 bg-zinc-700 rounded-full" />
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold text-gold" />
                4.9 (24 avaliações)
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Valor do Serviço</span>
              <span className="text-3xl font-bold text-gold">R$ {ad.price}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <a
                href={`https://wa.me/5511999999999`}
                target="_blank"
                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href={`#`}
                target="_blank"
                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Telegram
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-gold" />
                {ad.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {ad.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="glass p-4 rounded-2xl text-center">
                <div className="text-zinc-500 text-xs uppercase mb-1">Idade</div>
                <div className="text-white font-bold">24 anos</div>
              </div>
              <div className="glass p-4 rounded-2xl text-center">
                <div className="text-zinc-500 text-xs uppercase mb-1">Altura</div>
                <div className="text-white font-bold">1.68m</div>
              </div>
              <div className="glass p-4 rounded-2xl text-center">
                <div className="text-zinc-500 text-xs uppercase mb-1">Peso</div>
                <div className="text-white font-bold">58kg</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Categoria</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
                  {ad.category}
                </span>
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl border border-wine/30 text-wine hover:bg-wine/10 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
              <AlertTriangle className="w-4 h-4" />
              Denunciar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
