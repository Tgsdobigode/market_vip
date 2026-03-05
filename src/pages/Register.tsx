import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar conta');
      }

      login(result.token, result.user);
      navigate('/create-ad');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-32 pb-20">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Pricing & Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-5xl font-serif font-bold text-white leading-tight">
              Anuncie no <span className="text-gold">LuxMarket</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              Junte-se à elite dos anunciantes e alcance milhares de clientes qualificados todos os dias.
            </p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-gold/20 bg-gold/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <CreditCard className="w-32 h-32 text-gold" />
            </div>
            
            <div className="space-y-2">
              <span className="text-gold text-xs font-bold uppercase tracking-widest">Plano Único Profissional</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$ 60</span>
                <span className="text-zinc-500 font-medium">/mês</span>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                'Anúncios ilimitados em sua conta',
                'Verificação de identidade inclusa',
                'Suporte prioritário via WhatsApp',
                'Painel de estatísticas completo',
                'Visibilidade em todas as buscas'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gold/10">
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest">
                Pagamento via PIX ou Cartão de Crédito. Sem fidelidade.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-10 rounded-[2.5rem] shadow-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-wine/10 border border-wine/20 text-wine p-4 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Como deseja ser chamado"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors"
                  />
                </div>
                {errors.name && <p className="text-wine text-xs mt-1">{errors.name.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors"
                  />
                </div>
                {errors.email && <p className="text-wine text-xs mt-1">{errors.email.message as string}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                    <input
                      {...register('password')}
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors"
                    />
                  </div>
                  {errors.password && <p className="text-wine text-xs mt-1">{errors.password.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Confirmar</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-colors"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-wine text-xs mt-1">{errors.confirmPassword.message as string}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 rounded-2xl gold-gradient text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-gold/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Criar Conta e Anunciar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm">
              Já possui uma conta?{' '}
              <Link to="/login" className="text-gold font-bold hover:underline">Entrar agora</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
