import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, Filter, SlidersHorizontal } from 'lucide-react';
import { ProfileCard } from '../components/Layout';
import { motion } from 'framer-motion';

export const Search = () => {
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  // Mock data
  const profiles = [
    { id: 1, name: 'Isabella Silva', city: 'São Paulo', price: 350, is_verified: true, is_premium: true },
    { id: 2, name: 'Valentina Costa', city: 'Rio de Janeiro', price: 400, is_verified: true, is_premium: true },
    { id: 3, name: 'Gabriela Santos', city: 'Belo Horizonte', price: 300, is_verified: true, is_premium: false },
    { id: 4, name: 'Mariana Oliveira', city: 'Curitiba', price: 450, is_verified: false, is_premium: true },
    { id: 5, name: 'Juliana Lima', city: 'São Paulo', price: 250, is_verified: true, is_premium: false },
    { id: 6, name: 'Beatriz Rocha', city: 'Porto Alegre', price: 500, is_verified: true, is_premium: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-28 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-white">Explorar Perfis</h1>
          <p className="text-zinc-500">Encontre a companhia perfeita perto de você</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm text-zinc-400">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Ordenar por: Relevância</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-8">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Localização</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <input
                  type="text"
                  placeholder="Cidade ou Estado"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-gold outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria</label>
              <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none transition-colors appearance-none">
                <option value="">Todas as Categorias</option>
                <option value="acompanhante">Acompanhantes</option>
                <option value="massagem">Massagem</option>
                <option value="bdsm">BDSM</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Faixa de Preço</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none transition-colors"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none transition-colors"
                />
              </div>
            </div>

            <button className="w-full py-4 rounded-xl gold-gradient text-black font-bold text-sm hover:opacity-90 transition-opacity">
              Aplicar Filtros
            </button>
          </div>

          <div className="glass p-6 rounded-3xl bg-wine/5 border-wine/20">
            <h4 className="text-gold font-bold mb-2">Seja Premium</h4>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Destaque seu perfil no topo das buscas e receba 5x mais contatos.
            </p>
            <button className="w-full py-2 rounded-lg border border-gold text-gold text-xs font-bold hover:bg-gold hover:text-black transition-all">
              Saber Mais
            </button>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <button className="px-8 py-3 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-sm font-medium">
              Carregar mais perfis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
