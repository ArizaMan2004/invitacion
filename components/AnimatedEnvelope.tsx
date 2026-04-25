'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AnimatedEnvelopeProps {
  eventTime?: string;
  welcomeMessage?: string;
  onOpen: () => void;
}

export function AnimatedEnvelope({
  eventTime = "19:00 HRS",
  welcomeMessage = "¡Bienvenidos a nuestra gran celebración de 15 años!",
  onOpen,
}: AnimatedEnvelopeProps) {
  const [step, setStep] = useState<'idle' | 'opening' | 'paperUp' | 'fading'>('idle');

  const handleClick = () => {
    // Evita doble clic
    if (step !== 'idle') return;

    setStep('opening');
    
    setTimeout(() => {
      setStep('paperUp');
    }, 1500);

    setTimeout(() => {
      setStep('fading');
    }, 4800);

    setTimeout(() => {
      onOpen();
    }, 6200);
  };

  const fluidEasing = [0.33, 1, 0.68, 1];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      className="min-h-screen bg-green-950 flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="flex flex-col items-center gap-14 w-full max-w-md relative">
        
        {/* CONTENEDOR PRINCIPAL DEL SOBRE (AHORA INTERACTIVO) */}
        <motion.div
          onClick={handleClick}
          animate={
            step === 'fading' 
              ? { scale: 3.5, opacity: 0, filter: "blur(25px)", y: -180 } 
              : { scale: 1, opacity: 1, y: 0 }
          }
          // Pequeño zoom al pasar el ratón para indicar que es clickeable
          whileHover={step === 'idle' ? { scale: 1.02 } : {}}
          transition={{ duration: 1.8, ease: fluidEasing }}
          className={`relative w-full ${step === 'idle' ? 'cursor-pointer' : ''}`}
          style={{ perspective: '1800px' }}
        >
          <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
            
            <div className="absolute inset-0 bg-white rounded-lg shadow-inner border-t border-amber-300/40 z-10" />

            {/* LA TARJETA DE INVITACIÓN */}
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={
                step === 'paperUp' || step === 'fading'
                  ? { y: -185, opacity: 1, scale: [1, 1.02, 1] } 
                  : { y: 0, opacity: 0 }
              }
              transition={{ duration: 1.4, ease: fluidEasing }}
              className="absolute inset-x-5 top-5 bg-white rounded shadow-[0_15px_60px_-15px_rgba(0,0,0,0.4)] p-8 text-center z-20 h-[105%] border-l-2 border-amber-300/50"
            >
              <div className="h-full flex flex-col items-center justify-start pt-8">
                <div className="absolute top-4 left-4 text-amber-400 font-serif opacity-30 text-xs">◆</div>
                <div className="absolute top-4 right-4 text-amber-400 font-serif opacity-30 text-xs">◆</div>
                
                <p className="text-green-900 font-serif italic text-xl mb-4 leading-relaxed">
                  {welcomeMessage}
                </p>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent mb-7" />
                
                <p className="text-green-700/50 text-xs tracking-[0.4em] uppercase mb-2 font-medium">Recepción:</p>
                <h3 className="text-4xl font-serif font-bold text-green-950 tracking-tighter drop-shadow-sm">
                  {eventTime}
                </h3>
              </div>
            </motion.div>

            {/* FRENTE DEL SOBRE */}
            <div className="absolute inset-0 bg-white rounded-lg shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] z-30 flex items-center justify-center border-l-4 border-amber-300">
               <div className="text-[120px] font-serif text-amber-300/10 pointer-events-none">XV</div>
            </div>

            {/* SOLAPA TRIANGULAR */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={step !== 'idle' ? { rotateX: -160 } : { rotateX: 0 }}
              whileHover={step === 'idle' ? { rotateX: -22 } : {}}
              transition={{ duration: 1.4, ease: fluidEasing }}
              className="absolute inset-x-0 top-0 h-1/2 bg-white rounded-t-lg origin-top shadow-2xl z-40 
                         after:content-[''] after:absolute after:inset-x-0 after:bottom-[-40px] after:h-[80px] 
                         after:bg-white after:rounded-b-[100px] after:shadow-2xl after:border-amber-300/40 after:border-b"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <div className="absolute inset-0 bg-green-900 rounded-t-lg flex flex-col items-center justify-center">
                <div className="absolute inset-x-0 bottom-[-40px] h-[80px] bg-green-900 rounded-b-[100px]" />
                
                <motion.div
                  animate={step !== 'idle' ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute bottom-[-20px] w-20 h-20 rounded-full bg-green-700 border-8 border-amber-300 flex items-center justify-center 
                             shadow-[0_0_20px_0_#d97706_inset,0_10px_30px_-5px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                >
                  <div className="relative text-3xl font-serif font-bold text-amber-400 drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)]">XV</div>
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/crissxcross.png')]" />
                </motion.div>
              </div>
            </motion.div>
            
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/smooth-wall-dark.png')] z-50 rounded-lg" />
          </div>
        </motion.div>

        {/* BOTÓN Y TEXTOS */}
        <AnimatePresence mode="wait">
          {step === 'idle' ? (
            <motion.div
              key="ui-btn"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              transition={{ duration: 1.2, ease: fluidEasing }}
              className="text-center"
            >
              <motion.p
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-amber-300/80 font-serif italic text-lg mb-8"
              >
                Toca el sobre para abrirlo
              </motion.p>
              
              <button
                onClick={handleClick}
                className="px-10 py-3 bg-green-700 text-white font-serif font-bold rounded-full 
                           shadow-[0_10px_30px_0_rgba(16,185,129,0.3),0_0_15px_-2px_#fbbf24] 
                           hover:shadow-[0_15px_40px_0_rgba(16,185,129,0.4),0_0_25px_-1px_#fcd34d] 
                           hover:bg-green-600 active:scale-95 transition-all duration-300 cursor-pointer text-sm"
              >
                Abrir Invitación
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="ui-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: step === 'fading' ? 0 : 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <p className="text-white/40 text-xs tracking-[0.5em] uppercase font-light animate-pulse">
                Descubriendo un sueño...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}