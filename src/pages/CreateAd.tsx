import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, DollarSign, MapPin, Tag, FileText, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  price: z.string().transform((val) => parseFloat(val)),
  category: z.string().min(1, 'Selecione uma categoria'),
  location: z.string().min(3, 'Localização é obrigatória'),
  image: z.string().url('URL da imagem inválida'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
});

export const CreateAd = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(adSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erro ao criar anúncio');
      }

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-[3rem] text-center space-y-6 max-w-md w-full"
        >
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-gold" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-white">Anúncio Criado!</h2>
            <p className="text-zinc-400">Seu anúncio foi publicado com sucesso e já está visível para todos.</p>
          </div>
          <p className="text-zinc-500 text-sm">Redirecionando para o painel...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-serif font-bold text-white">Criar Novo Anúncio</h2>
          <p className="text-zinc-500">Preencha os detalhes abaixo para publicar seu serviço</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <div className="bg-wine/10 border border-wine/20 text-wine p-4 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Título do Anúncio</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    {...register('title')}
                    placeholder="Ex: Massagem Relaxante Premium"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors"
                  />
                </div>
                {errors.title && <p className="text-wine text-xs mt-1">{errors.title.message as string}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Preço (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    {...register('price')}
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors"
                  />
                </div>
                {errors.price && <p className="text-wine text-xs mt-1">{errors.price.message as string}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria</label>
                <select
                  {...register('category')}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-4 text-white focus:border-gold outline-none transition-colors appearance-none"
                >
                  <option value="">Selecione...</option>
                  <option value="Massagem">Massagem</option>
                  <option value="Acompanhante">Acompanhante</option>
                  <option value="Eventos">Eventos</option>
                  <option value="Outros">Outros</option>
                </select>
                {errors.category && <p className="text-wine text-xs mt-1">{errors.category.message as string}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Localização</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    {...register('location')}
                    placeholder="Cidade, Bairro"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors"
                  />
                </div>
                {errors.location && <p className="text-wine text-xs mt-1">{errors.location.message as string}</p>}
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">URL da Imagem</label>
                <div className="relative">
                  <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    {...register('image')}
                    placeholder="https://..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors"
                  />
                </div>
                {errors.image && <p className="text-wine text-xs mt-1">{errors.image.message as string}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrição</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-zinc-600" />
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Descreva detalhadamente seu serviço..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors resize-none"
                  />
                </div>
                {errors.description && <p className="text-wine text-xs mt-1">{errors.description.message as string}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 rounded-2xl gold-gradient text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Publicar Anúncio
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
