'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Si tienes el componente MagicalSparkles, puedes importarlo. 
// import { MagicalSparkles } from './MagicalSparkles';

interface AnimatedEnvelopeProps {
  eventTime?: string;
  welcomeMessage?: string;
  guestName?: string;
  primaryColor?: string; // Verde musgo
  accentColor?: string; // Oro viejo
  backgroundColor?: string; // Fondo bosque
  onOpen: () => void;
}

export function AnimatedEnvelope({
  eventTime = "19:00 HRS",
  welcomeMessage = "¡Bienvenidos a nuestra gran celebración de 15 años!",
  guestName = "Invitado Especial",
  primaryColor = '#1a331a', 
  accentColor = '#d4af37', 
  backgroundColor = '#08110b',
  onOpen,
}: AnimatedEnvelopeProps) {
  const [step, setStep] = useState<'idle' | 'opening' | 'paperUp' | 'fading'>('idle');

  const handleClick = () => {
    // Evita doble clic
    if (step !== 'idle') return;

    setStep('opening');
    
    setTimeout(() => {
      setStep('paperUp');
    }, 1200); // Ligeramente más rápido para no perder la atención

    setTimeout(() => {
      setStep('fading');
    }, 4500);

    setTimeout(() => {
      onOpen();
    }, 5800);
  };

  // Curvas de animación fluidas y elásticas
  const fluidEasing = [0.34, 1.56, 0.64, 1]; // Efecto rebote suave
  const cinematicEasing = [0.45, 0, 0.55, 1]; // Para el zoom final

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      style={{ background: `linear-gradient(135deg, ${backgroundColor}, #101a10)` }}
      className="h-[100dvh] min-h-[600px] flex items-center justify-center p-4 overflow-hidden relative"
    >
      {/* Destellos mágicos de fondo (opcional si tienes el componente) */}
      {/* <MagicalSparkles isActive={step !== 'idle'} color={accentColor} count={40} /> */}

      <div className="flex flex-col items-center gap-14 w-full max-w-md relative z-10">
        
        {/* CONTENEDOR PRINCIPAL DEL SOBRE */}
        <motion.div
          onClick={handleClick}
          animate={
            step === 'fading' 
              ? { scale: 5, opacity: 0, filter: "blur(20px)", y: -150 } // Zoom cinematográfico hacia adentro
              : { scale: 1, opacity: 1, y: 0 }
          }
          whileHover={step === 'idle' ? { scale: 1.03, y: -5 } : {}}
          transition={{ duration: step === 'fading' ? 1.5 : 0.8, ease: step === 'fading' ? cinematicEasing : fluidEasing }}
          className={`relative w-full ${step === 'idle' ? 'cursor-pointer drop-shadow-[0_20px_50px_rgba(212,175,55,0.15)]' : ''}`}
          style={{ perspective: '2000px' }}
        >
          <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
            
            {/* FONDO INTERIOR DEL SOBRE */}
            <div className="absolute inset-0 bg-white rounded-xl shadow-inner z-10 overflow-hidden border border-white/10" style={{ background: primaryColor }}>
              <div className="absolute inset-0 bg-black/40 shadow-[inset_0_30px_60px_rgba(0,0,0,0.8)]" />
            </div>

            {/* LA TARJETA DE INVITACIÓN */}
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={
                step === 'paperUp' || step === 'fading'
                  ? { y: -200, opacity: 1, scale: [0.95, 1.02, 1] } 
                  : { y: 0, opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 1.4, ease: fluidEasing }}
              className="absolute inset-x-5 top-5 rounded-lg shadow-[0_15px_60px_-15px_rgba(0,0,0,0.6)] p-6 md:p-8 text-center z-20 h-[105%]"
              style={{ 
                background: '#fdfcf0', // Papel marfil
                borderLeft: `2px solid ${accentColor}80`,
                borderRight: `1px solid ${accentColor}30`
              }}
            >
              <div className="h-full flex flex-col items-center justify-start pt-6">
                <div className="absolute top-4 left-4 font-serif opacity-40 text-xs" style={{ color: accentColor }}>✦</div>
                <div className="absolute top-4 right-4 font-serif opacity-40 text-xs" style={{ color: accentColor }}>✦</div>
                
                <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-50 font-medium" style={{ color: primaryColor }}>
                  Para: {guestName}
                </p>

                <p className="font-serif italic text-lg md:text-xl mb-4 leading-relaxed" style={{ color: primaryColor }}>
                  {welcomeMessage}
                </p>
                
                <div className="w-16 h-[1px] mb-6" style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
                
                <p className="text-xs tracking-[0.4em] uppercase mb-2 font-medium opacity-70" style={{ color: primaryColor }}>Recepción:</p>
                <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-tighter drop-shadow-sm" style={{ color: primaryColor }}>
                  {eventTime}
                </h3>
              </div>
            </motion.div>

            {/* FRENTE DEL SOBRE */}
            <div 
              className="absolute inset-0 rounded-xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] z-30 flex items-center justify-center overflow-hidden"
              style={{ 
                background: `linear-gradient(145deg, ${primaryColor}, #0a140a)`,
                borderTop: `1px solid ${accentColor}30`
              }}
            >
               {/* Marca de agua elegante */}
               <div className="text-[140px] font-serif pointer-events-none opacity-[0.04]" style={{ color: accentColor }}>XV</div>
            </div>

            {/* SOLAPA TRIANGULAR CON SELLO */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={step !== 'idle' ? { rotateX: -170 } : { rotateX: 0 }}
              whileHover={step === 'idle' ? { rotateX: -25 } : {}}
              transition={{ duration: 1.4, ease: fluidEasing }}
              className="absolute inset-x-0 top-0 h-[65%] origin-top shadow-2xl z-40"
              style={{ 
                transformStyle: 'preserve-3d', 
                backfaceVisibility: 'hidden',
                // Triángulo perfecto en CSS
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: `linear-gradient(180deg, #1a331a, ${primaryColor})`,
              }}
            >
               {/* Resplandor en los bordes del triángulo */}
              <div className="absolute inset-0 border-t border-white/10" />
            </motion.div>

            {/* SELLO DE CERA (Independiente para no deformarse con el clip-path) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={step !== 'idle' ? { rotateX: -170, opacity: 0 } : { rotateX: 0, opacity: 1 }}
              whileHover={step === 'idle' ? { rotateX: -25 } : {}}
              transition={{ duration: step !== 'idle' ? 0.8 : 1.4, ease: fluidEasing }}
              className="absolute left-1/2 top-[65%] origin-[center_-130%] z-50 pointer-events-none"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <div 
                className="w-20 h-20 -mt-10 -ml-10 rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.6)] border-2 border-black/20"
                style={{ 
                  background: `linear-gradient(135deg, ${accentColor}, #8a6a20)`,
                  boxShadow: `inset 0 0 15px rgba(255,255,255,0.4), 0 10px 20px rgba(0,0,0,0.5)`
                }}
              >
                <div className="relative text-3xl font-serif font-bold drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)]" style={{ color: '#fff0c0' }}>
                  XV
                </div>
              </div>
            </motion.div>
            
            {/* Textura sutil general para el sobre */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] z-50 rounded-xl" />
          </div>
        </motion.div>

        {/* BOTÓN Y TEXTOS */}
        <AnimatePresence mode="wait">
          {step === 'idle' ? (
            <motion.div
              key="ui-btn"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.9 }}
              transition={{ duration: 0.8, ease: fluidEasing }}
              className="text-center"
            >
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-serif italic text-lg mb-8"
                style={{ color: accentColor }}
              >
                Toca el sobre para descubrir la magia
              </motion.p>
              
              <button
                onClick={handleClick}
                style={{ 
                  background: `linear-gradient(135deg, ${accentColor}, #9a7615)`,
                  color: '#08110b' // Texto oscuro para contrastar con el oro
                }}
                className="px-10 py-4 font-serif font-bold rounded-full 
                           shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]
                           active:scale-95 transition-all duration-300 cursor-pointer text-base uppercase tracking-widest"
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
              <p className="text-white/60 text-xs tracking-[0.5em] uppercase font-light animate-pulse mt-10">
                Iniciando el hechizo...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}