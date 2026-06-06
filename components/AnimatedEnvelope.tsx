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
          <div className="relative w-full shadow-[0_40px_80px_rgba(0,0,0,0.9)]" style={{ aspectRatio: '14/9' }}>
            
            {/* Contenedor 3D del libro cerrado */}
            <div className="relative w-full h-full">
              
              {/* TAPA TRASERA (CONTRAPORTADA) - Siempre visible en el fondo */}
              <div className="absolute left-0 top-0 w-1/2 h-full rounded-tl-2xl rounded-bl-2xl bg-gradient-to-b from-[#5a4a35] via-[#4a3a2a] to-[#3a2a1a] shadow-[-8px_0_25px_rgba(0,0,0,0.7)]">
                <Image 
                  src={bookCoverTexture} 
                  alt="Contraportada" 
                  fill 
                  className="object-cover opacity-50" 
                />
                <div className="absolute inset-0 border border-[#d4af37]/15 rounded-tl-2xl rounded-bl-2xl" />
                {/* Textura interior de cuero */}
                <div className="absolute inset-0 rounded-tl-2xl rounded-bl-2xl bg-gradient-to-r from-[#0a0a0a]/30 to-transparent" />
              </div>

              {/* LOMO (SPINE) - Siempre visible en el centro */}
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 w-12 bg-gradient-to-r from-[#2a1a10] via-[#3d2a18] to-[#2a1a10] z-50 transform -translate-x-1/2 shadow-[inset_-3px_0_10px_rgba(0,0,0,0.8),inset_3px_0_10px_rgba(0,0,0,0.8),0_0_25px_rgba(0,0,0,0.8)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Textura del lomo */}
                <div className="absolute inset-0 opacity-40 bg-cover" style={{ backgroundImage: `url(${bookBackTexture})` }} />
                {/* Decoración XV vertical en el lomo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#d4af37] text-xl font-serif font-bold opacity-50 transform -rotate-90">XV</span>
                </div>
                {/* Detalles 3D del lomo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </motion.div>

              {/* TAPA FRONTAL (PORTADA) - Se abre */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: step !== 'idle' ? -180 : 0,
                }}
                transition={{ duration: 1.8, ease: springEasing }}
                className="absolute right-0 top-0 w-1/2 h-full origin-left"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Frente de la tapa - PORTADA */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-[#6a5a45] via-[#5a4a35] to-[#3a2a1a] rounded-tr-2xl rounded-br-2xl shadow-[8px_0_25px_rgba(0,0,0,0.7)]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Image 
                    src={bookCoverTexture} 
                    alt="Portada del Libro" 
                    fill 
                    className="object-cover opacity-60" 
                  />
                  {/* Overlay decorativo de la portada */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
                  
                  {/* Contenido de la portada */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <div className="text-center space-y-6">
                      {/* Marco decorativo */}
                      <div className="inline-block px-6 py-4 border border-[#d4af37]/40 rounded-lg bg-[#0a0a0a]/30 backdrop-blur-sm">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#d4af37] drop-shadow-lg tracking-wider">XV</h2>
                        <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#d4af37]/70 mt-2">Años</p>
                      </div>
                      
                      {/* Decoración inferior */}
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/60" />
                        <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#d4af37]/60">Celebración</p>
                        <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]/60" />
                      </div>
                    </div>
                  </div>

                  {/* Bordes decorativos de la portada */}
                  <div className="absolute inset-0 border border-[#d4af37]/20 rounded-tr-2xl rounded-br-2xl" />
                  <div className="absolute top-6 right-6 w-12 h-12 border border-[#d4af37]/30 rounded-full" />
                  <div className="absolute bottom-6 left-6 w-8 h-8 border border-[#d4af37]/30 rounded-full" />
                </div>

                {/* Reverso de la tapa - INTERIOR */}
                <div 
                  className="absolute inset-0 bg-[#f5f1de] rounded-tr-2xl rounded-br-2xl"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <Image 
                    src={bookPageTexture} 
                    alt="Interior de Tapa" 
                    fill 
                    className="object-cover opacity-20" 
                  />
                  <div className="absolute inset-0 border border-[#d4af37]/10 rounded-tr-2xl rounded-br-2xl" />
                </div>
              </motion.div>

              {/* HOJAS APILADAS - Visibles solo cuando el libro está cerrado */}
              {step === 'idle' && (
                <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={`leaf-${i}`}
                      initial={{ zIndex: 40 - i, x: i * 2.5 }}
                      animate={{ zIndex: 40 - i }}
                      className="absolute top-0 bottom-0 w-full origin-left rounded-tr-2xl rounded-br-2xl bg-[#f5f5f5] shadow-[6px_2px_8px_rgba(0,0,0,0.3)]"
                      style={{
                        transformStyle: 'preserve-3d',
                        borderRadius: '0 16px 16px 0',
                      }}
                    >
                      <Image 
                        src={bookPageTexture} 
                        alt={`Hoja ${i}`} 
                        fill 
                        className="object-cover opacity-30 rounded-tr-2xl rounded-br-2xl" 
                      />
                      <div className="absolute inset-0 border border-[#ddd]/40 rounded-tr-2xl rounded-br-2xl" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* PÁGINAS INTERIORES REVELADAS - Visibles después de abrir */}
              {step !== 'idle' && (
                <>
                  {/* Página izquierda interior */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step === 'pageRevealing' || step === 'fading' ? 1 : 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute left-0 top-0 w-1/2 h-full rounded-tl-2xl rounded-bl-2xl bg-[#f5f1de] shadow-[-8px_0_20px_rgba(0,0,0,0.4)]"
                    style={{ zIndex: 10 }}
                  >
                    <Image 
                      src={bookPageTexture} 
                      alt="Página Izquierda" 
                      fill 
                      className="object-cover opacity-20" 
                    />
                    <div className="absolute inset-0 border border-[#d4af37]/10 rounded-tl-2xl rounded-bl-2xl" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      {(step === 'pageRevealing' || step === 'fading') && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="space-y-6"
                        >
                          <div className="space-y-3">
                            <p className="text-[9px] md:text-xs tracking-[0.3em] uppercase font-bold text-[#0a0514] opacity-60">
                              Para
                            </p>
                            <p className="text-2xl md:text-3xl font-serif font-bold text-[#0a0514]">
                              {guestName}
                            </p>
                          </div>
                          <div className="w-12 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Página derecha interior */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step === 'pageRevealing' || step === 'fading' ? 1 : 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute right-0 top-0 w-1/2 h-full rounded-tr-2xl rounded-br-2xl bg-[#f5f1de] shadow-[8px_0_20px_rgba(0,0,0,0.4)]"
                    style={{ zIndex: 10 }}
                  >
                    <Image 
                      src={bookPageTexture} 
                      alt="Página Derecha" 
                      fill 
                      className="object-cover opacity-20" 
                    />
                    <div className="absolute inset-0 border border-[#d4af37]/10 rounded-tr-2xl rounded-br-2xl" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      {(step === 'pageRevealing' || step === 'fading') && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1, delay: 0.9 }}
                          className="space-y-6"
                        >
                          <p className="text-xs md:text-sm leading-relaxed text-[#0a0514] italic max-w-xs">
                            {welcomeMessage}
                          </p>
                          
                          <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-6 h-[1px] bg-[#d4af37]/60" />
                              <p className="text-[9px] tracking-widest uppercase text-[#d4af37]/70 font-bold">Fecha</p>
                              <div className="w-6 h-[1px] bg-[#d4af37]/60" />
                            </div>
                            <h3 className="text-lg md:text-xl font-serif font-bold text-[#0a0514]">
                              {eventTime}
                            </h3>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
              
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
