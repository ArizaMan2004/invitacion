'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';

interface AmbientBackgroundProps {
  heroImage?: string;
}

const AmbientVideoBackground = ({ heroImage = '/hero-image.png' }: AmbientBackgroundProps) => (
  <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden bg-black">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
    >
      <source src="/FONDO.mp4" type="video/mp4" />
    </video>

    <div className="absolute inset-0 w-full h-full opacity-35 mix-blend-overlay select-none pointer-events-none transform scale-105 animate-[pulse_8s_ease-in-out_infinite]">
      <Image 
        src={heroImage} 
        alt="Hero Background Blended" 
        fill 
        className="object-cover object-center filter blur-[1px]" 
        priority
      />
    </div>

    <div className="absolute inset-0 bg-gradient-to-b from-[#0f0c29]/95 via-[#1a143a]/70 to-[#0b091a]/98" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,3,15,0.9)_100%)]" />
  </div>
);

const MagicalFireflies = ({ color }: { color: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = 40; 
  const firefliesData = useMemo(() => {
    const colors = [color, '#ffffff', '#e0b0ff', '#8a2be2', '#ffeed0'];
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      delay: Math.random() * 6,
      duration: Math.random() * 6 + 6,
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
            boxShadow: `0 0 16px 4px ${data.glowColor}B3, 0 0 30px 8px ${data.glowColor}50`,
          }}
          animate={{
            opacity: [0, 0.85, 0], 
            y: [0, -80, -160], 
            x: [0, Math.random() * 60 - 30, Math.random() * 80 - 40],
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

  const starCount = 14; 
  const starsData = useMemo(() => {
    const starPaths = [
      "M12 2 L14.8 8.6 L22 10.2 L17 15.4 L18.2 22 L12 18.8 L5.8 22 L7 15.4 L2 10.2 L9.2 8.6 Z",
    ];
    return Array.from({ length: starCount }).map(() => ({
      path: starPaths[0],
      x: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 10,
      colorVariant: Math.random() > 0.4 ? '#ffffff' : accentColor 
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
            filter: `drop-shadow(0 0 8px ${star.colorVariant})`, 
          }}
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
        x: `${Math.cos(angle) * distance}vw`,
        y: `${Math.sin(angle) * distance}vh`,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 1.0 + 0.6, 
        delay: Math.random() * 0.1,
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
            boxShadow: `0 0 20px 4px ${color}, 0 0 40px 12px ${color}, 0 0 60px 20px #ffffff`,
            willChange: 'transform, opacity, shadow'
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: spark.x,
            y: spark.y,
            scale: [0, 3, 0.2],
          }}
          transition={{ duration: spark.duration, delay: spark.delay, ease: "easeOut" }}
        />
      ))}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeInOut" }} 
        className="absolute inset-0 bg-[#0f0c29]"
      />
    </div>
  );
};

