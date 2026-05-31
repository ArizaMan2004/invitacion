'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import Image from 'next/image';

// --- FONDOS Y PARTÍCULAS (Heredados de la vista principal) ---
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
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
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
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
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

interface AnimatedEnvelopeProps {
  paperTexture?: string;
  flapTexture?: string;
  sealImage?: string;
  filigreeImage?: string;
  eventTime?: string;
  welcomeMessage?: string;
  guestName?: string;
  primaryColor?: string; 
  accentColor?: string; 
  backgroundColor?: string; 
  onOpen: () => void;
}

export function AnimatedEnvelope({
  paperTexture = '/textura-verde.jpg',
  flapTexture = '/FLAP.png',
  sealImage = '/sello.png',
  filigreeImage = '/filigrana.png',
  eventTime = "19:00 HRS",
  welcomeMessage = "¡Bienvenidos a nuestra gran celebración de 15 años!",
  guestName = "Invitado Especial",
  primaryColor = '#0a0514', 
  accentColor = '#ffd700', 
  backgroundColor = '#0a0514', 
  onOpen,
}: AnimatedEnvelopeProps) {
  const [step, setStep] = useState<'idle' | 'opening' | 'paperUp' | 'fading'>('idle');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (step !== 'idle' || isAnimating) return;
    setIsAnimating(true);
    setStep('opening'); 
    
    // El papel sube
    setTimeout(() => {
      setStep('paperUp'); 
    }, 1200);

    // Zoom-in cinematográfico inmersivo
    setTimeout(() => {
      setStep('fading'); 
    }, 4500);

    // Desmontaje del sobre e inicio de la SPA
    setTimeout(() => {
      onOpen(); 
    }, 5600); // Reducido ligeramente para empalmar con el zoom
  };

  // Curvas de animación (Custom Easing) para máxima fluidez
  const springEasing = [0.34, 1.56, 0.64, 1]; 
  const cinematicZoomEasing = [0.65, 0, 0.15, 1]; // Inicio lento, aceleración máxima, fin suave

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: cinematicZoomEasing } }}
      style={{ backgroundColor }}
      className="h-[100dvh] min-h-[600px] flex items-center justify-center p-4 overflow-hidden relative"
    >
      {/* 1. FONDOS MÁGICOS IGUALES A LA SPA */}
      <AmbientVideoBackground />
      <MagicalFireflies color={accentColor} />
      <FallingStars accentColor={accentColor} />

      {/* 2. CONTENIDO INTERACTIVO */}
      <div className="flex flex-col items-center gap-14 w-full max-w-md relative z-10">
        
        {/* SOBRE COMPLETO CON TRANSICIÓN DE ZOOM INMERSIVO */}
        <motion.div
          onClick={handleClick}
          animate={
            step === 'fading' 
              ? { scale: 15, opacity: 0, y: 300, rotateX: 5 } // La cámara "atraviesa" la carta
              : { scale: 1, opacity: 1, y: 0, rotateX: step === 'paperUp' ? 5 : 0 }
          }
          whileHover={step === 'idle' ? { scale: 1.02, y: -5 } : {}}
          transition={{ 
            duration: step === 'fading' ? 1.5 : 1, 
            ease: step === 'fading' ? cinematicZoomEasing : springEasing 
          }}
          className={`relative w-full ${step === 'idle' ? 'cursor-pointer' : ''}`}
          style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
        >
          <div className="relative w-full shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-xl" style={{ aspectRatio: '4/3' }}>
            
            {/* FONDO INTERIOR DEL SOBRE */}
            <div className="absolute inset-0 bg-[#04020a] rounded-xl overflow-hidden z-10">
               <div className="absolute inset-0 shadow-[inset_0_40px_60px_rgba(0,0,0,0.9)]" />
            </div>

            {/* TARJETA DE INVITACIÓN (Alineada con los colores de InvitationSPA) */}
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={
                step === 'paperUp' || step === 'fading'
                  ? { y: -190, opacity: 1, scale: 1 } 
                  : { y: 0, opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 1.4, ease: springEasing }}
              className="absolute inset-x-5 top-5 rounded-lg p-6 md:p-8 text-center z-20 h-[105%]"
              style={{ 
                background: 'rgba(20, 15, 45, 0.95)', 
                backdropFilter: 'blur(10px)',
                boxShadow: step === 'paperUp' || step === 'fading' 
                  ? '0_10px_30px_rgba(0,0,0,0.8), inset 0 0 20px rgba(255,215,0,0.1)'
                  : '0_-15px_40px_rgba(0,0,0,0.6), inset 0 0 20px rgba(255,215,0,0.1)',
                borderTop: '1px solid rgba(255,215,0,0.3)',
                borderLeft: '1px solid rgba(255,215,0,0.1)',
                borderRight: '1px solid rgba(255,215,0,0.1)',
              }}
            >
              <div className="h-full flex flex-col items-center justify-start pt-6 relative font-sans">
                {/* Esquinas doradas mágicas */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#ffd700] opacity-80" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#ffd700] opacity-80" />

                <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 font-bold text-white drop-shadow-md">
                  Para: {guestName}
                </p>
                <p className="font-serif italic text-lg md:text-xl mb-4 leading-relaxed text-white drop-shadow-md">
                  {welcomeMessage}
                </p>
                
                <div className="w-16 h-[2px] mb-6 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-80" />
                
                <p className="text-[9px] md:text-[10px] tracking-widest uppercase mb-2 opacity-80 text-[#ffd700] font-bold">Recepción</p>
                <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-widest text-white drop-shadow-lg">
                  {eventTime}
                </h3>
              </div>
            </motion.div>

            {/* CUERPO DEL SOBRE INFERIOR */}
            <div className="absolute inset-0 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-30 overflow-hidden bg-black">
              <Image 
                src={paperTexture} 
                alt="Textura" 
                fill 
                className="object-cover grayscale opacity-60" 
                priority
              />
              {/* Degradado adaptado al tono oscuro/noche mágica */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#140f2d] via-[#0a0514] to-[#0a0514] mix-blend-color" />
              <div className="absolute inset-0 border border-white/5 rounded-xl" />
              
              {/* Filigranas doradas sutiles */}
              <div className="absolute inset-0 p-3 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-60">
                <div className="relative w-full h-full mix-blend-screen" style={{ filter: 'sepia(1) hue-rotate(10deg) saturate(3)' }}>
                  <Image src={filigreeImage} width={80} height={80} alt="Esquina 1" className="absolute top-0 left-0" />
                  <Image src={filigreeImage} width={80} height={80} alt="Esquina 2" className="absolute top-0 right-0 rotate-90" />
                  <Image src={filigreeImage} width={80} height={80} alt="Esquina 3" className="absolute bottom-0 left-0 -rotate-90" />
                  <Image src={filigreeImage} width={80} height={80} alt="Esquina 4" className="absolute bottom-0 right-0 rotate-180" />
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <span className="text-[140px] font-serif font-bold text-white drop-shadow-md">XV</span>
              </div>
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] pointer-events-none" />
            </div>

            {/* SOLAPA TRIANGULAR SUPERIOR */}
            <motion.div
              initial={{ rotateX: 0, zIndex: 40 }}
              animate={{ 
                rotateX: step !== 'idle' ? -165 : 0, 
                y: step !== 'idle' ? -10 : 0,
                zIndex: (step === 'paperUp' || step === 'fading') ? 15 : 40 
              }}
              whileHover={step === 'idle' ? { rotateX: -15 } : {}}
              transition={{ duration: 1.4, ease: springEasing }}
              className="absolute inset-x-0 top-0 h-[65%] origin-top drop-shadow-[0_20px_20px_rgba(0,0,0,0.95)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div 
                className="absolute inset-0 bg-black"
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Exterior Solapa */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <Image 
                    src={flapTexture} 
                    alt="Textura" 
                    fill 
                    className="object-cover grayscale opacity-60" 
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#140f2d] to-[#0a0514] mix-blend-color" />
                  <div className="absolute inset-0 border-t border-white/10" />
                </div>

                {/* Interior Solapa */}
                <div 
                  className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.9)] bg-[#04020a]" 
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                >
                  <Image src={flapTexture} alt="Interior" fill className="object-cover grayscale opacity-20 mix-blend-overlay" />
                </div>
              </div>
            </motion.div>

            {/* SELLO DE CERA */}
            <motion.div
              initial={{ rotateX: 0, opacity: 1, scale: 1 }}
              animate={
                step !== 'idle' 
                  ? { rotateX: -160, opacity: 0, scale: 0.8, y: 30 } 
                  : { rotateX: 0, opacity: 1, scale: 1, y: 0 }
              }
              whileHover={step === 'idle' ? { rotateX: -15, scale: 1.05 } : {}}
              transition={{ duration: step !== 'idle' ? 0.8 : 1.4, ease: springEasing }}
              className="absolute left-1/2 top-[65%] origin-[center_-130%] z-50 pointer-events-none flex justify-center items-center"
              style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative w-28 h-28 -mt-14 -ml-14 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
                <Image 
                  src={sealImage} 
                  alt="Sello de Cera" 
                  fill 
                  className="object-contain hover:brightness-125 transition-all duration-300" 
                  priority
                />
              </div>
            </motion.div>
            
          </div>
        </motion.div>

        {/* CONTROLES DE INTERFAZ */}
        <AnimatePresence mode="wait">
          {step === 'idle' ? (
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
          ) : (
            <motion.div
              key="ui-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: step === 'fading' ? 0 : 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <p className="text-[#ffd700] text-xs tracking-[0.5em] uppercase font-bold animate-pulse mt-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans">
                El bosque se abre...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}