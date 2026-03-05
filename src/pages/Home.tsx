import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, TrendingUp, Users, Shield, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { ProfileCard } from '../components/Layout';
import { motion } from 'framer-motion';

export const Home = () => {
  const [searchCity, setSearchCity] = useState('');
  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/ads');
        if (response.ok) {
          const data = await response.json();
          setAds(data);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=1920&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30"
            alt="Hero Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
        </div>

        <div className="relative z-10 max-w-4xl w-full px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">
              Encontre o <span className="text-gold">Luxo</span> que você merece
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
              A plataforma mais sofisticada e segura para conexões exclusivas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 px-6 w-full">
              <MapPin className="text-gold w-5 h-5" />
              <input
                type="text"
                placeholder="Qual sua cidade?"
                className="bg-transparent border-none focus:ring-0 w-full text-white placeholder:text-zinc-500"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-zinc-800 hidden md:block" />
            <div className="flex-1 flex items-center gap-3 px-6 w-full">
              <Filter className="text-gold w-5 h-5" />
              <select className="bg-transparent border-none focus:ring-0 w-full text-white appearance-none">
                <option value="">Todas as Categorias</option>
                <option value="acompanhante">Acompanhantes</option>
                <option value="massagem">Massagem</option>
                <option value="bdsm">BDSM</option>
              </select>
            </div>
            <button className="w-full md:w-auto px-10 py-4 rounded-full gold-gradient text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, label: 'Anunciantes Ativos', value: '12,400+' },
            { icon: TrendingUp, label: 'Visitas Mensais', value: '2.5M+' },
            { icon: Shield, label: 'Perfis Verificados', value: '98%' },
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-3xl flex items-center gap-6">
              <div className="p-4 bg-gold/10 rounded-2xl">
                <stat.icon className="w-8 h-8 text-gold" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-zinc-500 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-serif font-bold text-white">Destaques <span className="text-gold">Lux</span></h2>
            <p className="text-zinc-500">Os perfis mais exclusivos da plataforma</p>
          </div>
          <Link to="/search" className="text-gold hover:underline text-sm font-medium">Ver todos</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : ads.length > 0 ? (
            ads.slice(0, 8).map((ad) => (
              <ProfileCard 
                key={ad.id} 
                profile={{
                  ...ad,
                  name: ad.user_name || ad.title,
                  city: ad.location,
                  main_image: ad.image,
                  is_verified: true,
                  is_premium: true
                }} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-zinc-500">
              Nenhum anúncio encontrado no momento.
            </div>
          )}
        </div>
      </section>

      {/* Advertiser CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass p-12 rounded-[3rem] border-gold/20 bg-gold/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <TrendingUp className="w-64 h-64 text-gold" />
          </div>
          
          <div className="space-y-6 relative z-10 max-w-2xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest">
              Seja um Anunciante
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Aumente sua visibilidade por apenas <span className="text-gold">R$ 60/mês</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Anuncie no LuxMarket e tenha acesso a uma audiência qualificada. Plano único com todos os benefícios inclusos, sem taxas ocultas.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                <span>Perfis Verificados</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <Link 
              to="/register" 
              className="w-full md:w-auto px-12 py-6 rounded-2xl gold-gradient text-black font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-gold/20"
            >
              Começar Agora
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <h2 className="text-3xl font-serif font-bold text-white text-center">Categorias Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Acompanhantes', 'Massagem Erótica', 'Fetiche & BDSM', 'Casais'].map((cat, i) => (
            <button key={i} className="glass p-6 rounded-2xl hover:border-gold/50 transition-colors text-center group">
              <div className="text-lg font-medium text-zinc-300 group-hover:text-gold transition-colors">{cat}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