const MagicalAura = ({ color }: { color: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
    animate={{ 
      opacity: [0, 0.6, 0], 
      scale: [0.8, 1.8, 2.5],
      rotate: 45 
    }}
    transition={{ duration: 2.0, ease: "easeOut" }}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none mix-blend-screen z-0"
    style={{
      width: '150%',
      height: '150%',
      background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
      filter: 'blur(35px)'
    }}
  />
);

interface MagicalBookProps {
  bookCoverTexture?: string;
  bookInnerCoverTexture?: string;
  sealImage?: string;
  heroImage?: string;
  openSoundSrc?: string; 
  transitionSoundSrc?: string; // <-- NUEVA PROP PARA EL SFX DE TRANSICIÓN
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
  heroImage = '/hero-image.png',
  openSoundSrc = '/sounds/book-open.mp3', 
  transitionSoundSrc = '/sounds/magic-woosh.mp3', // <-- RUTA POR DEFECTO PARA EL WOOSH
  eventTime = "08:00 PM - 11/07/2026",
  welcomeMessage = "La magia comienza esta noche",
  guestName = "Invitado Especial",
  accentColor = '#ffd700', 
  onOpen,
}: MagicalBookProps) {
  
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'idle' | 'opening' | 'reading' | 'fading'>('idle');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const assetsToLoad = [
      bookCoverTexture,
      bookInnerCoverTexture,
      sealImage,
      heroImage
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
        }, 1000);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [bookCoverTexture, bookInnerCoverTexture, sealImage, heroImage]);

  const handleClick = () => {
    if (step !== 'idle' || isAnimating) return;
    setIsAnimating(true);
    setStep('opening'); 
    
    // SFX 1: Efecto sonoro de apertura nativo al momento del click
    try {
      const audio = new window.Audio(openSoundSrc);
      audio.volume = 0.6;
      audio.play().catch(e => console.log("Prevención nativa de auto-play", e));
    } catch(err) {
      console.warn("No se pudo iniciar el recurso de audio", err);
    }
    
    setTimeout(() => {
      setStep('reading'); 
    }, 1200); 

    setTimeout(() => {
      setStep('fading'); 
      
      // SFX 2: MAGIC WOOSH al momento exacto en que inicia la transición final
      try {
        const wooshAudio = new window.Audio(transitionSoundSrc);
        wooshAudio.volume = 0.7; // Volumen ligeramente superior para dar impacto
        wooshAudio.play().catch(e => console.log("Prevención nativa de auto-play", e));
      } catch(err) {
        console.warn("No se pudo reproducir el sonido woosh de transición", err);
      }
    }, 5200); 

    setTimeout(() => {
      onOpen(); 
    }, 6400); 
  };

  const bookVariants = {
    idle: { 
      rotateX: 24, 
      rotateY: 0,  
      rotateZ: 0,
      scale: 1, 
      z: 0,
      y: [0, -12, 0], 
      boxShadow: [
        "0px 30px 50px rgba(0,0,0,0.85), 0px 10px 20px rgba(255,215,0,0.05)",
        "0px 45px 65px rgba(0,0,0,0.95), 0px 15px 35px rgba(255,215,0,0.25)", 
        "0px 30px 50px rgba(0,0,0,0.85), 0px 10px 20px rgba(255,215,0,0.05)"
      ],
      transition: { 
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      },
      willChange: 'transform, box-shadow'
    },
    hover: {
      rotateX: 18, 
      rotateY: 0,
      rotateZ: 0,
      scale: 1.03,
      y: -8, 
      z: 20,
      boxShadow: "0px 40px 60px rgba(0,0,0,0.9), 0px 15px 30px rgba(255,215,0,0.15)",
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    opening: {
      rotateX: 0,  
      rotateY: 0,
      rotateZ: 0,
      scale: 1.02,
      y: 0,
      z: 120,
      boxShadow: "0px 20px 40px rgba(0,0,0,0.7), 0px 0px 60px rgba(255,215,0,0.4)", 
      transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } 
    },
    reading: {
      rotateX: 0,
      rotateY: 0,
      scale: 1.05,
      z: 160,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    fading: { 
      scale: 3.5, 
      z: 400, 
      y: 0,
      rotateX: 0,
      rotateY: 0,
      opacity: 0, 
      transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[100dvh] flex items-center justify-center p-4 overflow-hidden relative"
      style={{ perspective: '2300px' }} 
    >
      <AmbientVideoBackground heroImage={heroImage} />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#0d0a21]"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-t-2 border-r-2 border-[#ffd700] rounded-full mb-8 shadow-[0_0_25px_rgba(255,215,0,0.4)]"
            />
            <p className="text-[#ffd700] text-xs tracking-[0.5em] uppercase font-bold animate-pulse font-sans">
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

      <div className="flex flex-col items-center gap-10 md:gap-14 w-full max-w-[290px] sm:max-w-[330px] md:max-w-sm relative z-10">
        
        {step !== 'idle' && <MagicalAura color={accentColor} />}

        <motion.div
          onClick={handleClick}
          variants={bookVariants}
          initial="idle"
          animate={step}
          whileHover={step === 'idle' ? "hover" : undefined}
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          className={`relative w-full aspect-[3/4] ${step === 'idle' ? 'cursor-pointer' : ''} rounded-r-2xl z-10`}
        >
          
          <div 
            className="absolute left-0 top-0 bottom-[12px] w-[14px] bg-gradient-to-r from-[#0d0714] via-[#211633] to-[#0d0714] origin-left z-50 shadow-[inset_-3px_0_5px_rgba(0,0,0,0.5)] border-y border-white/5"
            style={{ transform: 'rotateY(-90deg) translateX(-7px)', backfaceVisibility: 'hidden' }}
          />

          <div 
            className="absolute right-0 top-0 bottom-[12px] w-[12px] bg-[#f0ebd8] origin-right z-10 border-y border-l border-[#dcd1b4] flex flex-col justify-between p-[1px] overflow-hidden opacity-90 shadow-[inset_4px_0_8px_rgba(0,0,0,0.15)]"
            style={{ transform: 'rotateY(90deg) translateX(6px)' }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-[#cbc0a2]/40" />
            ))}
          </div>

          <div 
            className="absolute bottom-0 left-[14px] right-[12px] h-[12px] bg-[#f0ebd8] origin-bottom z-10 border-x border-t border-[#dcd1b4] flex flex-row justify-between px-[2px] overflow-hidden opacity-90 shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)]"
            style={{ transform: 'rotateX(-90deg) translateY(6px)' }}
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="h-full w-[1px] bg-[#cbc0a2]/40" />
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#eadeca] via-[#f7f4eb] to-[#fffdf9] rounded-r-2xl border-y-[2px] border-r-[3px] border-[#c5ba9d] flex items-center justify-center overflow-hidden z-0 shadow-[inset_20px_0_30px_rgba(0,0,0,0.15)]">
            <motion.div
              initial={{ opacity: 0, filter: "blur(8px)", scale: 0.92 }}
              animate={
                (step === 'opening' || step === 'reading') 
                  ? { opacity: 1, filter: "blur(0px)", scale: 1 } 
                  : { opacity: 0 }
              }
              transition={{ duration: 1.4, delay: 1.0, ease: "easeOut" }} 
              className="relative z-10 w-[90%] md:w-[86%] h-[92%] md:h-[88%] border-2 border-[#b8860b]/20 rounded-lg p-5 md:p-7 flex flex-col items-center justify-center text-center bg-transparent"
            >
               <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#b8860b]/60 rounded-tl-sm" />
               <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#b8860b]/60 rounded-tr-sm" />
               <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#b8860b]/60 rounded-bl-sm" />
               <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#b8860b]/60 rounded-br-sm" />

              <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase mb-4 md:mb-6 font-bold text-[#966d0e]">
                Para: {guestName}
              </p>
              <p className="font-serif italic text-xl md:text-3xl mb-5 md:mb-7 leading-relaxed text-[#2c1a11] drop-shadow-sm">
                {welcomeMessage}
              </p>
              
              <div className="w-20 md:w-24 h-[2px] mb-6 md:mb-8 bg-gradient-to-r from-transparent via-[#b8860b]/60 to-transparent" />
              
              <p className="text-[8px] md:text-[10px] tracking-[0.25em] uppercase mb-2 text-[#966d0e] font-bold">La Cita</p>
              <h3 className="text-xl md:text-3xl font-serif font-bold tracking-wider text-[#2c1a11]">
                {eventTime}
              </h3>
            </motion.div>
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={`page-flip-${index}`}
              initial={{ rotateY: 0, zIndex: 20 - index }}
              animate={{ 
                rotateY: step !== 'idle' ? -155 + (index * 3) : 0, 
                zIndex: step !== 'idle' ? 5 + index : 20 - index 
              }}
              transition={{ 
                duration: 1.3, 
                delay: step !== 'idle' ? 0.35 + (index * 0.12) : 0, 
                ease: [0.25, 1, 0.5, 1] 
              }}
              className="absolute inset-0 origin-left pointer-events-none"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#e3dac9] via-[#fcfaf2] to-[#fffefb] rounded-r-2xl border-y-[1px] border-r-[2px] border-[#d4cbb3] shadow-[inset_18px_0_25px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-between items-center"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden', 
                  transform: `translateZ(${0.8 + (5 - index) * 0.2}px)` 
                }}
              >
                <div className="w-full h-full border border-[#b8860b]/10 rounded-xl relative p-2 flex flex-col justify-between opacity-60">
                  <div className="flex justify-between w-full text-[7px] text-[#b8860b]/40 font-serif">
                    <span>✦ IIV</span><span>✦ VIX</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#b8860b]/10 self-center flex items-center justify-center text-[10px] text-[#b8860b]/30 font-serif">
                    📜
                  </div>
                  <div className="w-12 h-[1px] bg-[#b8860b]/20 self-center" />
                </div>
              </div>
              
              <div 
                className="absolute inset-0 bg-gradient-to-l from-[#dcd3be] via-[#f5f0e1] to-[#faf8f2] rounded-l-2xl border-y-[1px] border-l-[2px] border-[#c0b59b] shadow-[12px_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col justify-between opacity-95"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden', 
                  transform: `rotateY(180deg) translateZ(${1 + index * 0.2}px)` 
                }}
              >
                <div className="w-full h-full border border-[#b8860b]/10 rounded-xl relative opacity-40 rotate-180" />
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ rotateY: 0, zIndex: 30 }}
            animate={{ 
              rotateY: step !== 'idle' ? -162 : 0, 
              zIndex: step === 'reading' || step === 'fading' ? 4 : 30 
            }}
            transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 origin-left"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            <div 
              className="absolute inset-0 rounded-r-2xl overflow-hidden border-l-[5px] border-[#0c0617]"
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(2.5px)', 
              }}
            >
              <Image src={bookCoverTexture} alt="Portada" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
              <div className="absolute inset-0 border border-white/10 rounded-r-2xl" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div 
                   animate={{ scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.18)", "brightness(1)"] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                   className="relative w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_20px_20px_rgba(0,0,0,0.95)]"
                 >
                   <Image src={sealImage} alt="Emblema Mágico" fill className="object-contain" priority />
                 </motion.div>
              </div>
            </div>

            <div 
              className="absolute inset-0 rounded-l-2xl overflow-hidden bg-[#07040f]" 
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg) translateZ(1.2px)' 
              }}
            >
              <Image src={bookInnerCoverTexture} alt="Interior Portada" fill className="object-cover opacity-50" />
              <div className="absolute inset-0 shadow-[inset_-25px_0_50px_rgba(0,0,0,0.95)]" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/60" />
            </div>
          </motion.div>
          
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'idle' && !isLoading ? (
            <motion.div
              key="ui-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.85 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="font-sans text-[10px] md:text-xs uppercase tracking-[0.45em] mb-6 md:mb-8 text-[#ffd700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-bold"
              >
                Abre el libro para descubrir su secreto
              </motion.p>
              
              <button
                onClick={handleClick}
                className="px-8 py-3.5 md:px-12 md:py-4 font-sans font-bold text-[#07040f] rounded-sm shadow-[0_0_25px_rgba(255,215,0,0.25)] active:scale-95 transition-all duration-300 cursor-pointer text-[10px] md:text-xs uppercase tracking-[0.2em] relative overflow-hidden group bg-gradient-to-r from-[#ffd700] via-[#ffdf33] to-[#b8860b] hover:shadow-[0_0_40px_rgba(255,215,0,0.7)]"
              >
                <span className="relative z-10">Abrir Libro Mágico</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
              </button>
            </motion.div>
          ) : step !== 'idle' ? (
            <motion.div
              key="ui-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: step === 'fading' ? 0 : 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-[#ffd700] text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold animate-pulse mt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-sans">
                REVELANDO EL CONTENIDO...
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}