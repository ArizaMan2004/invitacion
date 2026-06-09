'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';

interface AmbientBackgroundProps {
  heroImage?: string;
}

// FONDO SINCRONIZADO (Se revelará al final cuando el video mágico se desvanezca)
const AmbientVideoBackground = ({ heroImage = '/placeholder-hero.jpg' }: AmbientBackgroundProps) => (
  <>
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden bg-black">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
        <source src="/FONDO.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-500 to-blue-600 mix-blend-color opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/80 via-transparent to-[#0a0514]/90" />
    </div>

    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ duration: 2, ease: "easeOut" }}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
    >
      <Image src={heroImage} alt="Hero Background" fill className="object-cover object-center" priority />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/60 via-[#0a0514]/20 to-transparent" />
    </motion.div>
  </>
);

const MagicalFireflies = ({ color }: { color: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = 40; 
  const firefliesData = useMemo(() => {
    const colors = [color, '#ffffff', '#e0b0ff', '#8a2be2', '#ffeed0'];
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 4 + 1.5, delay: Math.random() * 6, duration: Math.random() * 6 + 6,
      glowColor: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, [color]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {firefliesData.map((data, i) => (
        <motion.div
          key={i} className="absolute rounded-full opacity-0"
          style={{ backgroundColor: data.glowColor, width: `${data.size}px`, height: `${data.size}px`, left: `${data.x}%`, top: `${data.y}%`, boxShadow: `0 0 16px 4px ${data.glowColor}B3, 0 0 30px 8px ${data.glowColor}50` }}
          animate={{ opacity: [0, 0.85, 0], y: [0, -80, -160], x: [0, Math.random() * 60 - 30, Math.random() * 80 - 40] }}
          transition={{ duration: data.duration, delay: data.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const FallingStars = ({ accentColor }: { accentColor: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const starCount = 14; 
  const starsData = useMemo(() => {
    const starPaths = ["M12 2 L14.8 8.6 L22 10.2 L17 15.4 L18.2 22 L12 18.8 L5.8 22 L7 15.4 L2 10.2 L9.2 8.6 Z"];
    return Array.from({ length: starCount }).map(() => ({
      path: starPaths[0], x: Math.random() * 100, size: Math.random() * 10 + 5,
      delay: Math.random() * 8, duration: Math.random() * 10 + 10,
      colorVariant: Math.random() > 0.4 ? '#ffffff' : accentColor 
    }));
  }, [accentColor]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {starsData.map((star, i) => (
        <motion.svg
          key={i} viewBox="0 0 24 24" fill={star.colorVariant} className="absolute opacity-0"
          style={{ width: `${star.size}px`, height: `${star.size}px`, left: `${star.x}%`, top: `-5%`, filter: `drop-shadow(0 0 8px ${star.colorVariant})` }}
          animate={{ opacity: [0, 0.7, 0], y: ['0vh', '100vh'], rotate: [0, 240] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "linear" }}
        >
          <path d={star.path} />
        </motion.svg>
      ))}
    </div>
  );
};

const TransitionSparks = ({ color }: { color: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sparksCount = 50; 
  const sparks = useMemo(() => {
    return Array.from({ length: sparksCount }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 140 + 60; 
      return {
        x: `${Math.cos(angle) * distance}vw`, y: `${Math.sin(angle) * distance}vh`,
        size: Math.random() * 6 + 2, duration: Math.random() * 1.0 + 0.6, delay: Math.random() * 0.1,
      };
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
      {sparks.map((spark, i) => (
        <motion.div
          key={i} className="absolute rounded-full bg-white"
          style={{ width: spark.size, height: spark.size, boxShadow: `0 0 20px 4px ${color}, 0 0 40px 12px ${color}, 0 0 60px 20px #ffffff`, willChange: 'transform, opacity, shadow' }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: [1, 1, 0], x: spark.x, y: spark.y, scale: [0, 3, 0.2] }}
          transition={{ duration: spark.duration, delay: spark.delay, ease: "easeOut" }}
        />
      ))}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, ease: "easeInOut" }} 
        className="absolute inset-0 bg-[#0f0c29]"
      />
    </div>
  );
};

interface MagicalBookProps {
  heroImage?: string;
  transitionSoundSrc?: string; 
  accentColor?: string; 
  onOpen: () => void;
}

export function MagicalBook({
  heroImage = '/placeholder-hero.jpg',
  transitionSoundSrc = '/sounds/magic-woosh.mp3',
  accentColor = '#ffd700', 
  onOpen,
}: MagicalBookProps) {
  
  const [step, setStep] = useState<'idle' | 'playing' | 'fading'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Inicia el video y desaparece la UI
  const handleClick = () => {
    if (step !== 'idle') return;
    setStep('playing'); 
    
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.warn("Auto-play prevenido por el navegador", e));
    }
  };

  // Al finalizar, hace la transición a la siguiente pantalla
  const handleVideoEnded = () => {
    setStep('fading');
    
    try {
      const wooshAudio = new window.Audio(transitionSoundSrc);
      wooshAudio.volume = 0.7; 
      wooshAudio.play().catch(e => console.log("Prevención nativa de audio", e));
    } catch(err) {
      console.warn("No se pudo reproducir el sonido de transición", err);
    }

    setTimeout(() => {
      onOpen(); 
    }, 1200);
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden relative bg-black">
      
      {/* 1. Fondos ambientales detrás de todo */}
      <AmbientVideoBackground heroImage={heroImage} />

      {/* 2. VIDEO A PANTALLA COMPLETA */}
      <motion.div
        animate={step}
        variants={{
          idle: { opacity: 1, scale: 1 },
          playing: { opacity: 1, scale: 1 },
          fading: { opacity: 0, scale: 1.1, transition: { duration: 1.0, ease: "easeInOut" } }
        }}
        className="absolute inset-0 w-full h-full z-10"
      >
        <video
          ref={videoRef}
          src="/video-libro.mp4"
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          // object-cover asegura que llene la pantalla sin márgenes negros
          className="w-full h-full object-cover"
        />

        {/* Gradiente sutil para que el botón siempre sea legible sobre el primer frame del video */}
        <AnimatePresence>
          {step === 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" 
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3. Partículas mágicas (Por encima del video, solo en estado idle) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {step === 'idle' && (
          <>
            <MagicalFireflies color={accentColor} />
            <FallingStars accentColor={accentColor} />
          </>
        )}
      </div>

      {/* 4. Transición de destellos al finalizar */}
      {step === 'fading' && <TransitionSparks color={accentColor} />}

      {/* 5. INTERFAZ: BOTÓN SOBREPUESTO */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-end pb-20 sm:pb-28">
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.div
              key="ui-btn"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center pointer-events-auto"
            >
              <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }} 
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="font-sans text-[11px] md:text-xs uppercase tracking-[0.45em] mb-6 md:mb-8 text-[#ffd700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold"
              >
                Toca para descubrir el secreto
              </motion.p>
              
              <button
                onClick={handleClick}
                className="px-10 py-4 md:px-12 md:py-4 font-sans font-bold text-[#07040f] rounded-sm shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-95 transition-all duration-300 cursor-pointer text-[11px] md:text-xs uppercase tracking-[0.2em] relative overflow-hidden group bg-gradient-to-r from-[#ffd700] via-[#ffdf33] to-[#b8860b] hover:shadow-[0_0_40px_rgba(255,215,0,0.7)]"
              >
                <span className="relative z-10">Abrir Libro Mágico</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}