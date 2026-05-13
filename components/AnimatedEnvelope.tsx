'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

// Descomenta la siguiente línea si tienes el componente MagicalSparkles en tu proyecto
// import { MagicalSparkles } from './MagicalSparkles';

interface AnimatedEnvelopeProps {
  // Rutas a los assets (deben estar en la carpeta public de Next.js)
  paperTexture?: string;
  flapTexture?: string;
  sealImage?: string;
  filigreeImage?: string;
  
  // Datos de la invitación
  eventTime?: string;
  welcomeMessage?: string;
  guestName?: string;
  
  // Paleta de colores (Fallback para bordes, sombras y textos)
  primaryColor?: string; 
  accentColor?: string; 
  backgroundColor?: string; 
  
  // Función callback al terminar toda la animación
  onOpen: () => void;
}

export function AnimatedEnvelope({
  // Asegúrate de tener estas imágenes en tu carpeta public/
  paperTexture = '/textura-verde.jpg',
  flapTexture = '/FLAP.png',
  sealImage = '/sello.png',
  filigreeImage = '/filigrana.png',

  eventTime = "19:00 HRS",
  welcomeMessage = "¡Bienvenidos a nuestra gran celebración de 15 años!",
  guestName = "Invitada Especial",
  
  primaryColor = '#0a1a0a', 
  accentColor = '#d4af37', 
  backgroundColor = '#030603', // Fondo negro profundo
  onOpen,
}: AnimatedEnvelopeProps) {
  const [step, setStep] = useState<'idle' | 'opening' | 'paperUp' | 'fading'>('idle');
  const [isAnimating, setIsAnimating] = useState(false);

  // Lógica de la línea de tiempo de la animación
  const handleClick = () => {
    if (step !== 'idle' || isAnimating) return;
    setIsAnimating(true);
    setStep('opening'); // La solapa se levanta y el sello desaparece
    
    setTimeout(() => {
      setStep('paperUp'); // La carta emerge desde el interior del sobre
    }, 1200);

    setTimeout(() => {
      setStep('fading'); // Efecto de inmersión / zoom cinematográfico
    }, 4500);

    setTimeout(() => {
      onOpen(); // Transición a la página principal de la invitación
    }, 5800);
  };

  // Curvas de interpolación (easing) personalizadas para movimientos muy fluidos y premium
  const fluidEasing = [0.34, 1.56, 0.64, 1]; // Efecto rebote orgánico
  const cinematicEasing = [0.45, 0, 0.55, 1]; // Aceleración de cámara suave

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      style={{ background: backgroundColor }}
      // EFECTO POP-OUT GLOBAL: Añadimos un drop-shadow al contenedor de pantalla completa
      className="h-[100dvh] min-h-[600px] flex items-center justify-center p-4 overflow-hidden relative drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
    >
      {/* Si usas las partículas, aquí van: */}
      {/* <MagicalSparkles isActive={step !== 'idle'} color={accentColor} count={60} /> */}

      <div className="flex flex-col items-center gap-14 w-full max-w-md relative z-10">
        
        {/* === CONTENEDOR PRINCIPAL DEL SOBRE === */}
        <motion.div
          onClick={handleClick}
          animate={
            step === 'fading' 
              ? { scale: 5, opacity: 0, filter: "blur(20px)", y: -150, rotateX: 10 } 
              : { scale: 1, opacity: 1, y: 0, rotateX: step === 'paperUp' ? 5 : 0 }
          }
          whileHover={step === 'idle' ? { scale: 1.03, y: -5 } : {}}
          transition={{ 
            duration: step === 'fading' ? 1.5 : 1, 
            ease: step === 'fading' ? cinematicEasing : fluidEasing 
          }}
          className={`relative w-full ${step === 'idle' ? 'cursor-pointer' : ''}`}
          style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
        >
          {/* EFECTO POP-OUT: He profundizado la sombra del cuerpo del sobre (box-shadow) */}
          <div className="relative w-full shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-xl" style={{ aspectRatio: '4/3' }}>
            
            {/* 1. FONDO TRASERO / INTERIOR DEL SOBRE (Z-INDEX 10) */}
            <div className="absolute inset-0 bg-[#050f05] rounded-xl overflow-hidden z-10">
               <div className="absolute inset-0 bg-black/60 shadow-[inset_0_40px_60px_rgba(0,0,0,0.9)]" />
            </div>

            {/* 2. LA TARJETA DE INVITACIÓN (Z-INDEX 20) */}
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={
                step === 'paperUp' || step === 'fading'
                  ? { y: -190, opacity: 1, scale: 1 } 
                  : { y: 0, opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 1.4, ease: fluidEasing }}
              className="absolute inset-x-5 top-5 rounded-lg p-6 md:p-8 text-center z-20 h-[105%]"
              style={{ 
                background: '#fdfcf0', // Color papel antiguo/marfil
                // Sombra dinámica de la carta al salir del sobre
                boxShadow: step === 'paperUp' || step === 'fading' 
                  ? '0_10px_30px_rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.05)'
                  : '0_-15px_40px_rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.05)',
                borderTop: '1px solid rgba(255,255,255,0.8)'
              }}
            >
              <div className="h-full flex flex-col items-center justify-start pt-6 relative">
                {/* Detalles de la tarjeta */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#d4af37] opacity-40" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#d4af37] opacity-40" />

                <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: '#2a4a2a' }}>
                  Para: {guestName}
                </p>
                <p className="font-serif italic text-lg md:text-xl mb-4 leading-relaxed" style={{ color: '#1a331a' }}>
                  {welcomeMessage}
                </p>
                
                <div className="w-16 h-[1px] mb-6" style={{ background: accentColor }} />
                
                <p className="text-[10px] tracking-widest uppercase mb-2 opacity-60" style={{ color: '#1a331a' }}>Recepción</p>
                <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-tighter" style={{ color: '#1a331a' }}>
                  {eventTime}
                </h3>
              </div>
            </motion.div>

            {/* 3. FRENTE DEL SOBRE / CUERPO INFERIOR (Z-INDEX 30) */}
            <div 
              className="absolute inset-0 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-30 overflow-hidden" 
              style={{ background: primaryColor }}
            >
              {/* Imagen de Textura */}
              <Image 
                src={paperTexture} 
                alt="Textura del sobre" 
                fill 
                className="object-cover opacity-100" 
                priority
              />
              
              {/* Filigranas Doradas (Esquinas) */}
              <div className="absolute inset-0 p-3 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <div className="relative w-full h-full">
                  <Image src={filigreeImage} width={80} height={80} alt="Esquina 1" className="absolute top-0 left-0 opacity-90" />
                  <Image src={filigreeImage} width={80} height={80} alt="Esquina 2" className="absolute top-0 right-0 rotate-90 opacity-90" />
                  <Image src={filigreeImage} width={80} height={80} alt="Esquina 3" className="absolute bottom-0 left-0 -rotate-90 opacity-90" />
                  <Image src={filigreeImage} width={80} height={80} alt="Esquina 4" className="absolute bottom-0 right-0 rotate-180 opacity-90" />
                </div>
              </div>

              {/* Marca de agua interna y viñeta (Sombra en los bordes) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <span className="text-[140px] font-serif font-bold text-white drop-shadow-md">XV</span>
              </div>
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)] pointer-events-none" />
            </div>

            {/* 4. SOLAPA TRIANGULAR SUPERIOR (Z-INDEX DINÁMICO) */}
            <motion.div
              initial={{ rotateX: 0, zIndex: 40 }}
              animate={{ 
                rotateX: step !== 'idle' ? -165 : 0, 
                y: step !== 'idle' ? -10 : 0,
                zIndex: (step === 'paperUp' || step === 'fading') ? 15 : 40 
              }}
              whileHover={step === 'idle' ? { rotateX: -15 } : {}}
              transition={{ duration: 1.4, ease: fluidEasing }}
              // AQUÍ ESTÁ LA MAGIA: El drop-shadow se aplica al padre, que NO tiene el clip-path.
              // Le puse una sombra negra muy intensa para que marque perfecto el triángulo.
              className="absolute inset-x-0 top-0 h-[65%] origin-top drop-shadow-[0_20px_20px_rgba(0,0,0,0.95)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* El clip-path va en este contenedor hijo para no romper la sombra */}
              <div 
                className="absolute inset-0"
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Cara Frontal (Exterior) de la Solapa */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', background: primaryColor }}>
                  <Image 
                    src={flapTexture} 
                    alt="Textura de solapa" 
                    fill 
                    className="object-cover opacity-100" 
                    priority
                  />
                  <div className="absolute inset-0 border-t border-white/10" />
                </div>

                {/* Cara Interior de la Solapa (La que se ve al abrirse) */}
                <div 
                  className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.8)]" 
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    transform: 'rotateX(180deg)', 
                    background: '#020502' // Súper oscuro
                  }}
                >
                  <Image src={flapTexture} alt="Interior solapa" fill className="object-cover opacity-20 mix-blend-overlay" />
                </div>
              </div>
            </motion.div>

            {/* 5. SELLO DE CERA (Z-INDEX 50) */}
            <motion.div
              initial={{ rotateX: 0, opacity: 1, scale: 1 }}
              animate={
                step !== 'idle' 
                  ? { rotateX: -160, opacity: 0, scale: 0.8, y: 30 } // Cae y desaparece
                  : { rotateX: 0, opacity: 1, scale: 1, y: 0 }
              }
              whileHover={step === 'idle' ? { rotateX: -15, scale: 1.05 } : {}}
              transition={{ duration: step !== 'idle' ? 0.8 : 1.4, ease: fluidEasing }}
              className="absolute left-1/2 top-[65%] origin-[center_-130%] z-50 pointer-events-none flex justify-center items-center"
              style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative w-28 h-28 -mt-14 -ml-14 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
                <Image 
                  src={sealImage} 
                  alt="Sello de Cera 15 Años" 
                  fill 
                  className="object-contain hover:brightness-110 transition-all duration-300" 
                  priority
                />
              </div>
            </motion.div>
            
          </div>
        </motion.div>

        {/* === BOTÓN Y TEXTOS DE UI === */}
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
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-serif italic text-lg mb-8 shadow-black text-shadow"
                style={{ color: accentColor }}
              >
                Toca el sobre para descubrir la magia
              </motion.p>
              
              <button
                onClick={handleClick}
                style={{ background: `linear-gradient(135deg, ${accentColor}, #9a7615)` }}
                className="px-10 py-4 font-serif font-bold text-[#050a05] rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] active:scale-95 transition-all duration-300 cursor-pointer text-base uppercase tracking-widest relative overflow-hidden group"
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
              <p className="text-[#a0c0a0] text-xs tracking-[0.5em] uppercase font-light animate-pulse mt-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Iniciando el hechizo...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}