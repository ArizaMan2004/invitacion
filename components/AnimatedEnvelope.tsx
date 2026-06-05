'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';

// --- FONDOS Y PARTÍCULAS ---
const AmbientVideoBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden bg-black">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-60"
    >
      <source src="/FONDO.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/80 via-transparent to-[#0a0514]/90" />
  </div>
);

const MagicalFireflies = ({ color }: { color: string }) => {
  const count = 30; 
  const firefliesData = useMemo(() => {
    const colors = [color, '#ffffff', '#e0b0ff'];
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 5,
      glowColor: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, [color]);

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
            boxShadow: `0 0 10px 2px ${data.glowColor}A0`,
          }}
          animate={{
            opacity: [0, 0.8, 0], 
            y: [0, -50, -100], 
            x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20],
          }}
          transition={{ duration: data.duration, delay: data.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

const FallingStars = ({ accentColor }: { accentColor: string }) => {
  const starCount = 15; 
  const starsData = useMemo(() => {
    const starPaths = [
      "M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z",
    ];
    return Array.from({ length: starCount }).map(() => ({
      path: starPaths[0],
      x: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 8,
      colorVariant: Math.random() > 0.4 ? '#ffffff' : accentColor 
    }));
  }, [accentColor]);

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
            filter: `drop-shadow(0 0 4px ${star.colorVariant})`, 
          }}
          animate={{ opacity: [0, 0.7, 0], y: ['0vh', '100vh'], rotate: [0, 360] }}
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

  const sparksCount = 45;
  const sparks = useMemo(() => {
    return Array.from({ length: sparksCount }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 30; 
      return {
        x: `${Math.cos(angle) * distance}vw`,
        y: `${Math.sin(angle) * distance}vh`,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 0.7 + 0.5,
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
            boxShadow: `0 0 10px 2px ${color}, 0 0 20px 5px ${color}`,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: spark.x,
            y: spark.y,
            scale: [0, 1.5, 0.5],
          }}
          transition={{ duration: spark.duration, delay: spark.delay, ease: "easeOut" }}
        />
      ))}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeIn" }}
        className="absolute inset-0 bg-[#0a0514]"
      />
    </div>
  );
};

interface AnimatedEnvelopeProps {
  envelopeBackTexture?: string;
  envelopeFrontTexture?: string;
  flapTexture?: string;
  sealImage?: string;
  heroImageSrc?: string; 
  eventTime?: string;
  welcomeMessage?: string;
  guestName?: string;
  primaryColor?: string; 
  accentColor?: string; 
  backgroundColor?: string; 
  onOpen: () => void;
}

