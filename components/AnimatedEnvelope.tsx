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

const BookPageFlips = ({ color }: { color: string }) => {
  const flipCount = 8;
  const flips = useMemo(() => {
    return Array.from({ length: flipCount }).map((_, i) => ({
      delay: i * 0.15,
      duration: 0.8 + Math.random() * 0.4,
      rotation: Math.random() > 0.5 ? 1 : -1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {flips.map((flip, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${30 + i * 8}%`,
            top: `${20 + Math.random() * 60}%`,
            width: '60px',
            height: '80px',
            perspective: '1000px',
          }}
          initial={{ opacity: 0, rotateY: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 0],
            rotateY: [0, flip.rotation * 180, flip.rotation * 360],
            y: [0, -30, -60],
          }}
          transition={{
            duration: flip.duration,
            delay: flip.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        >
          <div
            className="w-full h-full rounded-sm border border-[#ffd700]/40 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
            style={{
              boxShadow: `inset 0 0 10px rgba(255,215,0,0.1), 0 0 8px ${color}40`,
            }}
          />
        </motion.div>
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
  bookCoverTexture?: string;
  bookPageTexture?: string;
  bookBackTexture?: string;
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
  bookCoverTexture = '/paper1.png',
  bookPageTexture = '/paper2.png',
  bookBackTexture = '/FLAP.png',
  heroImageSrc = '/images/placeholder-hero.jpg', 
  eventTime = "08:00 PM - 11/07/2026",
  welcomeMessage = "¡Bienvenidos a nuestra gran celebración de 15 años!",
  guestName = "Invitado Especial",
  primaryColor = '#0a0514', 
  accentColor = '#ffd700', 
  backgroundColor = '#0a0514', 
  onOpen,
}: AnimatedEnvelopeProps) {
  
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'idle' | 'opening' | 'pageRevealing' | 'fading'>('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const assetsToLoad = [
      bookCoverTexture,
      bookPageTexture,
      bookBackTexture,
      heroImageSrc
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
  }, [bookCoverTexture, bookPageTexture, bookBackTexture, heroImageSrc]);

  const springEasing = [0.34, 1.56, 0.64, 1];

  const handleClick = () => {
    if (step !== 'idle' || isAnimating) return;
    setIsAnimating(true);
    setStep('opening'); 
    
    // Simular el paso de páginas
    setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    setTimeout(() => {
      setCurrentPage(2);
    }, 1100);

    setTimeout(() => {
      setStep('pageRevealing'); 
    }, 1800);

    setTimeout(() => {
      setStep('fading'); 
    }, 5000);

    setTimeout(() => {
      onOpen(); 
    }, 6000);
  };

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

      {step !== 'idle' && step !== 'fading' && <BookPageFlips color={accentColor} />}

      {step === 'fading' && <TransitionSparks color={accentColor} />}

      <div className="flex flex-col items-center gap-14 w-full max-w-2xl relative z-10">
        
        <motion.div
          onClick={handleClick}
          animate={
            step === 'fading' 
              ? { scale: 0.8, opacity: 0, y: 30 } 
              : { scale: 1, opacity: 1, y: 0 }
          }
          whileHover={step === 'idle' ? { scale: 1.02, y: -5 } : {}}
          transition={{ duration: 1, ease: springEasing }}
          className={`relative w-full ${step === 'idle' ? 'cursor-pointer' : ''}`}
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          <div className="relative w-full shadow-[0_30px_60px_rgba(0,0,0,0.8)]" style={{ aspectRatio: '16/10' }}>
            
            {/* Fondo del libro */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] overflow-hidden rounded-lg">
              <Image 
                src={bookBackTexture} 
                alt="Fondo del Libro" 
                fill 
                className="object-cover opacity-40" 
              />
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]" />
            </div>

            {/* Centro del libro (lomo) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] z-20 transform -translate-x-1/2 shadow-[0_0_20px_rgba(0,0,0,0.6)]" />

            {/* Página Izquierda */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{
                rotateY: step === 'opening' ? (currentPage >= 1 ? -120 : 0) : 
                         (step === 'pageRevealing' || step === 'fading') ? -180 : 0,
              }}
              transition={{ duration: step === 'opening' ? 0.7 : 1.2, ease: springEasing }}
              className="absolute left-0 top-0 w-1/2 h-full origin-right"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-[#f5f1de] rounded-l-lg shadow-[-5px_0_15px_rgba(0,0,0,0.4)]">
                <Image 
                  src={bookPageTexture} 
                  alt="Página Izquierda" 
                  fill 
                  className="object-cover opacity-30" 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  {(step === 'pageRevealing' || step === 'fading') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="space-y-6"
                    >
                      <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold text-[#0a0514]">
                        Para: {guestName}
                      </p>
                      <p className="font-serif italic text-base md:text-lg leading-relaxed text-[#0a0514] max-w-xs">
                        {welcomeMessage}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Página Derecha */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{
                rotateY: step === 'opening' ? (currentPage >= 2 ? 120 : 0) : 
                         (step === 'pageRevealing' || step === 'fading') ? 0 : 0,
              }}
              transition={{ duration: step === 'opening' ? 0.7 : 1.2, ease: springEasing }}
              className="absolute right-0 top-0 w-1/2 h-full origin-left"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-[#f5f1de] rounded-r-lg shadow-[5px_0_15px_rgba(0,0,0,0.4)]">
                <Image 
                  src={bookPageTexture} 
                  alt="Página Derecha" 
                  fill 
                  className="object-cover opacity-30" 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  {(step === 'pageRevealing' || step === 'fading') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="space-y-6"
                    >
                      <div className="w-16 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-80" />
                      <p className="text-[9px] md:text-[10px] tracking-widest uppercase opacity-80 text-[#ffd700] font-bold">Recepción</p>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-[#0a0514]">
                        {eventTime}
                      </h3>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Decoración: XV en el lomo */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 opacity-5 pointer-events-none">
              <span className="text-[120px] font-serif font-bold text-white">XV</span>
            </div>
            
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
                Abre el libro para revelar la magia
              </motion.p>
              
              <button
                onClick={handleClick}
                className="px-10 py-4 font-sans font-bold text-[#0a0514] rounded-full shadow-lg active:scale-95 transition-all duration-300 cursor-pointer text-xs uppercase tracking-widest relative overflow-hidden group bg-gradient-to-r from-[#ffd700] to-[#b8860b] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]"
              >
                <span className="relative z-10">Abrir Libro Mágico</span>
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
                Pasando las páginas...
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
