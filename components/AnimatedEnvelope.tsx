'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';

const AmbientVideoBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden bg-black">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-50"
    >
      <source src="/FONDO.mp4" type="video/mp4" />
    </video>
    {/* Degradado profundo en tonos morados/azules oscuros para la estética mágica */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0f0c29]/90 via-[#302b63]/60 to-[#24243e]/95" />
  </div>
);

const MagicalFireflies = ({ color }: { color: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = 35; 
  const firefliesData = useMemo(() => {
    const colors = [color, '#ffffff', '#e0b0ff', '#8a2be2'];
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 5,
      glowColor: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, [color]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {firefliesData.map((data, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-0"
          style={{
            backgroundColor: data.glowColor,
            width: `${data.size}px`,
            height: `${data.size}px`,
            left: `${data.x}%`,
            top: `${data.y}%`,
            boxShadow: `0 0 12px 3px ${data.glowColor}A0`,
          }}
          animate={{
            opacity: [0, 0.9, 0], 
            y: [0, -60, -120], 
            x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25],
          }}
          transition={{ duration: data.duration, delay: data.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const FallingStars = ({ accentColor }: { accentColor: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const starCount = 12; 
  const starsData = useMemo(() => {
    const starPaths = [
      "M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z",
    ];
    return Array.from({ length: starCount }).map(() => ({
      path: starPaths[0],
      x: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 10,
      duration: Math.random() * 12 + 8,
      colorVariant: Math.random() > 0.5 ? '#ffffff' : accentColor 
    }));
  }, [accentColor]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {starsData.map((star, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          fill={star.colorVariant}
          className="absolute opacity-0"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `-5%`,
            filter: `drop-shadow(0 0 6px ${star.colorVariant})`, 
          }}
          animate={{ opacity: [0, 0.8, 0], y: ['0vh', '100vh'], rotate: [0, 180] }}
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

  const sparksCount = 60;
  const sparks = useMemo(() => {
    return Array.from({ length: sparksCount }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 40; 
      return {
        x: `${Math.cos(angle) * distance}vw`,
        y: `${Math.sin(angle) * distance}vh`,
        size: Math.random() * 5 + 2,
        duration: Math.random() * 0.8 + 0.6,
        delay: Math.random() * 0.2,
      };
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
      {sparks.map((spark, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: spark.size,
            height: spark.size,
            boxShadow: `0 0 15px 3px ${color}, 0 0 30px 8px ${color}`,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: spark.x,
            y: spark.y,
            scale: [0, 2, 0.5],
          }}
          transition={{ duration: spark.duration, delay: spark.delay, ease: "easeOut" }}
        />
      ))}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeIn" }}
        className="absolute inset-0 bg-[#0f0c29]"
      />
    </div>
  );
};

interface MagicalBookProps {
  bookCoverTexture?: string;
  bookInnerCoverTexture?: string;
  sealImage?: string;
  eventTime?: string;
  welcomeMessage?: string;
  guestName?: string;
  accentColor?: string; 
  onOpen: () => void;
}

export function MagicalBook({
  bookCoverTexture = '/cover-texture.png',
  bookInnerCoverTexture = '/inner-cover.png',
  sealImage = '/sello.png',
  eventTime = "08:00 PM - 11/07/2026",
  welcomeMessage = "La magia comienza esta noche",
  guestName = "Invitado Especial",
  accentColor = '#ffd700', 
  onOpen,
}: Omit<MagicalBookProps, 'pageTexture'>) {
  
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'idle' | 'opening' | 'reading' | 'fading'>('idle');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const assetsToLoad = [
      bookCoverTexture,
      bookInnerCoverTexture,
      sealImage
    ];

    const loadImages = Promise.all(
      assetsToLoad.map((src) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; 
        });
      })
    );

    loadImages.then(() => {
      if (isMounted) {
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [bookCoverTexture, bookInnerCoverTexture, sealImage]);

  const handleClick = () => {
    if (step !== 'idle' || isAnimating) return;
    setIsAnimating(true);
    setStep('opening'); 
    
    setTimeout(() => {
      setStep('reading'); 
    }, 1500);

    setTimeout(() => {
      setStep('fading'); 
    }, 5000);

    setTimeout(() => {
      onOpen(); 
    }, 6200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[100dvh] flex items-center justify-center p-4 overflow-hidden relative"
    >
      <AmbientVideoBackground />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#0f0c29]"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-t-2 border-r-2 border-[#ffd700] rounded-full mb-8 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
            />
            <p className="text-[#ffd700] text-xs tracking-[0.4em] uppercase font-bold animate-pulse font-sans">
              Invocando la Magia...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 'idle' && (
        <>
          <MagicalFireflies color={accentColor} />
          <FallingStars accentColor={accentColor} />
        </>
      )}

      {step === 'fading' && <TransitionSparks color={accentColor} />}

      <div className="flex flex-col items-center gap-8 md:gap-12 w-full max-w-[280px] sm:max-w-[320px] md:max-w-sm relative z-10">
        
        <motion.div
          onClick={handleClick}
          animate={
            step === 'fading' 
              ? { scale: 0.85, opacity: 0, y: -40, filter: "blur(10px)" } 
              : { scale: 1, opacity: 1, y: 0, rotateX: step === 'reading' ? 10 : 0 }
          }
          whileHover={step === 'idle' ? { scale: 1.03, y: -5, boxShadow: "0 25px 50px rgba(0,0,0,0.8)" } : {}}
          // Movimiento de retroceso general muy sutil
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`relative w-full aspect-[3/4] ${step === 'idle' ? 'cursor-pointer' : ''} rounded-r-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9)]`}
          style={{ perspective: '2500px', transformStyle: 'preserve-3d' }}
        >
          
          {/* 1. BASE DEL LIBRO (DONDE SE DETIENE LA BRISA Y APARECE EL TEXTO) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#e5e5e5] via-[#ffffff] to-[#fafafa] rounded-r-2xl border-y-[3px] border-r-[3px] border-[#d0d0d0] flex items-center justify-center overflow-hidden z-0 shadow-[inset_15px_0_25px_rgba(0,0,0,0.12)]">
            
            {/* TEXTO DE LA INVITACIÓN */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
              animate={
                (step === 'opening' || step === 'reading') 
                  ? { opacity: 1, filter: "blur(0px)", scale: 1 } 
                  : { opacity: 0 }
              }
              // Aparece cuando terminan de volar las hojas
              transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
              className="relative z-10 w-[90%] md:w-[85%] h-[90%] md:h-[85%] border border-[#b8860b]/30 rounded-lg p-4 md:p-6 flex flex-col items-center justify-center text-center bg-transparent"
            >
               <div className="absolute top-3 left-3 md:top-4 md:left-4 w-4 h-4 md:w-6 md:h-6 border-t border-l border-[#b8860b] opacity-80" />
               <div className="absolute top-3 right-3 md:top-4 md:right-4 w-4 h-4 md:w-6 md:h-6 border-t border-r border-[#b8860b] opacity-80" />
               <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-4 h-4 md:w-6 md:h-6 border-b border-l border-[#b8860b] opacity-80" />
               <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-4 h-4 md:w-6 md:h-6 border-b border-r border-[#b8860b] opacity-80" />

              <p className="text-[9px] md:text-xs tracking-[0.3em] uppercase mb-4 md:mb-6 font-bold text-[#b8860b]">
                Para: {guestName}
              </p>
              <p className="font-serif italic text-lg md:text-2xl mb-4 md:mb-6 leading-relaxed text-[#2b1810]">
                {welcomeMessage}
              </p>
              
              <div className="w-16 md:w-20 h-[2px] mb-6 md:mb-8 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent opacity-80" />
              
              <p className="text-[8px] md:text-[10px] tracking-[0.2em] uppercase mb-1 md:mb-2 text-[#b8860b] font-bold">La Cita</p>
              <h3 className="text-xl md:text-3xl font-serif font-bold tracking-widest text-[#2b1810]">
                {eventTime}
              </h3>
            </motion.div>
          </div>

          {/* 2. PÁGINAS QUE VUELAN (EFECTO BRISA MÁGICA) */}
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={`page-flip-${index}`}
              // Al cerrarse, la página 0 es la de más arriba (zIndex 20)
              initial={{ rotateY: 0, zIndex: 20 - index }}
              animate={{ 
                // Abanico de hojas hacia la izquierda
                rotateY: step !== 'idle' ? -160 + (index * 2) : 0, 
                // Al caer a la izquierda, el zIndex se invierte para que caigan una sobre otra
                zIndex: step !== 'idle' ? 5 + index : 20 - index 
              }}
              transition={{ 
                duration: 0.8, 
                // Retraso para que la tapa abra primero, y las hojas la sigan
                delay: step !== 'idle' ? 0.4 + (index * 0.12) : 0, 
                ease: [0.25, 1, 0.5, 1] 
              }}
              className="absolute inset-0 origin-left pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Frente de la hoja */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#e5e5e5] via-[#ffffff] to-[#fafafa] rounded-r-2xl border-y-[2px] border-r-[2px] border-[#e0e0e0] shadow-[inset_15px_0_20px_rgba(0,0,0,0.05)]"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden', 
                  transform: `translateZ(${1 + (6 - index) * 0.1}px)` 
                }}
              />
              {/* Reverso de la hoja (Se ve cuando están tiradas a la izquierda) */}
              <div 
                className="absolute inset-0 bg-gradient-to-l from-[#e5e5e5] via-[#f5f5f5] to-[#fafafa] rounded-l-2xl border-y-[2px] border-l-[2px] border-[#d0d0d0] shadow-[10px_0_20px_rgba(0,0,0,0.1)]"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden', 
                  // Elevación Z para que aterricen sobre la tapa interior sin atravesarla
                  transform: `rotateY(180deg) translateZ(${1.5 + index * 0.2}px)` 
                }}
              />
            </motion.div>
          ))}

          {/* 3. PORTADA DEL LIBRO (LA JEFA) */}
          <motion.div
            initial={{ rotateY: 0, zIndex: 30 }}
            animate={{ 
              rotateY: step !== 'idle' ? -165 : 0, 
              // zIndex 4 para que sea la base absoluta de todo lo que cae a la izquierda
              zIndex: step === 'reading' || step === 'fading' ? 4 : 30 
            }}
            transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 origin-left"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* CARA EXTERNA (Frente de la tapa) */}
            <div 
              className="absolute inset-0 rounded-r-2xl overflow-hidden border-l-[4px] md:border-l-[6px] border-[#0a0514]"
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(2px)', 
                boxShadow: '10px 0 25px rgba(0,0,0,0.7)' 
              }}
            >
              <Image src={bookCoverTexture} alt="Portada" fill className="object-cover" priority />
              <div className="absolute inset-0 border border-white/10 rounded-r-2xl" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)]">
                   <Image src={sealImage} alt="Emblema Mágico" fill className="object-contain hover:brightness-125 transition-all duration-300" priority />
                 </div>
              </div>
            </div>

            {/* CARA INTERNA (Reverso de la portada, la textura morada) */}
            <div 
              className="absolute inset-0 rounded-l-2xl overflow-hidden bg-[#05020a]" 
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg) translateZ(1px)' 
              }}
            >
              <Image src={bookInnerCoverTexture} alt="Interior Portada" fill className="object-cover opacity-60" />
              <div className="absolute inset-0 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.9)]" />
            </div>
          </motion.div>
          
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'idle' && !isLoading ? (
            <motion.div
              key="ui-btn"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-sans text-[9px] md:text-[11px] uppercase tracking-[0.4em] mb-6 md:mb-8 text-[#ffd700] drop-shadow-md font-bold"
              >
                Abre el libro para descubrir su secreto
              </motion.p>
              
              <button
                onClick={handleClick}
                className="px-6 py-3 md:px-10 md:py-4 font-sans font-bold text-[#0a0514] rounded-sm shadow-[0_0_20px_rgba(255,215,0,0.2)] active:scale-95 transition-all duration-300 cursor-pointer text-[10px] md:text-xs uppercase tracking-widest relative overflow-hidden group bg-gradient-to-r from-[#ffd700] via-[#ffdf33] to-[#b8860b] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]"
              >
                <span className="relative z-10">Abrir Libro Mágico</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </button>
            </motion.div>
          ) : step !== 'idle' ? (
            <motion.div
              key="ui-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: step === 'fading' ? 0 : 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <p className="text-[#ffd700] text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold animate-pulse mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans">
                REVELANDO EL CONTENIDO...
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}