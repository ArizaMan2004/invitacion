'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
// Asumo que tienes este componente en tu carpeta
import { MagicalSparkles } from './MagicalSparkles'; 

interface RealisticEnvelopeProps {
  // IMÁGENES DE TEXTURA (Rutas a /public/...)
  paperTexture: string;    // Textura de papel verde bosque
  flapTexture: string;     // Textura para la solapa (puede ser la misma)
  sealImage: string;      // Sello de cera en PNG transparente
  filigreeImage: string;  // Adorno dorado de esquina en PNG transparente
  
  guestName?: string;
  primaryColor?: string;   // Verde musgo profundo
  accentColor?: string;    // Oro viejo
  backgroundColor?: string; // Fondo de la web (oscuro)
  onOpen: () => void;
}

export function RealisticEnvelope({
  paperTexture,
  flapTexture,
  sealImage,
  filigreeImage,
  guestName = 'Estimado Invitado',
  primaryColor = '#0a1a0a', // Verde bosque más profundo
  accentColor = '#b8860b',  // Oro viejo / Latón
  backgroundColor = '#050a05',
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
      {/* CAPA DE MAGIA: Partículas doradas de bosque */}
      <MagicalSparkles 
        isActive={openingStage !== 'closed'} 
        color={openingStage === 'open' ? '#f0d080' : accentColor}
        count={openingStage === 'open' ? 120 : 50} 
      />
      
      <div className="w-full max-w-2xl relative">
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
            <div className="absolute inset-0 rounded-lg shadow-2xl overflow-hidden" style={{ background: primaryColor }}>
              {/* Capa de textura de papel verde */}
              <Image src={paperTexture} alt="Texture" fill className="object-cover opacity-80 mix-blend-multiply" />
              
              {/* FILIGRANAS DORADAS EN LAS 4 ESQUINAS */}
              <div className="absolute inset-0 p-4 pointer-events-none z-10">
                <Image src={filigreeImage} width={80} height={80} alt="f1" className="absolute top-4 left-4 opacity-70" />
                <Image src={filigreeImage} width={80} height={80} alt="f2" className="absolute top-4 right-4 rotate-90 opacity-70" />
                <Image src={filigreeImage} width={80} height={80} alt="f3" className="absolute bottom-4 left-4 -rotate-90 opacity-70" />
                <Image src={filigreeImage} width={80} height={80} alt="f4" className="absolute bottom-4 right-4 rotate-180 opacity-70" />
              </div>

              {/* Nombre del Invitado */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center">
                <p className="text-[10px] tracking-[0.4em] uppercase mb-4 text-white/40">Invitación Especial</p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#e0c080] drop-shadow-md">
                  {guestName}
                </h2>
              </div>
            </div>
          </motion.div>

          {/* 2. INVITACIÓN INTERNA (La hoja que sube) */}
          <motion.div
            className="absolute inset-x-6 top-8 bottom-4 rounded shadow-inner flex flex-col items-center p-8 z-10"
            style={{ background: '#fdfcf0', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)' }}
            animate={{ y: openingStage === 'open' ? -260 : 0, rotateX: openingStage === 'open' ? 10 : 0 }}
            transition={{ y: { duration: 1.2, ease: "easeOut", delay: 0.2 } }}
          >
            <div className="text-center">
              <p className="font-serif italic text-2xl text-[#1a331a] mb-6">¡Estás Invitada!</p>
              <div className="w-12 h-px bg-[#b8860b] mx-auto mb-6" />
              <p className="text-sm uppercase tracking-widest text-[#1a331a]/60">Mis XV Años</p>
            </div>
          </motion.div>

          {/* 3. SOLAPA IZQUIERDA */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1/2 origin-left z-20"
            animate={openingStage === 'sides' || openingStage === 'open' ? { rotateY: -110, x: -10 } : { rotateY: 0 }}
            transition={{ duration: 1.2 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-l-lg border-r border-black/10" style={{ background: primaryColor }}>
              <Image src={paperTexture} alt="T" fill className="object-cover opacity-80" />
            </div>
          </motion.div>

          {/* 4. SOLAPA DERECHA */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1/2 origin-right z-20"
            animate={openingStage === 'sides' || openingStage === 'open' ? { rotateY: 110, x: 10 } : { rotateY: 0 }}
            transition={{ duration: 1.2 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-r-lg border-l border-black/10" style={{ background: primaryColor }}>
              <Image src={paperTexture} alt="T" fill className="object-cover opacity-80" />
            </div>
          </motion.div>

          {/* 5. SOLAPA TRIANGULAR SUPERIOR */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 origin-top z-30 cursor-pointer"
            animate={openingStage !== 'closed' ? { rotateX: -160, y: -5 } : { rotateX: 0 }}
            transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
            onClick={handleClick}
          >
            {/* Cara Exterior */}
            <div 
              className="absolute inset-0 shadow-lg"
              style={{ 
                backfaceVisibility: 'hidden', 
                background: primaryColor,
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' 
              }}
            >
              <Image src={flapTexture} alt="T" fill className="object-cover opacity-90" />
              
              {/* SELLO DE CERA (Imagen Real PNG) */}
              <motion.div 
                className="absolute left-1/2 top-[70%] -translate-x-1/2 z-40"
                animate={openingStage !== 'closed' ? { opacity: 0, scale: 0.8, y: 20 } : { opacity: 1 }}
              >
                <Image 
                  src={sealImage} 
                  width={100} 
                  height={100} 
                  alt="Sello de Cera" 
                  className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
                />
              </motion.div>
            </div>

            {/* Cara Interior (Cuando se abre) */}
            <div 
              className="absolute inset-0"
              style={{ 
                backfaceVisibility: 'hidden', 
                transform: 'rotateX(180deg)',
                background: '#050f05',
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' 
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </motion.div>
        </div>

        {/* Botón de acción */}
        <AnimatePresence>
          {openingStage === 'closed' && (
            <motion.div 
              className="text-center mt-12"
              exit={{ opacity: 0, y: 20 }}
            >
              <button
                onClick={handleClick}
                className="px-8 py-3 bg-[#b8860b] text-[#0a1a0a] font-bold rounded-full shadow-xl hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, #d4af37, #b8860b)` }}
              >
                REVELAR INVITACIÓN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}