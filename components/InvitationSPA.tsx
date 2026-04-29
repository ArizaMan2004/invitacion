'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import localFont from 'next/font/local';

// Configuración de la fuente local
const customHeroFont = localFont({
  src: '../public/fonts/Elegante.ttf', 
  variable: '--font-hero',
  display: 'swap',
});

// Componentes de la Invitación
import { CountdownTimer } from './invitation/CountdownTimer';
import { EventDateTime } from './invitation/EventDateTime';
import { RSVPForm } from './invitation/RSVPForm';
import { AudioPlayer } from './invitation/AudioPlayer';
import { MagicSparks } from './invitation/MagicSparks'; 
import { Trivia } from './invitation/trivia';
import { PhotoUploader } from './invitation/PhotoUploader';

// Componentes del Editor (Admin)
import { EditableWrapper } from './admin/EditableWrapper';
import { InvitationData } from '@/lib/types';

interface InvitationSPAProps {
  initialData: InvitationData;
  invitationId: string;
  isEditing?: boolean;
  onDataChange?: (field: keyof InvitationData, value: any) => void;
}

const sectionAnim = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } 
};

// --- 1. LUCIÉRNAGAS MÁGICAS ---
const MagicalFireflies = ({ color }: { color: string }) => {
  const count = 25; 
  const firefliesData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 10,
      duration: Math.random() * 5 + 5
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {firefliesData.map((data, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-0"
          style={{
            backgroundColor: color,
            width: `${data.size}px`,
            height: `${data.size}px`,
            left: `${data.x}%`,
            top: `${data.y}%`,
            boxShadow: `0 0 10px 2px ${color}80`,
          }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: data.duration,
            delay: data.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// --- 2. HOJAS CAYENDO ---
const FallingLeaves = ({ accentColor }: { accentColor: string }) => {
  const leafCount = 15;
  const leavesData = useMemo(() => {
    const leafPaths = [
      "M12 2C12 2 6 6 6 12C6 18 12 22 12 22C12 22 18 18 18 12C18 6 12 2 12 2Z",
      "M2.41 12C2.41 12 1 10.5 1 7.5a5.5 5.5 0 0 1 11-1.47 5.5 5.5 0 0 1 11 1.47c0 3-1.41 4.5-1.41 4.5S23 16 12 22C1 16 2.41 12 2.41 12Z"
    ];

    return Array.from({ length: leafCount }).map(() => ({
      path: leafPaths[Math.floor(Math.random() * leafPaths.length)],
      x: Math.random() * 100,
      size: Math.random() * 15 + 10,
      delay: Math.random() * 15,
      duration: Math.random() * 10 + 10,
      rotationDirection: Math.random() > 0.5 ? 1 : -1,
      colorVariant: Math.random() > 0.6 ? accentColor : '#2d4d2d'
    }));
  }, [accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {leavesData.map((leaf, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          fill={leaf.colorVariant}
          className="absolute opacity-0"
          style={{
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            left: `${leaf.x}%`,
            top: `-5%`,
            filter: `drop-shadow(0 0 2px ${leaf.colorVariant}40)`
          }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 50 - 25],
            rotate: [0, leaf.rotationDirection * (Math.random() * 360 + 360)],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        >
          <path d={leaf.path} />
        </motion.svg>
      ))}
    </div>
  );
};

// --- 3. PLANTA MÁGICA CRECIENDO ORGÁNICAMENTE ---
const PlantNode = ({ progress, data, color }: { progress: any, data: any, color: string }) => {
  const branchDraw = useTransform(progress, [data.start, data.end], [0, 1]);
  const leafScale = useTransform(progress, [data.start + 0.02, data.end + 0.05], [0, 1]);
  
  return (
    <g className="drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
      <motion.path 
        d={data.branch} 
        fill="none" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        style={{ pathLength: branchDraw }} 
      />
      <motion.g 
        style={{ scale: leafScale, opacity: leafScale, transformOrigin: "0px 0px" }} 
        transform={`translate(${data.leafX}, ${data.leafY}) rotate(${data.rot})`}
      >
        <path d="M0,0 C8,-8 16,-4 16,8 C8,16 0,12 0,0 Z" fill={color} />
      </motion.g>
    </g>
  );
};

const GrowingMagicPlant = ({ color }: { color: string }) => {
  const { scrollYProgress } = useScroll();
  const springProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 25 });

  const leftNodes = [
    { start: 0.14, end: 0.22, branch: "M 35,150 Q 55,140 65,160", leafX: 65, leafY: 160, rot: 30 },
    { start: 0.29, end: 0.37, branch: "M 15,300 Q -5,290 -10,310", leafX: -10, leafY: 310, rot: 150 },
    { start: 0.44, end: 0.52, branch: "M 40,450 Q 60,440 70,460", leafX: 70, leafY: 460, rot: 30 },
    { start: 0.59, end: 0.67, branch: "M 15,600 Q -5,590 -10,610", leafX: -10, leafY: 610, rot: 150 },
    { start: 0.74, end: 0.82, branch: "M 40,750 Q 60,740 70,760", leafX: 70, leafY: 760, rot: 30 },
    { start: 0.89, end: 0.97, branch: "M 15,900 Q -5,890 -10,910", leafX: -10, leafY: 910, rot: 150 },
  ];

  const rightNodes = [
    { start: 0.14, end: 0.22, branch: "M 65,150 Q 45,140 35,160", leafX: 35, leafY: 160, rot: 150 },
    { start: 0.29, end: 0.37, branch: "M 85,300 Q 105,290 110,310", leafX: 110, leafY: 310, rot: 30 },
    { start: 0.44, end: 0.52, branch: "M 60,450 Q 40,440 30,460", leafX: 30, leafY: 460, rot: 150 },
    { start: 0.59, end: 0.67, branch: "M 85,600 Q 105,590 110,610", leafX: 110, leafY: 610, rot: 30 },
    { start: 0.74, end: 0.82, branch: "M 60,750 Q 40,740 30,760", leafX: 30, leafY: 760, rot: 150 },
    { start: 0.89, end: 0.97, branch: "M 85,900 Q 105,890 110,910", leafX: 110, leafY: 910, rot: 30 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      
      {/* Planta Izquierda */}
      <svg className="absolute left-0 top-0 w-[20vw] md:w-[10vw] h-[100vh]" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path
          d="M 20,0 Q 45,75 35,150 T 15,300 T 40,450 T 15,600 T 40,750 T 15,900 T 20,1000"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: springProgress }}
          className="drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]"
        />
        {leftNodes.map((node, i) => (
          <PlantNode key={i} progress={springProgress} data={node} color={color} />
        ))}
      </svg>
      
      {/* Planta Derecha */}
      <svg className="absolute right-0 top-0 w-[20vw] md:w-[10vw] h-[100vh]" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path
          d="M 80,0 Q 55,75 65,150 T 85,300 T 60,450 T 85,600 T 60,750 T 85,900 T 80,1000"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: springProgress }}
          className="drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]"
        />
        {rightNodes.map((node, i) => (
          <PlantNode key={i} progress={springProgress} data={node} color={color} />
        ))}
      </svg>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export function InvitationSPA({
  initialData,
  invitationId,
  isEditing = false,
  onDataChange
}: InvitationSPAProps) {
  
  // LÓGICA PARA EL INDICADOR DE SCROLL
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  // Configuración de tema "Bosque Encantado Profundo"
  const theme = {
    background: initialData.backgroundColor || '#08110b', 
    card: initialData.cardColor || 'rgba(15, 25, 15, 0.7)', 
    accent: initialData.accentColor || '#d4af37', 
    text: initialData.textColor || '#fdfcf0' 
  };

  return (
    <div 
      className={`min-h-screen w-full overflow-x-hidden selection:bg-[#d4af37] selection:text-black ${customHeroFont.variable}`}
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* CAPAS DE MAGIA ATMOSFÉRICA */}
      <MagicSparks color={theme.accent} />
      <MagicalFireflies color={theme.accent} />
      <FallingLeaves accentColor={theme.accent} />
      <GrowingMagicPlant color={theme.accent} />

      {/* 1. HERO SECTION */}
      <section className="relative h-[100dvh] min-h-[600px] w-full flex items-center justify-center overflow-hidden z-10">
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={initialData.heroImage} 
            alt="Hero Bosque Encantado" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08110b]/50 via-transparent to-[#08110b] backdrop-blur-[1px]" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="block text-[10px] md:text-xs tracking-[0.6em] uppercase mb-4 md:mb-6 drop-shadow-lg"
            style={{ color: theme.accent }}
          >
            Felices XV Años
          </motion.span>
          
          <EditableWrapper isEnabled={isEditing} onEdit={(val) => onDataChange?.('quinceaneraName', val)}>
            <motion.h1 
              initial={{ opacity: 0, filter: "blur(15px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.9, duration: 1.8 }}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl mb-6 md:mb-8 tracking-wide"
              style={{ 
                fontFamily: 'var(--font-hero)',
                textShadow: `0 0 35px ${theme.accent}50, 0 5px 5px rgba(0,0,0,0.6)` 
              }}
            >
              {initialData.quinceaneraName}
            </motion.h1>
          </EditableWrapper>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col items-center gap-4 md:gap-8"
          >
            <div 
              className="w-[2px] h-16 md:h-28 rounded-full" 
              style={{ background: `linear-gradient(to bottom, transparent, ${theme.accent}, transparent)` }} 
            />
            <p className="font-serif italic text-base md:text-2xl opacity-95 max-w-xl text-shadow-sm leading-relaxed px-4">
              "Acompañanos en este dia tan especial para celebrar la vida y nacimiento de Jesus y Jessenia."
            </p>
          </motion.div>
        </div>

        {/* SEÑAL DE DESLIZA */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-60 font-medium">Desliza</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl"
            style={{ color: theme.accent }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      <div className="relative z-20">
        
        {/* 2. CUENTA REGRESIVA */}
        <motion.section {...sectionAnim} className="py-16 md:py-28 px-4 text-center relative">
          <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-70 mb-10 md:mb-14" style={{ color: theme.accent }}>Solo Faltan</h2>
          <div className="relative z-10 p-6 md:p-12 rounded-[2.5rem] bg-white/[0.015] border border-[#d4af37]/15 backdrop-blur-lg shadow-[0_0_50px_rgba(212,175,55,0.08)] max-w-4xl mx-auto w-full">
            <CountdownTimer targetDate={initialData.eventDate} accentColor={theme.accent} />
          </div>
        </motion.section>

        {/* 3. DEDICATORIA / MENSAJE DE NO NIÑOS */}
        <motion.section {...sectionAnim} className="py-20 md:py-36 px-6 text-center max-w-3xl mx-auto">
          <EditableWrapper isEnabled={isEditing} onEdit={(val) => onDataChange?.('dedicationMessage', val)}>
            <p className="text-xl md:text-3xl font-serif leading-relaxed italic opacity-95 text-shadow-sm">
              "Si la fiesta quieres disfrutar, a tus niños en camita debes dejar."
            </p>
          </EditableWrapper>

        </motion.section>

        {/* 4. FECHA Y UBICACIÓN + MAPA ESTILIZADO */}
        <motion.section {...sectionAnim} className="py-16 md:py-28 px-4">
          <div className="max-w-5xl mx-auto">
            <EventDateTime 
              date={initialData.eventDate}
              time={initialData.eventTime}
              venue={initialData.venue}
              address={initialData.venueAddress}
              mapIframe={initialData.mapIframeSrc}
              accentColor={theme.accent}
            />

            <div className="mt-16 md:mt-24 text-center mb-10 md:mb-14">
              <h2 className="text-3xl md:text-5xl font-serif mb-3 tracking-wide">Ubicación</h2>
              <p className="text-[10px] tracking-[0.4em] uppercase opacity-70" style={{ color: theme.accent }}>
                Sigue el sendero hacia la celebración
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="p-3 md:p-4 rounded-[3rem] border bg-[#101a10]/60 backdrop-blur-2xl max-w-4xl mx-auto shadow-[0_0_60px_rgba(212,175,55,0.12)]"
              style={{ borderColor: `${theme.accent}30` }}
            >
              <div className="rounded-[2.5rem] overflow-hidden relative w-full h-[320px] md:h-[500px]">
                <iframe 
                  src={initialData.mapIframeSrc || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.1794197171566!2d-69.64156179999999!3d11.3945113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e842b171d51921b%3A0x9597f059837b1c6f!2sRefugio%20Ranch!5e0!3m2!1ses!2sve!4v1777133800110!5m2!1ses!2sve"} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'contrast(1.1) sepia(0.3) hue-rotate(85deg) saturate(0.8)' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 5. CÓDIGO DE VESTIMENTA CON BOTONES PINTEREST */}
        <motion.section {...sectionAnim} className="py-20 md:py-36 px-6 relative">
          <div className="absolute inset-0 bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="mb-14 md:mb-20">
              <h2 className="text-4xl md:text-5xl font-serif mb-5 tracking-wide">Codigo de Vestimenta</h2>
              <p className="text-[11px] tracking-[0.4em] uppercase" style={{ color: theme.accent }}>
                Estilo Semi Casual Formal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
              {/* Tarjeta Damas */}
              <motion.div 
                whileHover={{ y: -12, boxShadow: `0 15px 50px rgba(212,175,55,0.2)` }}
                className="p-10 md:p-14 rounded-[3.5rem] border bg-[#121d12]/70 backdrop-blur-2xl flex flex-col items-center transition-all duration-500 ease-out"
                style={{ borderColor: `${theme.accent}25` }}
              >
                <div className="mb-8 md:mb-10 p-6 md:p-7 bg-[#d4af37]/15 rounded-full border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <svg width="45" height="45" className="md:w-[55px] md:h-[55px]" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3c0 1.5.5 3 2 3s2-1.5 2-3M14 3c0 1.5.5 3 2 3s2-1.5 2-3" />
                    <path d="M19 8.5L12 22l-7-13.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif mb-5 italic text-[#d4af37]">Damas</h3>
                <p className="text-sm opacity-90 leading-relaxed uppercase tracking-[0.25em]">
                  Semi Casual Formal
                </p>
                <div className="mt-5 w-16 h-[1px] bg-[#d4af37]/30" />
                <p className="mt-5 text-[11px] opacity-70 uppercase tracking-widest italic leading-relaxed text-center">
                  Sugerencia: Vestido de cóctel, falda o conjunto elegante.
                </p>

                {/* Botón Pinterest Damas */}
                <a 
                  href="https://es.pinterest.com/search/pins/?q=dresscode%2015%20woman&rs=typed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  style={{ borderColor: `${theme.accent}40`, color: theme.accent, backgroundColor: `${theme.accent}10` }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
                  </svg>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Ver Ideas</span>
                </a>
              </motion.div>

              {/* Tarjeta Caballeros */}
              <motion.div 
                whileHover={{ y: -12, boxShadow: `0 15px 50px rgba(212,175,55,0.2)` }}
                className="p-10 md:p-14 rounded-[3.5rem] border bg-[#121d12]/70 backdrop-blur-2xl flex flex-col items-center transition-all duration-500 ease-out"
                style={{ borderColor: `${theme.accent}25` }}
              >
                <div className="mb-8 md:mb-10 p-6 md:p-7 bg-[#d4af37]/15 rounded-full border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <svg width="45" height="45" className="md:w-[55px] md:h-[55px]" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20h16V2H4z" strokeOpacity="0.15"/>
                    <path d="M12 22l4-18M12 22l-4-18M12 2v6" />
                    <path d="M9 4l3 2 3-2" />
                    <path d="M12 8l-2 2h4l-2-2z" fill={theme.accent} fillOpacity={0.8} />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif mb-5 italic text-[#d4af37]">Caballeros</h3>
                <p className="text-sm opacity-90 leading-relaxed uppercase tracking-[0.25em]">
                  Semi Casual Formal
                </p>
                <div className="mt-5 w-16 h-[1px] bg-[#d4af37]/30" />
                <p className="mt-5 text-[11px] opacity-70 uppercase tracking-widest italic leading-relaxed text-center">
                  Sugerencia: Pantalón de vestir, camisa elegante.
                </p>

                {/* Botón Pinterest Caballeros */}
                <a 
                  href="https://es.pinterest.com/search/pins/?q=dresscode%2015%20men&rs=typed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  style={{ borderColor: `${theme.accent}40`, color: theme.accent, backgroundColor: `${theme.accent}10` }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
                  </svg>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Ver Ideas</span>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 6. TRIVIA MÁGICA */}
        <motion.section {...sectionAnim} className="py-20 md:py-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/8 to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-center mb-10 md:mb-16 px-6">
            <h2 className="text-4xl md:text-5xl font-serif mb-5 tracking-wide">¿Conoces la Leyenda?</h2>
            <p className="text-sm md:text-base opacity-80 italic text-[#d4af37]">Demuestra cuánto sabes sobre los cumpleañeros</p>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <Trivia 
              invitationId={invitationId} 
              guestName="Invitado Real" 
              accentColor={theme.accent} 
            />
          </div>
        </motion.section>

        {/* 7. GALERÍA COLABORATIVA */}
        <motion.section {...sectionAnim} className="py-20 md:py-36 px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="bg-[#121d12]/90 backdrop-blur-3xl p-10 md:p-24 rounded-[3.5rem] md:rounded-[4.5rem] border text-center shadow-[0_0_70px_rgba(212,175,55,0.15)]" style={{ borderColor: `${theme.accent}30` }}>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#d4af37]/15 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 border border-[#d4af37]/35 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
                <span className="text-3xl md:text-4xl">📸</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-5 md:mb-7 tracking-wide">Inmortaliza el Momento</h2>
              <p className="text-sm md:text-base opacity-90 mb-10 md:mb-14 max-w-lg mx-auto leading-relaxed">
                ¡Tu visión es parte de la leyenda! Comparte aquí las fotografías mágicas que captures durante la noche.
              </p>
              
              <PhotoUploader 
                invitationId={invitationId} 
                guestName="Explorador" 
                accentColor={theme.accent} 
              />
            </div>
          </div>
        </motion.section>

        {/* 8. RSVP */}
        <motion.div {...sectionAnim} className="py-20 md:py-36 px-4">
          <div 
            className="max-w-2xl mx-auto rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.2)] border transition-all duration-700 hover:shadow-[0_0_80px_rgba(212,175,55,0.3)] relative" 
            style={{ borderColor: `${theme.accent}40`, backgroundColor: 'rgba(18, 28, 18, 0.85)', backdropFilter: 'blur(25px)' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-[#d4af37]/15 blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 p-10 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-5 tracking-wide">¿Aceptarás el Llamado?</h2>
              <p className="text-[11px] tracking-[0.25em] uppercase mb-10 md:mb-14" style={{ color: theme.accent }}>Confirma tu presencia en el Claro Real</p>
              <RSVPForm invitationId={invitationId} />
            </div>
          </div>
        </motion.div>

        {/* REPRODUCTOR DE AUDIO */}
        <AudioPlayer youtubeUrl={initialData.youtubeMusicLink} accentColor={theme.accent} />

        {/* FOOTER */}
        <footer className="py-16 md:py-28 text-center opacity-60 relative z-10">
          <div className="w-20 h-[1px] bg-[#d4af37] mx-auto mb-8 md:mb-10 opacity-40" />
          <p className="text-[11px] tracking-[0.9em] uppercase" style={{ color: theme.accent, textShadow: `0 0 5px ${theme.accent}40` }}>
            {initialData.quinceaneraName} • MMXXVI
          </p>
          <p className="mt-4 text-[9px] opacity-50 tracking-widest">Hecho con magia en el Bosque Encantado</p>
        </footer>
      </div>
    </div>
  );
}