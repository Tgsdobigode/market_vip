import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export const AgeVerification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified');
    if (!isVerified) {
      setIsVisible(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full glass p-8 rounded-[2.5rem] text-center space-y-6 overflow-hidden"
          >
            <div className="flex justify-center">
              <div className="p-4 bg-wine/20 rounded-full">
                <ShieldAlert className="w-10 h-10 text-wine" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold text-gold">Acesso Restrito</h1>
              <p className="text-zinc-400 text-sm">
                Este marketplace contém conteúdo adulto exclusivo para maiores de 18 anos.
              </p>
            </div>

            <div className="bg-black/40 border border-zinc-800 rounded-2xl p-4 text-left space-y-3 h-48 overflow-y-auto custom-scrollbar">
              <h4 className="text-gold text-xs font-bold uppercase tracking-widest">Termo de Responsabilidade</h4>
              <div className="text-[11px] text-zinc-500 leading-relaxed space-y-2">
                <p>
                  1. Ao acessar este site, você declara, sob as penas da lei, que possui 18 (dezoito) anos de idade ou mais.
                </p>
                <p>
                  2. Você compreende que este site exibe anúncios de serviços adultos, imagens de nudez e conteúdo sexualmente explícito.
                </p>
                <p>
                  3. O LuxMarket é uma plataforma de classificados. Não possuímos vínculo empregatício, agenciamento ou responsabilidade sobre os serviços, condutas ou veracidade das informações postadas pelos anunciantes.
                </p>
                <p>
                  4. É terminantemente proibida a utilização deste site para fins de exploração sexual infantil, tráfico humano ou qualquer atividade ilegal. Denunciaremos imediatamente qualquer suspeita às autoridades competentes.
                </p>
                <p>
                  5. Você concorda em manter sua senha e acesso em sigilo, não permitindo que menores de idade utilizem seu dispositivo para acessar este conteúdo.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerify}
                className="w-full py-4 rounded-xl gold-gradient text-black font-bold hover:opacity-90 transition-opacity text-sm"
              >
                Li e aceito os termos - Sou Maior de 18 Anos
              </button>
              <button
                onClick={handleReject}
                className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-500 hover:bg-zinc-900 transition-colors text-sm"
              >
                Não aceito / Sou Menor de Idade
              </button>
            </div>

            <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-tight">
              O uso deste site implica na aceitação total dos nossos Termos de Uso e Política de Privacidade.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
