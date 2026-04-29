'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { PhotoUploader } from '@/components/invitation/PhotoUploader'; // Asegúrate de que la ruta coincida
import Link from 'next/link';

// --- 1. LUCIÉRNAGAS MÁGICAS ---
const MagicalFireflies = ({ color }: { color: string }) => {
  const count = 20; 
  const firefliesData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 2, delay: Math.random() * 10,
      duration: Math.random() * 5 + 5
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {firefliesData.map((data, i) => (
        <motion.div key={i} className="absolute rounded-full opacity-0"
          style={{ backgroundColor: color, width: `${data.size}px`, height: `${data.size}px`, left: `${data.x}%`, top: `${data.y}%`, boxShadow: `0 0 10px 2px ${color}80` }}
          animate={{ opacity: [0, 0.7, 0.7, 0], x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0], y: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0] }}
          transition={{ duration: data.duration, delay: data.delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// --- 2. HOJAS CAYENDO ---
const FallingLeaves = ({ accentColor }: { accentColor: string }) => {
  const leafCount = 10;
  const leavesData = useMemo(() => {
    const leafPaths = [
      "M12 2C12 2 6 6 6 12C6 18 12 22 12 22C12 22 18 18 18 12C18 6 12 2 12 2Z",
      "M2.41 12C2.41 12 1 10.5 1 7.5a5.5 5.5 0 0 1 11-1.47 5.5 5.5 0 0 1 11 1.47c0 3-1.41 4.5-1.41 4.5S23 16 12 22C1 16 2.41 12 2.41 12Z"
    ];
    return Array.from({ length: leafCount }).map(() => ({
      path: leafPaths[Math.floor(Math.random() * leafPaths.length)],
      x: Math.random() * 100, size: Math.random() * 15 + 10, delay: Math.random() * 15,
      duration: Math.random() * 10 + 10, rotationDirection: Math.random() > 0.5 ? 1 : -1,
      colorVariant: Math.random() > 0.6 ? accentColor : '#2d4d2d'
    }));
  }, [accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {leavesData.map((leaf, i) => (
        <motion.svg key={i} viewBox="0 0 24 24" fill={leaf.colorVariant} className="absolute opacity-0"
          style={{ width: `${leaf.size}px`, height: `${leaf.size}px`, left: `${leaf.x}%`, top: `-5%`, filter: `drop-shadow(0 0 2px ${leaf.colorVariant}40)` }}
          animate={{ opacity: [0, 0.6, 0.6, 0], y: ['0vh', '110vh'], x: [0, Math.random() * 50 - 25], rotate: [0, leaf.rotationDirection * (Math.random() * 360 + 360)] }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, repeatType: "loop", ease: "linear" }}
        ><path d={leaf.path} /></motion.svg>
      ))}
    </div>
  );
};

// --- 3. PLANTA MÁGICA AUTO-CRECIENTE (Sin Scroll) ---
const AutoPlantNode = ({ data, color, delay }: { data: any, color: string, delay: number }) => {
  return (
    <g className="drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
      {/* La rama crece automáticamente después del delay calculado */}
      <motion.path d={data.branch} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      />
      {/* La hoja brota justo cuando la rama termina */}
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

const AutoGrowingMagicPlant = ({ color }: { color: string }) => {
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

  const totalGrowTime = 3.5; // Segundos que tarda la raíz principal en llegar hasta abajo

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-80">
      <svg className="absolute left-0 top-0 w-[20vw] md:w-[10vw] h-[100vh]" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path d="M 20,0 Q 45,75 35,150 T 15,300 T 40,450 T 15,600 T 40,750 T 15,900 T 20,1000" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: totalGrowTime, ease: "easeInOut" }} className="drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
        {leftNodes.map((node, i) => (<AutoPlantNode key={i} data={node} color={color} delay={node.start * totalGrowTime} />))}
      </svg>
      <svg className="absolute right-0 top-0 w-[20vw] md:w-[10vw] h-[100vh]" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path d="M 80,0 Q 55,75 65,150 T 85,300 T 60,450 T 85,600 T 60,750 T 85,900 T 80,1000" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: totalGrowTime, ease: "easeInOut" }} className="drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
        {rightNodes.map((node, i) => (<AutoPlantNode key={i} data={node} color={color} delay={node.start * totalGrowTime} />))}
      </svg>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL (CÁMARA) ---
export default function CameraUploadPage() {
  const theme = {
    background: '#08110b', 
    accent: '#d4af37', 
    text: '#fdfcf0' 
  };

  const CURRENT_INVITATION_ID = "fiesta-xv-principal"; 

  return (
    <main 
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#d4af37] selection:text-black"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* MAGIA ATMOSFÉRICA INTEGRADA */}
      <MagicalFireflies color={theme.accent} />
      <FallingLeaves accentColor={theme.accent} />
      <AutoGrowingMagicPlant color={theme.accent} />

      {/* Fondos Degradados Base */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#d4af37]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#1a331a]/40 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }} // Aparece justo cuando las raíces van brotando
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        {/* Ícono de Cámara Mágica */}
        <div className="mb-8 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#d4af37] blur-[30px] opacity-20 rounded-full animate-pulse" />
          <div className="w-24 h-24 rounded-full border border-[#d4af37]/30 bg-[#121d12]/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <span className="text-4xl drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">📸</span>
          </div>
        </div>

        {/* Textos Principales */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif mb-3 tracking-wide" style={{ textShadow: `0 0 20px ${theme.accent}40` }}>
            Captura la Magia
          </h1>
          <p className="text-sm opacity-80 leading-relaxed max-w-[280px] mx-auto">
            ¡Sé parte de la leyenda! Sube aquí las fotos y videos que tomes durante la celebración.
          </p>
        </div>

        {/* Contenedor del Uploader */}
        <div className="w-full bg-[#121d12]/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border shadow-2xl flex flex-col items-center" style={{ borderColor: `${theme.accent}20` }}>
          <PhotoUploader 
            invitationId={CURRENT_INVITATION_ID} 
            guestName="Invitado (Vía QR)" 
            accentColor={theme.accent} 
          />
        </div>

        {/* Botón para regresar a la página principal */}
        <div className="mt-12 text-center">
          <Link href="/">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 cursor-pointer" style={{ color: theme.accent }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Ver Invitación Completa
            </span>
          </Link>
        </div>

      </motion.div>
    </main>
  );
}