'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import localFont from 'next/font/local';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';

// Configuración de fuentes
const customHeroFont = localFont({
  src: '../public/fonts/Elegante.ttf', 
  variable: '--font-hero',
  display: 'swap',
});

const fontSerif = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap'
});

const fontSans = Montserrat({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap'
});

// Componentes de la Invitación
import { CountdownTimer } from './invitation/CountdownTimer';
import { EventDateTime } from './invitation/EventDateTime';
import { RSVPForm } from './invitation/RSVPForm';
import { AudioPlayer } from './invitation/AudioPlayer';
import { MagicSparks } from './invitation/MagicSparks'; 
import { Trivia } from './invitation/trivia';
import { PhotoUploader } from './invitation//PhotoUploader';

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

// --- EFECTO MÁQUINA DE ESCRIBIR ---
const TypewriterText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay }
    })
  };

  const child = {
    hidden: { opacity: 0, y: 5, filter: "blur(2px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", damping: 12, stiffness: 200 } }
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ display: "inline-block" }}
    >
      {letters.map((char, index) => (
        <motion.span key={index} variants={child} style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

// --- FONDO DEGRADADO ANIMADO (MORADO Y AZUL OSCURO) ---
const AmbientGradient = () => (
  <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
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
    <motion.div
      className="absolute -bottom-[20%] left-[20%] w-[80%] h-[60%] rounded-full mix-blend-screen filter blur-[140px] bg-[#312e81]"
      animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// --- 1. LUCIÉRNAGAS MÁGICAS ---
const MagicalFireflies = ({ color }: { color: string }) => {
  const count = 80; 
  const firefliesData = useMemo(() => {
    const colors = [color, '#ffffff', '#e0b0ff', '#ffffff', '#8ae6ff'];
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      delay: Math.random() * 10,
      duration: Math.random() * 4 + 4,
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
            boxShadow: `0 0 15px 4px ${data.glowColor}A0`,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [0, Math.random() * 150 - 75, Math.random() * 150 - 75, 0],
            y: [0, Math.random() * 150 - 75, Math.random() * 150 - 75, 0],
            scale: [1, 1.5, 1],
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

// --- 2. DESTELLOS/ESTRELLAS CAYENDO ---
const FallingStars = ({ accentColor }: { accentColor: string }) => {
  const starCount = 40;
  const starsData = useMemo(() => {
    const starPaths = [
      "M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z",
      "M12 4 L13 9 L18 10 L13 11 L12 16 L11 11 L6 10 L11 9 Z",
      "M12 1 L12.5 11.5 L23 12 L12.5 12.5 L12 23 L11.5 12.5 L1 12 L11.5 11.5 Z"
    ];

    return Array.from({ length: starCount }).map(() => ({
      path: starPaths[Math.floor(Math.random() * starPaths.length)],
      x: Math.random() * 100,
      size: Math.random() * 12 + 6,
      delay: Math.random() * 15,
      duration: Math.random() * 10 + 10,
      rotationDirection: Math.random() > 0.5 ? 1 : -1,
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
            filter: `drop-shadow(0 0 8px ${star.colorVariant})`
          }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 80 - 40],
            rotate: [0, star.rotationDirection * (Math.random() * 360 + 360)],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        >
          <path d={star.path} />
        </motion.svg>
      ))}
    </div>
  );
};

// --- 3. MARIPOSAS MÁGICAS VOLANDO ---
const FlyingButterflies = ({ color }: { color: string }) => {
  const count = 12;
  const butterfliesData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      startY: Math.random() * 100,
      duration: Math.random() * 20 + 25,
      delay: Math.random() * 20,
      scale: Math.random() * 0.4 + 0.3,
      direction: Math.random() > 0.5 ? 1 : -1, 
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {butterfliesData.map((b, i) => (
        <motion.div
          key={`butterfly-${i}`}
          className="absolute"
          style={{
            top: `${b.startY}%`,
            left: b.direction === 1 ? '-10%' : '110%',
            scale: b.scale,
            filter: `drop-shadow(0 0 10px #ffffff)`,
            opacity: 0.8
          }}
          animate={{
            x: b.direction === 1 ? ['0vw', '120vw'] : ['0vw', '-120vw'],
            y: [0, Math.random() * -200, Math.random() * 200, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.svg 
            width="40" height="40" viewBox="0 0 24 24" fill="#ffffff" 
            animate={{ scaleX: [1, 0.2, 1] }}
            transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          >
            <path d="M12 2C8 2 4 6 11 12C4 18 8 22 12 22C16 22 20 18 13 12C20 6 16 2 12 2Z" />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
};

// --- 4. PLANTA MÁGICA CRECIENDO ---
const PlantNode = ({ progress, data, color }: { progress: any, data: any, color: string }) => {
  const branchDraw = useTransform(progress, [data.start, data.end], [0, 1]);
  const leafScale = useTransform(progress, [data.start + 0.02, data.end + 0.05], [0, 1]);
  
  return (
    <g className="drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">
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

  const plantColor = '#fdfcf0'; 

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      <svg className="absolute left-0 top-0 w-[20vw] md:w-[10vw] h-[100vh]" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path
          d="M 20,0 Q 45,75 35,150 T 15,300 T 40,450 T 15,600 T 40,750 T 15,900 T 20,1000"
          fill="none"
          stroke={plantColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: springProgress }}
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
        {leftNodes.map((node, i) => (
          <PlantNode key={i} progress={springProgress} data={node} color={plantColor} />
        ))}
      </svg>
      
      <svg className="absolute right-0 top-0 w-[20vw] md:w-[10vw] h-[100vh]" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path
          d="M 80,0 Q 55,75 65,150 T 85,300 T 60,450 T 85,600 T 60,750 T 85,900 T 80,1000"
          fill="none"
          stroke={plantColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: springProgress }}
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
        {rightNodes.map((node, i) => (
          <PlantNode key={i} progress={springProgress} data={node} color={plantColor} />
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
  
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  const theme = {
    background: '#0a0514', 
    accent: '#ffd700', 
    text: '#ffffff', 
    cardBg: 'rgba(20, 15, 45, 0.85)' 
  };

  let heroImageSrc = initialData.heroImage;
  if (!heroImageSrc || heroImageSrc.includes('C:\\') || !heroImageSrc.startsWith('/')) {
    heroImageSrc = '/images/placeholder-hero.jpg';
  }

  return (
    <div 
      className={`min-h-screen w-full overflow-x-hidden selection:bg-[#ffffff] selection:text-[#0a0514] ${customHeroFont.variable} ${fontSerif.variable} ${fontSans.variable} font-sans`}
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* CAPAS DE MAGIA ATMOSFÉRICA */}
      <AmbientGradient />
      <MagicSparks color="#ffffff" />
      <MagicalFireflies color={theme.accent} />
      <FallingStars accentColor={theme.accent} />
      <FlyingButterflies color="#ffffff" />
      <GrowingMagicPlant color={theme.accent} />

      {/* 1. HERO SECTION (ACTUALIZADO CON LA OPCIÓN 1) */}
      <section className="relative h-[100dvh] min-h-[600px] w-full flex items-center justify-center overflow-hidden z-10 bg-black">
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {/* Opción 1: Imagen en escala de grises */}
          <img 
            src={heroImageSrc} 
            alt="Hero Bosque Encantado" 
            className="w-full h-full object-cover grayscale opacity-80"
            fetchPriority="high"
            loading="eager"
          />
          {/* Opción 1: Capa de fusión de color (tiñe la imagen de morado y azul) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6b21a8] to-[#1e3a8a] mix-blend-color" />
          
          {/* Sombra oscura base para que el texto resalte correctamente */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/70 via-[#0a0514]/40 to-[#0a0514] backdrop-blur-[2px]" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="block text-[11px] md:text-sm tracking-[0.6em] uppercase mb-4 md:mb-6 drop-shadow-lg font-sans font-bold text-white"
          >
            Felices XV Años
          </motion.span>
          
          <EditableWrapper isEnabled={isEditing} onEdit={(val) => onDataChange?.('quinceaneraName', val)}>
            <motion.h1 
              initial={{ opacity: 0, filter: "blur(15px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.9, duration: 1.8 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 md:mb-8 tracking-wide text-white"
              style={{ 
                fontFamily: 'var(--font-hero)',
                textShadow: `0 0 40px rgba(255,255,255,0.6), 0 5px 10px rgba(0,0,0,0.8)` 
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
              style={{ background: `linear-gradient(to bottom, transparent, #ffffff, transparent)` }} 
            />
            
            <TypewriterText 
              text='"Acompáñanos en este día tan especial para celebrar la vida y nuestro nacimiento."'
              delay={2}
              className="font-serif italic text-xl md:text-3xl font-medium opacity-100 max-w-2xl text-shadow-md leading-relaxed px-4 text-white"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="mt-6 md:mt-8 flex flex-col items-center gap-2 opacity-100"
            >
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.3em] mb-2 font-bold font-sans text-white drop-shadow-md">
                Con la bendición de nuestros padres
              </span>
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide italic font-bold text-shadow-lg text-white">
                Jesús Capielo y Neida de Capielo
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* SEÑAL DE DESLIZA */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold font-sans">Desliza</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      <div className="relative z-20">
        
        {/* 2. CUENTA REGRESIVA */}
        <motion.section {...sectionAnim} className="py-16 md:py-28 px-4 text-center relative">
          <h2 className="text-[11px] md:text-sm tracking-[0.4em] uppercase font-bold font-sans mb-10 md:mb-14 text-white drop-shadow-md">Solo Faltan</h2>
          <div 
            className="relative z-10 p-6 md:p-12 rounded-[2.5rem] border backdrop-blur-xl shadow-[0_0_50px_rgba(255,255,255,0.1)] max-w-4xl mx-auto w-full text-white"
            style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <CountdownTimer targetDate={initialData.eventDate} accentColor="#ffffff" />
          </div>
        </motion.section>

        {/* 3. DEDICATORIA / MENSAJE DE NO NIÑOS */}
        <motion.section {...sectionAnim} className="py-20 md:py-36 px-6 text-center max-w-3xl mx-auto">
          <EditableWrapper isEnabled={isEditing} onEdit={(val) => onDataChange?.('dedicationMessage', val)}>
            <TypewriterText 
              text='"Si la fiesta quieres disfrutar, a tus niños en camita debes dejar."'
              delay={0.2}
              className="text-3xl md:text-5xl font-serif font-bold leading-relaxed italic opacity-100 text-shadow-lg text-white"
            />
          </EditableWrapper>
        </motion.section>

        {/* 4. FECHA Y UBICACIÓN + MAPA ESTILIZADO */}
        <motion.section {...sectionAnim} className="py-16 md:py-28 px-4 text-white">
          <div className="max-w-5xl mx-auto">
            <EventDateTime 
              date={initialData.eventDate}
              time={initialData.eventTime}
              venue={initialData.venue}
              address={initialData.venueAddress}
              mapIframe={initialData.mapIframeSrc}
              accentColor="#ffffff"
            />

            {/* TEXTO ANIMADO DE MÁQUINA DE ESCRIBIR */}
            <div className="mt-12 md:mt-16 text-center mb-6">
              <TypewriterText 
                text="La historia empieza a la hora, así que llega puntual."
                delay={0.5}
                className="text-xl md:text-3xl font-serif italic text-white drop-shadow-lg tracking-wide font-bold"
              />
            </div>

            <div className="mt-16 md:mt-24 text-center mb-10 md:mb-14">
              <h2 className="text-4xl md:text-6xl font-serif mb-3 tracking-wide font-bold text-white">Ubicación</h2>
              <p className="text-[11px] tracking-[0.4em] uppercase font-sans font-bold text-white opacity-90 drop-shadow-md">
                Sigue el sendero hacia la celebración
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="p-3 md:p-4 rounded-[3rem] border backdrop-blur-2xl max-w-4xl mx-auto shadow-[0_0_60px_rgba(255,255,255,0.1)]"
              style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="rounded-[2.5rem] overflow-hidden relative w-full h-[320px] md:h-[500px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.1794197171566!2d-69.64156179999999!3d11.3945113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e842b171d51921b%3A0x9597f059837b1c6f!2sRefugio%20Ranch!5e0!3m2!1ses!2sve!4v1778713473158!5m2!1ses!2sve" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'contrast(1.2) sepia(0.2) hue-rotate(240deg) saturate(1.5) brightness(0.9)' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 5. CÓDIGO DE VESTIMENTA */}
        <motion.section {...sectionAnim} className="py-20 md:py-36 px-6 relative text-white">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="mb-14 md:mb-20">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-5 tracking-wide text-white drop-shadow-md">Dress Code</h2>
              <p className="text-[12px] md:text-sm tracking-[0.4em] uppercase font-sans font-bold text-white">
                Estilo Semi Formal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 font-sans">
              {/* Tarjeta Damas */}
              <motion.div 
                whileHover={{ y: -12, boxShadow: `0 15px 50px rgba(255,255,255,0.15)` }}
                className="p-10 md:p-14 rounded-[3.5rem] border backdrop-blur-2xl flex flex-col items-center transition-all duration-500 ease-out"
                style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <div className="mb-8 md:mb-10 p-6 md:p-7 bg-white/10 rounded-full border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <svg width="45" height="45" className="md:w-[55px] md:h-[55px]" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3c0 1.5.5 3 2 3s2-1.5 2-3M14 3c0 1.5.5 3 2 3s2-1.5 2-3" />
                    <path d="M19 8.5L12 22l-7-13.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-5 italic text-white drop-shadow-md">Damas</h3>
                <p className="text-base opacity-100 leading-relaxed uppercase tracking-[0.25em] font-bold text-white">
                  Semi Formal
                </p>
                <div className="mt-5 w-16 h-[2px] bg-white/40" />
                <p className="mt-5 text-[12px] opacity-90 uppercase tracking-widest italic leading-relaxed text-center font-medium text-white">
                  Sugerencia: Vestido de cóctel, falda o conjunto elegante.
                </p>

                <a 
                  href="https://es.pinterest.com/search/pins/?q=dresscode%2015%20woman&rs=typed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105 bg-white/10 text-white font-bold"
                  style={{ borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
                  </svg>
                  <span className="text-[11px] uppercase tracking-widest font-bold">Ver Ideas</span>
                </a>
              </motion.div>

              {/* Tarjeta Caballeros */}
              <motion.div 
                whileHover={{ y: -12, boxShadow: `0 15px 50px rgba(255,255,255,0.15)` }}
                className="p-10 md:p-14 rounded-[3.5rem] border backdrop-blur-2xl flex flex-col items-center transition-all duration-500 ease-out"
                style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <div className="mb-8 md:mb-10 p-6 md:p-7 bg-white/10 rounded-full border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <svg width="45" height="45" className="md:w-[55px] md:h-[55px]" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20h16V2H4z" strokeOpacity="0.15"/>
                    <path d="M12 22l4-18M12 22l-4-18M12 2v6" />
                    <path d="M9 4l3 2 3-2" />
                    <path d="M12 8l-2 2h4l-2-2z" fill="#ffffff" fillOpacity={0.9} />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-5 italic text-white drop-shadow-md">Caballeros</h3>
                <p className="text-base opacity-100 leading-relaxed uppercase tracking-[0.25em] font-bold text-white">
                  Semi Formal
                </p>
                <div className="mt-5 w-16 h-[2px] bg-white/40" />
                <p className="mt-5 text-[12px] opacity-90 uppercase tracking-widest italic leading-relaxed text-center font-medium text-white">
                  Sugerencia: Pantalón de vestir, camisa elegante.
                </p>

                <a 
                  href="https://es.pinterest.com/search/pins/?q=dresscode%2015%20men&rs=typed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105 bg-white/10 text-white font-bold"
                  style={{ borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
                  </svg>
                  <span className="text-[11px] uppercase tracking-widest font-bold">Ver Ideas</span>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 6. TRIVIA MÁGICA */}
        <motion.section {...sectionAnim} className="py-20 md:py-36 relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-center mb-10 md:mb-16 px-6">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-5 tracking-wide text-white drop-shadow-md">¿Conoces la Leyenda?</h2>
            <p className="text-base md:text-xl opacity-100 italic font-serif font-bold text-white drop-shadow-md">Demuestra cuánto sabes sobre los cumpleañeros</p>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <Trivia 
              invitationId={invitationId} 
              guestName="Invitado Real" 
              accentColor="#ffffff" 
            />
          </div>
        </motion.section>

        {/* 7. RSVP */}
        <motion.div {...sectionAnim} className="py-20 md:py-36 px-4 text-white">
          <div 
            className="max-w-2xl mx-auto rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.15)] border transition-all duration-700 hover:shadow-[0_0_80px_rgba(255,255,255,0.25)] relative backdrop-blur-2xl" 
            style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: theme.cardBg }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-white/10 blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 p-10 md:p-16 text-center">
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-5 tracking-wide text-white drop-shadow-md">¿Aceptarás el Llamado?</h2>
              <p className="text-[12px] md:text-sm tracking-[0.25em] uppercase mb-10 md:mb-14 font-sans font-bold text-white">Confirma tu presencia en el Claro Real</p>
              <RSVPForm invitationId={invitationId} />
            </div>
          </div>
        </motion.div>

        {/* 8. GALERÍA COLABORATIVA */}
        <motion.section {...sectionAnim} className="py-20 md:py-36 px-4 md:px-6 relative text-white">
          <div className="max-w-4xl mx-auto relative z-10">
            <div 
              className="backdrop-blur-3xl p-10 md:p-24 rounded-[3.5rem] md:rounded-[4.5rem] border text-center shadow-[0_0_70px_rgba(255,255,255,0.1)]" 
              style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 border border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                <span className="text-3xl md:text-4xl">📸</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-5 md:mb-7 tracking-wide text-white drop-shadow-md">Inmortaliza el Momento</h2>
              <p className="text-base md:text-lg font-sans font-medium opacity-100 mb-10 md:mb-14 max-w-lg mx-auto leading-relaxed text-white">
                ¡Tu visión es parte de la leyenda! Comparte aquí las fotografías mágicas que captures durante la noche.
              </p>
              
              <PhotoUploader 
                invitationId={invitationId} 
                guestName="Explorador" 
                accentColor="#ffffff" 
              />
            </div>
          </div>
        </motion.section>

        {/* REPRODUCTOR DE AUDIO */}
        <AudioPlayer youtubeUrl={initialData.youtubeMusicLink} accentColor="#ffffff" />

        {/* FOOTER */}
        <footer className="py-16 md:py-28 text-center opacity-80 relative z-10 text-white">
          <div className="w-20 h-[2px] bg-white mx-auto mb-8 md:mb-10 opacity-50" />
          <p className="text-[12px] md:text-sm tracking-[0.9em] uppercase font-sans font-bold text-white drop-shadow-md">
            {initialData.quinceaneraName} • XV
          </p>
          <p className="mt-4 text-[10px] md:text-xs opacity-70 tracking-widest font-sans font-medium text-white">Te Esperamos!</p>
        </footer>
      </div>
    </div>
  );
}