export function AnimatedEnvelope({
  envelopeBackTexture = '/paper1.png',
  envelopeFrontTexture = '/paper2.png',
  flapTexture = '/FLAP.png',
  sealImage = '/sello.png',
  heroImageSrc = '/images/placeholder-hero.jpg', 
  eventTime = "08:00 PM - 11/07/2026",
  welcomeMessage = "¡Bienvenidos a nuestra gran celebración de 15 años!",
  guestName = "Invitado Especial",
  primaryColor = '#0a0514', 
  accentColor = '#ffd700', 
  backgroundColor = '#0a0514', 
  onOpen,
}: AnimatedEnvelopeProps) {
  
  // --- NUEVO ESTADO PARA EL PRELOADER ---
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'idle' | 'opening' | 'paperUp' | 'fading'>('idle');
  const [isAnimating, setIsAnimating] = useState(false);

  // --- LÓGICA DE PRECARGA (PRELOADER) ---
  useEffect(() => {
    let isMounted = true;
    
    // Array con todos los assets que queremos que estén listos antes de revelar la pantalla
    const assetsToLoad = [
      envelopeBackTexture,
      envelopeFrontTexture,
      flapTexture,
      sealImage,
      heroImageSrc
    ];

    const loadImages = Promise.all(
      assetsToLoad.map((src) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = src;
          // Resolvemos tanto si carga bien como si hay error para no dejar al usuario atrapado en el loader
          img.onload = resolve;
          img.onerror = resolve; 
        });
      })
    );

    loadImages.then(() => {
      if (isMounted) {
        // Un pequeño delay de 800ms para asegurar que el video de fondo empiece a reproducirse y la transición sea suave
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [envelopeBackTexture, envelopeFrontTexture, flapTexture, sealImage, heroImageSrc]);

  const handleClick = () => {
    if (step !== 'idle' || isAnimating) return;
    setIsAnimating(true);
    setStep('opening'); 
    
    setTimeout(() => {
      setStep('paperUp'); 
    }, 1200);

    setTimeout(() => {
      setStep('fading'); 
    }, 4500);

    setTimeout(() => {
      onOpen(); 
    }, 5600);
  };

  const springEasing = [0.34, 1.56, 0.64, 1]; 

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor }}
      className="h-[100dvh] min-h-[600px] flex items-center justify-center p-4 overflow-hidden relative"
    >
      <AmbientVideoBackground />

      {/* --- PANTALLA DE CARGA (OVERLAY) --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0514]"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-t-2 border-r-2 border-[#ffd700] rounded-full mb-8 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
            />
            <p className="text-[#ffd700] text-xs tracking-[0.4em] uppercase font-bold animate-pulse font-sans drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
              Preparando la magia...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMAGEN DEL HERO FIJA EN TODA LA PÁGINA (Se revela cuando se quita el loader) */}
      <motion.div 
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
        }}
      >
        <img 
          src={heroImageSrc} 
          alt="Hero Fondo" 
          className="w-full h-full object-cover opacity-70" 
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/70 via-[#0a0514]/30 to-transparent" />
      </motion.div>
      
      {step === 'idle' && (
        <>
          <MagicalFireflies color={accentColor} />
          <FallingStars accentColor={accentColor} />
        </>
      )}

      {step === 'fading' && <TransitionSparks color={accentColor} />}

      <div className="flex flex-col items-center gap-14 w-full max-w-md relative z-10">
        
        <motion.div
          onClick={handleClick}
          animate={
            step === 'fading' 
              ? { scale: 0.8, opacity: 0, y: 30 } 
              : { scale: 1, opacity: 1, y: 0, rotateX: step === 'paperUp' ? 5 : 0 }
          }
          whileHover={step === 'idle' ? { scale: 1.02, y: -5 } : {}}
          transition={{ duration: 1, ease: springEasing }}
          className={`relative w-full ${step === 'idle' ? 'cursor-pointer' : ''}`}
          style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
        >
          <div className="relative w-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-xl" style={{ aspectRatio: '4/3' }}>
            
            <div className="absolute inset-0 bg-[#04020a] rounded-xl overflow-hidden z-0">
              <Image 
                src={envelopeBackTexture} 
                alt="Fondo Interior" 
                fill 
                className="object-cover opacity-60 brightness-50" 
              />
              <div className="absolute inset-0 shadow-[inset_0_40px_60px_rgba(0,0,0,0.9)]" />
            </div>

            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={
                step === 'paperUp' || step === 'fading'
                  ? { y: -190, opacity: 1, scale: 1 } 
                  : { y: 0, opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 1.4, ease: springEasing }}
              className="absolute inset-x-5 top-5 rounded-lg p-6 md:p-8 text-center z-10 h-[105%]"
              style={{ 
                background: 'rgba(20, 15, 45, 0.95)', 
                backdropFilter: 'blur(2px)', 
                boxShadow: step === 'paperUp' || step === 'fading' 
                  ? '0 10px 20px rgba(0,0,0,0.8)'
                  : '0 -5px 15px rgba(0,0,0,0.6)',
                borderTop: '1px solid rgba(255,215,0,0.3)',
                borderLeft: '1px solid rgba(255,215,0,0.1)',
                borderRight: '1px solid rgba(255,215,0,0.1)',
              }}
            >
              <div className="h-full flex flex-col items-center justify-start pt-6 relative font-sans">
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#ffd700] opacity-80" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#ffd700] opacity-80" />

                <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 font-bold text-white drop-shadow-sm">
                  Para: {guestName}
                </p>
                <p className="font-serif italic text-lg md:text-xl mb-4 leading-relaxed text-white drop-shadow-sm">
                  {welcomeMessage}
                </p>
                
                <div className="w-16 h-[2px] mb-6 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-80" />
                
                <p className="text-[9px] md:text-[10px] tracking-widest uppercase mb-2 opacity-80 text-[#ffd700] font-bold">Recepción</p>
                <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-widest text-white drop-shadow-md">
                  {eventTime}
                </h3>
              </div>
            </motion.div>

            <div 
              className="absolute inset-0 rounded-xl z-20 pointer-events-none drop-shadow-[0_-5px_10px_rgba(0,0,0,0.3)] overflow-hidden"
              style={{ clipPath: 'polygon(0% 0%, 50% 38%, 100% 0%, 100% 100%, 0% 100%)' }}
            >
              <Image 
                src={envelopeFrontTexture} 
                alt="Frente del Sobre" 
                fill 
                className="object-cover" 
                priority
              />
              <div className="absolute inset-0 border border-white/5 rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <span className="text-[140px] font-serif font-bold text-white">XV</span>
              </div>
            </div>

            <motion.div
              initial={{ rotateX: 0, zIndex: 30 }}
              animate={{ 
                rotateX: step !== 'idle' ? -165 : 0, 
                y: step !== 'idle' ? -10 : 0,
                zIndex: (step === 'paperUp' || step === 'fading') ? 5 : 30 
              }}
              whileHover={step === 'idle' ? { rotateX: -15 } : {}}
              transition={{ duration: 1.4, ease: springEasing }}
              className="absolute inset-x-0 top-0 h-[65%] origin-top drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div 
                className="absolute inset-0"
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <Image src={flapTexture} alt="Textura Exterior" fill className="object-cover" priority />
                  <div className="absolute inset-0 border-t border-white/10" />
                </div>

                <div 
                  className="absolute inset-0" 
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                >
                  <Image src={flapTexture} alt="Textura Interior" fill className="object-cover" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ rotateX: 0, opacity: 1, scale: 1 }}
              animate={
                step !== 'idle' 
                  ? { rotateX: -160, opacity: 0, scale: 0.8, y: 30 } 
                  : { rotateX: 0, opacity: 1, scale: 1, y: 0 }
              }
              whileHover={step === 'idle' ? { rotateX: -15, scale: 1.05 } : {}}
              transition={{ duration: step !== 'idle' ? 0.8 : 1.4, ease: springEasing }}
              className="absolute left-1/2 top-[65%] origin-[center_-130%] z-40 pointer-events-none flex justify-center items-center"
              style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative w-28 h-28 -mt-14 -ml-14 drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]">
                <Image src={sealImage} alt="Sello de Cera" fill className="object-contain hover:brightness-125 transition-all duration-300" priority />
              </div>
            </motion.div>
            
          </div>
        </motion.div>

        {/* CONTROLES DE INTERFAZ */}
        <AnimatePresence mode="wait">
          {step === 'idle' && !isLoading ? (
            <motion.div
              key="ui-btn"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.9 }}
              transition={{ duration: 0.8, ease: springEasing }}
              className="text-center"
            >
              <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-sans text-[11px] uppercase tracking-[0.4em] mb-8 text-[#ffd700] drop-shadow-md font-bold"
              >
                Toca el sobre para revelar la magia
              </motion.p>
              
              <button
                onClick={handleClick}
                className="px-10 py-4 font-sans font-bold text-[#0a0514] rounded-full shadow-lg active:scale-95 transition-all duration-300 cursor-pointer text-xs uppercase tracking-widest relative overflow-hidden group bg-gradient-to-r from-[#ffd700] to-[#b8860b] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]"
              >
                <span className="relative z-10">Abrir Invitación</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
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
              <p className="text-[#ffd700] text-xs tracking-[0.5em] uppercase font-bold animate-pulse mt-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans">
                REVELANDO LA MAGIA...
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}