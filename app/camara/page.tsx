'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PhotoUploader } from '@/components/invitation/PhotoUploader'; 
import Link from 'next/link';

// --- FONDO DE VIDEO ANIMADO (Heredado de la SPA) ---
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

// --- LUCIÉRNAGAS MÁGICAS ---
const MagicalFireflies = ({ color }: { color: string }) => {
  const count = 40; 
  const firefliesData = useMemo(() => {
    const colors = [color, '#ffffff', '#e0b0ff', '#8ae6ff'];
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 10,
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
            willChange: "transform, opacity" 
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

// --- ESTRELLAS FUGACES ---
const FallingStars = ({ accentColor }: { accentColor: string }) => {
  const starCount = 20; 
  const starsData = useMemo(() => {
    const starPaths = [
      "M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z",
      "M12 4 L13 9 L18 10 L13 11 L12 16 L11 11 L6 10 L11 9 Z",
    ];
    return Array.from({ length: starCount }).map(() => ({
      path: starPaths[Math.floor(Math.random() * starPaths.length)],
      x: Math.random() * 100, size: Math.random() * 10 + 5, delay: Math.random() * 15,
      duration: Math.random() * 12 + 8, rotationDirection: Math.random() > 0.5 ? 1 : -1,
      colorVariant: Math.random() > 0.4 ? '#ffffff' : accentColor 
    }));
  }, [accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {starsData.map((star, i) => (
        <motion.svg key={i} viewBox="0 0 24 24" fill={star.colorVariant} className="absolute opacity-0"
          style={{ width: `${star.size}px`, height: `${star.size}px`, left: `${star.x}%`, top: `-5%`, filter: `drop-shadow(0 0 4px ${star.colorVariant})`, willChange: "transform, opacity" }}
          animate={{ opacity: [0, 0.7, 0], y: ['0vh', '100vh'], rotate: [0, star.rotationDirection * 360] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "linear" }}
        ><path d={star.path} /></motion.svg>
      ))}
    </div>
  );
};

// --- MARIPOSAS ---
const FlyingButterflies = () => {
  const count = 4; 
  const butterfliesData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      startY: Math.random() * 100, duration: Math.random() * 15 + 20, 
      delay: Math.random() * 10, scale: Math.random() * 0.3 + 0.3,
      direction: Math.random() > 0.5 ? 1 : -1, 
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {butterfliesData.map((b, i) => (
        <motion.div key={`butterfly-${i}`} className="absolute"
          style={{ top: `${b.startY}%`, left: b.direction === 1 ? '-10%' : '110%', scale: b.scale, opacity: 0.5, willChange: "transform" }}
          animate={{ x: b.direction === 1 ? ['0vw', '120vw'] : ['0vw', '-120vw'], y: [0, Math.random() * -100, Math.random() * 100, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
        >
          <motion.svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff" animate={{ scaleX: [1, 0.4, 1] }} transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "center" }}>
            <path d="M12 2C8 2 4 6 11 12C4 18 8 22 12 22C16 22 20 18 13 12C20 6 16 2 12 2Z" />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
};

// --- PLANTA MÁGICA AUTO-CRECIENTE ---
const AutoPlantNode = ({ data, color, delay }: { data: any, color: string, delay: number }) => {
  return (
    <g>
      <motion.path d={data.branch} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      />
      <motion.g style={{ transformOrigin: "0px 0px" }} transform={`translate(${data.leafX}, ${data.leafY}) rotate(${data.rot})`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        <path d="M0,0 C8,-8 16,-4 16,8 C8,16 0,12 0,0 Z" fill={color} />
      </motion.g>
    </g>
  );
};

const AutoGrowingMagicPlant = () => {
  const color = '#fdfcf0'; // Color claro para destacar en el fondo oscuro
  const leftNodes = [
    { start: 0.14, branch: "M 35,150 Q 55,140 65,160", leafX: 65, leafY: 160, rot: 30 },
    { start: 0.29, branch: "M 15,300 Q -5,290 -10,310", leafX: -10, leafY: 310, rot: 150 },
    { start: 0.44, branch: "M 40,450 Q 60,440 70,460", leafX: 70, leafY: 460, rot: 30 },
    { start: 0.59, branch: "M 15,600 Q -5,590 -10,610", leafX: -10, leafY: 610, rot: 150 },
    { start: 0.74, branch: "M 40,750 Q 60,740 70,760", leafX: 70, leafY: 760, rot: 30 },
    { start: 0.89, branch: "M 15,900 Q -5,890 -10,910", leafX: -10, leafY: 910, rot: 150 },
  ];

  const rightNodes = [
    { start: 0.14, branch: "M 65,150 Q 45,140 35,160", leafX: 35, leafY: 160, rot: 150 },
    { start: 0.29, branch: "M 85,300 Q 105,290 110,310", leafX: 110, leafY: 310, rot: 30 },
    { start: 0.44, branch: "M 60,450 Q 40,440 30,460", leafX: 30, leafY: 460, rot: 150 },
    { start: 0.59, branch: "M 85,600 Q 105,590 110,610", leafX: 110, leafY: 610, rot: 30 },
    { start: 0.74, branch: "M 60,750 Q 40,740 30,760", leafX: 30, leafY: 760, rot: 150 },
    { start: 0.89, branch: "M 85,900 Q 105,890 110,910", leafX: 110, leafY: 910, rot: 30 },
  ];

  const totalGrowTime = 3.5; 

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-70">
      <svg className="absolute left-0 top-0 w-[20vw] md:w-[10vw] h-[100vh]" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path d="M 20,0 Q 45,75 35,150 T 15,300 T 40,450 T 15,600 T 40,750 T 15,900 T 20,1000" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: totalGrowTime, ease: "easeInOut" }} />
        {leftNodes.map((node, i) => (<AutoPlantNode key={i} data={node} color={color} delay={node.start * totalGrowTime} />))}
      </svg>
      <svg className="absolute right-0 top-0 w-[20vw] md:w-[10vw] h-[100vh]" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path d="M 80,0 Q 55,75 65,150 T 85,300 T 60,450 T 85,600 T 60,750 T 85,900 T 80,1000" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: totalGrowTime, ease: "easeInOut" }} />
        {rightNodes.map((node, i) => (<AutoPlantNode key={i} data={node} color={color} delay={node.start * totalGrowTime} />))}
      </svg>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL (CÁMARA) ---
export default function CameraUploadPage() {
  const theme = {
    background: '#0a0514', 
    accent: '#ffd700', 
    text: '#ffffff',
    cardBg: 'rgba(20, 15, 45, 0.85)' // El mismo estilo "glass" de la SPA
  };

  const CURRENT_INVITATION_ID = "fiesta-xv-principal"; 

  // Curva cinematográfica para la entrada
  const cinematicEasing = [0.22, 1, 0.36, 1];

  return (
    <main 
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#ffffff] selection:text-[#0a0514]"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* MAGIA ATMOSFÉRICA INTEGRADA (Mismo entorno que el resto de la app) */}
      <AmbientVideoBackground />
      <MagicalFireflies color={theme.accent} />
      <FallingStars accentColor={theme.accent} />
      <FlyingButterflies />
      <AutoGrowingMagicPlant />

      {/* Animación fluida de desenfoque y escala (Efecto inmersivo) */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)", y: 15 }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 1.2, ease: cinematicEasing, delay: 0.2 }} 
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        {/* Contenedor tipo Tarjeta Premium */}
        <div 
          className="w-full backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center relative z-10" 
          style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {/* Ícono de Cámara Mágica */}
          <div className="mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#ffd700] blur-[40px] opacity-20 rounded-full animate-pulse" />
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.15)]">
              <span className="text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">📸</span>
            </div>
          </div>

          {/* Textos Principales */}
          <div className="text-center mb-10 font-sans">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 tracking-wide text-white drop-shadow-md">
              Captura la Magia
            </h1>
            <p className="text-sm opacity-90 leading-relaxed max-w-[280px] mx-auto text-white">
              ¡Sé parte de la leyenda! Sube aquí las fotos y videos que tomes durante la noche.
            </p>
          </div>

          {/* Componente Uploader */}
          <div className="w-full">
            <PhotoUploader 
              invitationId={CURRENT_INVITATION_ID} 
              guestName="Explorador (Vía QR)" 
              accentColor={theme.accent} 
            />
          </div>
        </div>

        {/* Botón para regresar a la página principal */}
        <div className="mt-12 text-center">
          <Link href="/">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[10px] tracking-[0.25em] font-bold font-sans uppercase opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2 cursor-pointer text-white drop-shadow-md" 
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Ver Invitación Completa
            </motion.span>
          </Link>
        </div>

      </motion.div>
    </main>
  );
}