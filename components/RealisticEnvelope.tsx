'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
// Asumo que tienes este componente en tu carpeta
import { MagicalSparkles } from './MagicalSparkles'; 

interface RealisticEnvelopeProps {
  // IMÁGENES DE TEXTURA (Rutas a /public/...)
  paperTexture: string;    
  flapTexture: string;     
  sealImage: string;      
  filigreeImage: string;  
  
  guestName?: string;
  primaryColor?: string;   
  accentColor?: string;    
  backgroundColor?: string; 
  onOpen: () => void;
}

// --- FONDO DEGRADADO ANIMADO (MORADO Y AZUL OSCURO) ---
const AmbientGradient = () => (
  <div className="absolute inset-0 pointer-events-none z-[0] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#120524] via-[#090b21] to-[#040b1a] opacity-95" />
    <motion.div
      className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[120px] bg-[#6b21a8]"
      animate={{ x: [0, 40, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[150px] bg-[#1e3a8a]"
      animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

export function RealisticEnvelope({
  paperTexture,
  flapTexture,
  sealImage,
  filigreeImage,
  guestName = 'Estimado Invitado',
  primaryColor = '#120524', // Fallback a morado oscuro
  accentColor = '#ffffff',  // Blanco para brillos y acentos
  backgroundColor = '#0a0514', // Fondo base súper oscuro
  onOpen,
}: RealisticEnvelopeProps) {
  const [openingStage, setOpeningStage] = useState<'closed' | 'flap' | 'sides' | 'open'>('closed');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (openingStage === 'closed' && !isAnimating) {
      setIsAnimating(true);
      setOpeningStage('flap');

      setTimeout(() => {
        setOpeningStage('sides');
        setTimeout(() => {
          setOpeningStage('open');
          setTimeout(() => {
            onOpen();
          }, 2000); 
        }, 500); 
      }, 1000); 
    }
  };

  return (
    <div 
      style={{ background: backgroundColor }} 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* CAPA DE FONDO ATMOSFÉRICO */}
      <AmbientGradient />

      {/* CAPA DE MAGIA: Partículas brillantes */}
      <MagicalSparkles 
        isActive={openingStage !== 'closed'} 
        color={openingStage === 'open' ? '#ffffff' : '#e0b0ff'}
        count={openingStage === 'open' ? 120 : 50} 
      />
      
      <div className="w-full max-w-2xl relative z-10">
        <div
          className="relative mx-auto"
          style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '16/11',
            perspective: '2000px',
          }}
        >
          {/* 1. CUERPO TRASERO DEL SOBRE (Base con Filigranas) */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotateX: openingStage === 'open' ? 10 : 0 }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformStyle: 'preserve-3d', zIndex: 0 }}
          >
            <div className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden bg-black">
              {/* Capa de textura de papel transformada a escala de grises */}
              <Image src={paperTexture} alt="Texture" fill className="object-cover opacity-90 grayscale" />
              {/* Filtro de color superpuesto para lograr el degradado deseado */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6b21a8] to-[#1e3a8a] mix-blend-color" />
              
              {/* FILIGRANAS (Aclaradas para contrastar) */}
              <div className="absolute inset-0 p-4 pointer-events-none z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Image src={filigreeImage} width={80} height={80} alt="f1" className="absolute top-4 left-4 opacity-90 brightness-200" />
                <Image src={filigreeImage} width={80} height={80} alt="f2" className="absolute top-4 right-4 rotate-90 opacity-90 brightness-200" />
                <Image src={filigreeImage} width={80} height={80} alt="f3" className="absolute bottom-4 left-4 -rotate-90 opacity-90 brightness-200" />
                <Image src={filigreeImage} width={80} height={80} alt="f4" className="absolute bottom-4 right-4 rotate-180 opacity-90 brightness-200" />
              </div>

              {/* Nombre del Invitado */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center">
                <p className="text-[10px] tracking-[0.4em] uppercase mb-4 text-white/60 font-bold drop-shadow-md">Invitación Especial</p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(255,255,255,0.4)' }}>
                  {guestName}
                </h2>
              </div>
              
              {/* Sombra interna para dar profundidad */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none z-30" />
            </div>
          </motion.div>

          {/* 2. INVITACIÓN INTERNA (La hoja que sube) */}
          <motion.div
            className="absolute inset-x-6 top-8 bottom-4 rounded shadow-inner flex flex-col items-center p-8 z-10 backdrop-blur-md border border-white/20"
            style={{ 
              background: 'rgba(20, 15, 45, 0.95)', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)' 
            }}
            animate={{ y: openingStage === 'open' ? -260 : 0, rotateX: openingStage === 'open' ? 10 : 0 }}
            transition={{ y: { duration: 1.2, ease: "easeOut", delay: 0.2 } }}
          >
            <div className="text-center relative w-full h-full flex flex-col items-center justify-start pt-6">
              {/* Detalles decorativos en esquinas */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#ffd700] opacity-60" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#ffd700] opacity-60" />

              <p className="font-serif italic text-2xl text-white mb-6 font-bold drop-shadow-md">¡Estás Invitada!</p>
              <div className="w-12 h-[2px] bg-white mx-auto mb-6" />
              <p className="text-sm uppercase tracking-widest text-white/80 font-bold drop-shadow-md">Mis XV Años</p>
            </div>
          </motion.div>

          {/* 3. SOLAPA IZQUIERDA */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1/2 origin-left z-20"
            animate={openingStage === 'sides' || openingStage === 'open' ? { rotateY: -110, x: -10 } : { rotateY: 0 }}
            transition={{ duration: 1.2 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-l-lg border-r border-white/10 bg-black">
              <Image src={paperTexture} alt="T" fill className="object-cover opacity-90 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#6b21a8] to-[#1e3a8a] mix-blend-color" />
            </div>
          </motion.div>

          {/* 4. SOLAPA DERECHA */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1/2 origin-right z-20"
            animate={openingStage === 'sides' || openingStage === 'open' ? { rotateY: 110, x: 10 } : { rotateY: 0 }}
            transition={{ duration: 1.2 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-r-lg border-l border-white/10 bg-black">
              <Image src={paperTexture} alt="T" fill className="object-cover opacity-90 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#6b21a8] to-[#1e3a8a] mix-blend-color" />
            </div>
          </motion.div>

          {/* 5. SOLAPA TRIANGULAR SUPERIOR */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 origin-top z-30 cursor-pointer drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]"
            animate={openingStage !== 'closed' ? { rotateX: -160, y: -5 } : { rotateX: 0 }}
            transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            onClick={handleClick}
          >
            {/* Cara Exterior */}
            <div 
              className="absolute inset-0 bg-black"
              style={{ 
                backfaceVisibility: 'hidden', 
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' 
              }}
            >
              <Image src={flapTexture} alt="T" fill className="object-cover opacity-90 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#6b21a8] to-[#1e3a8a] mix-blend-color" />
              <div className="absolute inset-0 border-t border-white/20" />
              
              {/* SELLO DE CERA */}
              <motion.div 
                className="absolute left-1/2 top-[70%] -translate-x-1/2 z-40"
                animate={openingStage !== 'closed' ? { opacity: 0, scale: 0.8, y: 20 } : { opacity: 1 }}
              >
                <Image 
                  src={sealImage} 
                  width={100} 
                  height={100} 
                  alt="Sello de Cera" 
                  className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] hover:brightness-110 transition-all"
                />
              </motion.div>
            </div>

            {/* Cara Interior (Cuando se abre) */}
            <div 
              className="absolute inset-0 bg-[#040b1a] shadow-[inset_0_20px_40px_rgba(0,0,0,0.9)]"
              style={{ 
                backfaceVisibility: 'hidden', 
                transform: 'rotateX(180deg)',
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' 
              }}
            >
              <Image src={flapTexture} alt="T" fill className="object-cover opacity-30 grayscale mix-blend-overlay" />
            </div>
          </motion.div>
        </div>

        {/* Botón de acción */}
        <AnimatePresence>
          {openingStage === 'closed' && (
            <motion.div 
              className="text-center mt-12"
              exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            >
              <button
                onClick={handleClick}
                className="px-10 py-4 text-[#120524] font-serif font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 uppercase tracking-widest relative overflow-hidden group"
                style={{ background: `linear-gradient(135deg, #ffffff, #e0e0e0)` }}
              >
                <span className="relative z-10">Revelar Invitación</span>
                <div className="absolute inset-0 bg-[#6b21a8] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}