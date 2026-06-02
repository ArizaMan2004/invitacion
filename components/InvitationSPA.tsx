'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import localFont from 'next/font/local';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';

// Configuración de fuentes
const customHeroFont = localFont({
  src: '../public/fonts/Elegante.ttf', 
  variable: '--font-hero',
  display: 'swap',
});

const customApaFont = localFont({
  src: '../public/fonts/apa.ttf', 
  variable: '--font-apa',
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
import { PhotoUploader } from './invitation/PhotoUploader';

// Componentes del Editor (Admin)
import { EditableWrapper } from './admin/EditableWrapper';
import { InvitationData } from '@/lib/types';

// --- NUEVA PROPIEDAD: ocultarMensajeNinos ---
interface InvitationSPAProps {
  initialData: InvitationData;
  invitationId: string;
  isEditing?: boolean;
  onDataChange?: (field: keyof InvitationData, value: any) => void;
  ocultarMensajeNinos?: boolean; 
}

const sectionAnim = {
  initial: { opacity: 0, y: 30 }, 
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, ease: "easeOut" } 
};

// --- SEPARADOR ELEGANTE ---
const ElegantDivider = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
    whileInView={{ opacity: 0.5, scale: 1, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="w-full flex justify-center items-center py-6 md:py-10 pointer-events-none z-10 relative"
  >
    <svg width="240" height="30" viewBox="0 0 240 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
      <path d="M 50 15 Q 85 0 120 15 T 190 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 50 15 Q 85 30 120 15 T 190 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 50 15 C 25 15, 15 0, 35 5 C 45 7.5, 45 15, 45 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 190 15 C 215 15, 225 30, 205 25 C 195 22.5, 195 15, 195 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="120" cy="15" r="2.5" fill="currentColor" />
      <circle cx="85" cy="15" r="1.5" fill="currentColor" />
      <circle cx="155" cy="15" r="1.5" fill="currentColor" />
    </svg>
  </motion.div>
);

// --- COMPONENTE DE DESTELLO (DIAMANTE) ---
const DiamondSparkle = ({ index }: { index: number }) => {
  const delay = (index % 5) * 0.7 + (index % 3) * 0.4;
  
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -top-1 -right-2 text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] z-10 pointer-events-none"
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 0, 0, 0],
        scale: [0, 1.2, 0, 0, 0],
        rotate: [0, 90, 180, 180, 180]
      }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.15, 0.3, 0.6, 1] 
      }}
    >
      <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" fill="currentColor" />
    </motion.svg>
  );
};

// --- COMPONENTE DE TEXTO ANIMADO CON DESTELLOS ---
const TypewriterText = ({ text, delay = 0, className = "", style }: { text: string, delay?: number, className?: string, style?: React.CSSProperties }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay } 
    })
  };

  const child = {
    hidden: { opacity: 0, y: 5 }, 
    visible: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.3 } } 
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ display: "inline-block", wordBreak: "normal", ...style }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, charIndex) => {
            const globalIndex = wordIndex * 20 + charIndex;
            const isSparkleTarget = char.trim() !== '' && (globalIndex % 11 === 0 || globalIndex % 17 === 0);

            return (
              <motion.span 
                key={charIndex} 
                variants={child} 
                className="inline-block relative" 
              >
                {char}
                {isSparkleTarget && <DiamondSparkle index={globalIndex} />}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <motion.span variants={child} className="inline-block">
              &nbsp;
            </motion.span>
          )}
        </span>
      ))}
    </motion.span>
  );
};

// --- FONDO DE VIDEO ANIMADO ---
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
    
    <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-500 to-blue-600 mix-blend-color opacity-70" />

    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/80 via-transparent to-[#0a0514]/90" />
  </div>
);

// --- PARTÍCULAS CON CORRECCIÓN DE HIDRATACIÓN ---
const MagicalFireflies = ({ color }: { color: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
            boxShadow: `0 0 10px 2px ${data.glowColor}A0`,
            willChange: "transform, opacity" 
          }}
          animate={{
            opacity: [0, 0.8, 0], 
            y: [0, -50, -100], 
            x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20],
          }}
          transition={{
            duration: data.duration,
            delay: data.delay,
            repeat: Infinity,
            ease: "linear" 
          }}
        />
      ))}
    </div>
  );
};

const FallingStars = ({ accentColor }: { accentColor: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const starCount = 20; 
  const starsData = useMemo(() => {
    const starPaths = [
      "M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z",
      "M12 4 L13 9 L18 10 L13 11 L12 16 L11 11 L6 10 L11 9 Z",
    ];

    return Array.from({ length: starCount }).map(() => ({
      path: starPaths[Math.floor(Math.random() * starPaths.length)],
      x: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 15,
      duration: Math.random() * 12 + 8,
      rotationDirection: Math.random() > 0.5 ? 1 : -1,
      colorVariant: Math.random() > 0.4 ? '#ffffff' : accentColor 
    }));
  }, [accentColor]);

  if (!mounted) return null;

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
            willChange: "transform, opacity"
          }}
          animate={{
            opacity: [0, 0.7, 0], 
            y: ['0vh', '100vh'],
            rotate: [0, star.rotationDirection * 360],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <path d={star.path} />
        </motion.svg>
      ))}
    </div>
  );
};

const FlyingButterflies = ({ color }: { color: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = 6; 
  const butterfliesData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      startY: Math.random() * 100,
      duration: Math.random() * 15 + 20, 
      delay: Math.random() * 15,
      scale: Math.random() * 0.3 + 0.3,
      direction: Math.random() > 0.5 ? 1 : -1, 
    }));
  }, []);

  if (!mounted) return null;

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
            opacity: 0.6, 
            willChange: "transform"
          }}
          animate={{
            x: b.direction === 1 ? ['0vw', '120vw'] : ['0vw', '-120vw'],
            y: [0, Math.random() * -100, Math.random() * 100, 0], 
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
            animate={{ scaleX: [1, 0.4, 1] }} 
            transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }} 
            style={{ transformOrigin: "center" }}
          >
            <path d="M12 2C8 2 4 6 11 12C4 18 8 22 12 22C16 22 20 18 13 12C20 6 16 2 12 2Z" />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
};

const PlantNode = ({ progress, data, color }: { progress: any, data: any, color: string }) => {
  const branchDraw = useTransform(progress, [data.start, data.end], [0, 1]);
  const leafScale = useTransform(progress, [data.start + 0.02, data.end + 0.05], [0, 1]);
  
  return (
    <g>
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
  const springProgress = useSpring(scrollYProgress, { stiffness: 30, damping: 20 });

  const leftNodes = [
    { start: 0.14, end: 0.22, branch: "M 35,150 Q 55,140 65,160", leafX: 65, leafY: 160, rot: 30 },
    { start: 0.29, end: 0.37, branch: "M 15,300 Q -5,290 -10,310", leafX: -10, leafY: 310, rot: 150 },
    { start: 0.44, end: 0.52, branch: "M 40,450 Q 60,440 70,460", leafX: 70, leafY: 460, rot: 30 },
    { start: 0.59, end: 0.67, branch: "M 15,600 Q -5,590 -10,610", leafX: -10, leafY: 610, rot: 150 },
  ];

  const rightNodes = [
    { start: 0.14, end: 0.22, branch: "M 65,150 Q 45,140 35,160", leafX: 35, leafY: 160, rot: 150 },
    { start: 0.29, end: 0.37, branch: "M 85,300 Q 105,290 110,310", leafX: 110, leafY: 310, rot: 30 },
    { start: 0.44, end: 0.52, branch: "M 60,450 Q 40,440 30,460", leafX: 30, leafY: 460, rot: 150 },
    { start: 0.59, end: 0.67, branch: "M 85,600 Q 105,590 110,610", leafX: 110, leafY: 610, rot: 30 },
  ];

  const plantColor = '#fdfcf0'; 

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      <svg className="absolute left-0 top-0 w-[20vw] md:w-[10vw] h-[100vh] opacity-70" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path
          d="M 20,0 Q 45,75 35,150 T 15,300 T 40,450 T 15,600 T 40,750 T 15,900 T 20,1000"
          fill="none"
          stroke={plantColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: springProgress }}
        />
        {leftNodes.map((node, i) => (
          <PlantNode key={i} progress={springProgress} data={node} color={plantColor} />
        ))}
      </svg>
      
      <svg className="absolute right-0 top-0 w-[20vw] md:w-[10vw] h-[100vh] opacity-70" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <motion.path
          d="M 80,0 Q 55,75 65,150 T 85,300 T 60,450 T 85,600 T 60,750 T 85,900 T 80,1000"
          fill="none"
          stroke={plantColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: springProgress }}
        />
        {rightNodes.map((node, i) => (
          <PlantNode key={i} progress={springProgress} data={node} color={plantColor} />
        ))}
      </svg>
    </div>
  );
};

export function InvitationSPA({
  initialData,
  invitationId,
  isEditing = false,
  onDataChange,
  ocultarMensajeNinos = false // Valor por defecto falso
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
  if (!heroImageSrc || heroImageSrc.includes('C:\\\\') || !heroImageSrc.startsWith('/')) {
    heroImageSrc = '/images/placeholder-hero.jpg';
  }

  return (
    <div 
      className={`min-h-screen w-full overflow-x-hidden selection:bg-[#ffffff] selection:text-[#0a0514] ${customHeroFont.variable} ${customApaFont.variable} ${fontSerif.variable} ${fontSans.variable} font-sans`}
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <AmbientVideoBackground />
      <MagicalFireflies color={theme.accent} />
      <FallingStars accentColor={theme.accent} />
      <FlyingButterflies color="#ffffff" />
      <GrowingMagicPlant color={theme.accent} />

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] min-h-[600px] w-full flex items-center justify-center overflow-hidden z-10">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.7 }} 
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
          style={{ 
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
        >
          <img 
            src={heroImageSrc} 
            alt="Hero Bosque Encantado" 
            className="w-full h-full object-cover" 
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/70 via-[#0a0514]/30 to-transparent" />
        </motion.div>

        {/* CONTENEDOR FLEX PRINCIPAL PERFECTAMENTE CENTRADO */}
        <div className="relative z-10 text-center px-4 md:px-8 w-full h-full max-w-5xl mx-auto flex flex-col items-center justify-center pt-10 pb-24">
          
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="block text-[11px] md:text-sm tracking-[0.6em] uppercase mb-4 md:mb-6 drop-shadow-md font-sans font-bold text-white shrink-0"
          >
            Te damos la bienvenida a nuestros
          </motion.span>

          {/* LOGO RESPONSIVO CON EFECTO DE RESPIRACIÓN Y ENTRADA */}
          <motion.img 
            src="/logojj.png"
            alt="Logo XV Años"
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              filter: "drop-shadow(0 0 10px rgba(255,215,0,0.2))"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: [
                "drop-shadow(0 0 10px rgba(255,255,255,0.2))", 
                "drop-shadow(0 0 35px rgba(255,255,255,0.7))", 
                "drop-shadow(0 0 10px rgba(255,255,255,0.2))"  
              ]
            }}
            transition={{ 
              opacity: { delay: 0.5, duration: 1.2 },
              scale: { delay: 0.5, duration: 1.2 },
              filter: {
                delay: 0.5,
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="w-full max-w-[280px] sm:max-w-[380px] md:max-w-[500px] lg:max-w-[650px] max-h-[30vh] md:max-h-[35vh] lg:max-h-[40vh] object-contain mx-auto mb-6 md:mb-10 px-2 shrink-0"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-3xl shrink-0"
          >
            <div 
              className="w-[2px] h-10 md:h-20 rounded-full bg-gradient-to-b from-transparent via-[#ffd700] to-transparent" 
            />
            
            <TypewriterText 
              text='"Acompáñanos en este día tan especial para celebrar la vida y nuestro nacimiento."'
              delay={1.5}
              className="font-serif italic text-lg md:text-2xl lg:text-3xl font-medium opacity-100 drop-shadow-md leading-relaxed text-white w-full"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mt-4 md:mt-6 flex flex-col items-center gap-2 opacity-100 w-full"
            >
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold font-sans text-white drop-shadow-md text-center">
                Con la bendición de nuestros padres
              </span>
              <p 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide text-[#ffd700] text-center break-words w-full"
                style={{ 
                  fontFamily: 'var(--font-hero)',
                  textShadow: '0 0 25px rgba(255,215,0,0.6), 0 4px 10px rgba(0,0,0,0.9)'
                }}
              >
                Jesús Capielo y Neida de Capielo
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* INDICADOR DESLIZA (Fijado abajo) */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white"
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
        
        <ElegantDivider />

        <motion.section {...sectionAnim} className="py-12 md:py-20 px-4 text-center relative">
          <h2 
            className="text-6xl md:text-6xl mb-8 md:mb-12 text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            Solo Faltan...
          </h2>
          <motion.div 
            className="relative z-10 p-6 md:p-12 rounded-[2.5rem] border backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.15)] max-w-4xl mx-auto w-full text-white group overflow-hidden"
            style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,215,0,0.3)' }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <CountdownTimer targetDate={initialData.eventDate} accentColor={theme.accent} />
            </div>
          </motion.div>
        </motion.section>

        {/* --- CONDICIONAL: OCULTA EL MENSAJE SI ocultarMensajeNinos ES TRUE --- */}
        {!ocultarMensajeNinos && (
          <>
            <ElegantDivider />

            <motion.section {...sectionAnim} className="py-12 md:py-20 px-6 text-center max-w-3xl mx-auto">
              <EditableWrapper isEnabled={isEditing} onEdit={(val) => onDataChange?.('dedicationMessage', val)}>
                <TypewriterText 
                  text='"Si la fiesta quieres disfrutar, a tus niños en camita debes dejar."'
                  delay={0}
                  className="text-4xl md:text-6xl leading-relaxed opacity-100 drop-shadow-lg text-white"
                  style={{ fontFamily: 'var(--font-apa)' }}
                />
              </EditableWrapper>
            </motion.section>
          </>
        )}
        {/* ---------------------------------------------------------------------- */}

        <ElegantDivider />

        <motion.section {...sectionAnim} className="py-12 md:py-20 px-4 text-white">
          <div className="max-w-5xl mx-auto">
            <EventDateTime 
              date={initialData.eventDate}
              time={initialData.eventTime}
              venue={initialData.venue}
              address={initialData.venueAddress}
              mapIframe={initialData.mapIframeSrc}
              accentColor={theme.accent}
            />

            <div className="mt-12 md:mt-16 text-center mb-6 px-4">
              <TypewriterText 
                text="La historia empieza a la hora, así que llega puntual."
                delay={0}
                className="text-3xl md:text-5xl text-white drop-shadow-md leading-relaxed"
                style={{ fontFamily: 'var(--font-apa)' }}
              />
            </div>

            <div className="mt-16 md:mt-24 text-center mb-10 md:mb-14 px-4">
              <h2 className="text-4xl md:text-6xl font-serif mb-3 tracking-wide font-bold text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">Ubicación</h2>
              <p className="text-[11px] tracking-[0.4em] uppercase font-sans font-bold text-white opacity-90 drop-shadow-sm text-center">
                Sigue el sendero hacia la celebración
              </p>
            </div>

            <motion.div 
              className="p-3 md:p-4 rounded-[3rem] border backdrop-blur-md max-w-4xl mx-auto shadow-[0_0_20px_rgba(255,215,0,0.15)] group relative overflow-hidden"
              style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,215,0,0.3)' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="rounded-[2.5rem] overflow-hidden relative w-full h-[320px] md:h-[500px] z-10">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.1794197171566!2d-69.64156179999999!3d11.3945113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e842b171d51921b%3A0x9597f059837b1c6f!2sRefugio%20Ranch!5e0!3m2!1ses!2sve!4v1778713473158!5m2!1ses!2sve" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'contrast(1.1) sepia(0.1) hue-rotate(240deg)' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        <ElegantDivider />

        {/* MEJORADA: SECCIÓN DRESS CODE */}
        <motion.section {...sectionAnim} className="py-12 md:py-20 px-6 relative text-white">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="mb-14 md:mb-20">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-5 tracking-wide text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">Dress Code</h2>
              <p className="text-[12px] md:text-sm tracking-[0.4em] uppercase font-sans font-bold text-white">
                Estilo Semi Formal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 font-sans">
              
              {/* Tarjeta Damas */}
              <motion.div 
                className="p-10 md:p-14 rounded-[3.5rem] border backdrop-blur-md flex flex-col items-center shadow-[0_0_20px_rgba(255,215,0,0.15)] relative overflow-hidden group"
                style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,215,0,0.3)' }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Resplandor de fondo en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <motion.div 
                  className="mb-8 md:mb-10 p-6 md:p-7 rounded-full border border-[#ffd700]/50 shadow-[0_0_15px_rgba(255,215,0,0.4)] bg-black/30 relative z-10"
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(255,215,0,0.4)",
                      "0 0 30px rgba(255,215,0,0.8)",
                      "0 0 15px rgba(255,215,0,0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="45" height="45" className="md:w-[55px] md:h-[55px]" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3c0 1.5.5 3 2 3s2-1.5 2-3M14 3c0 1.5.5 3 2 3s2-1.5 2-3" />
                    <path d="M19 8.5L12 22l-7-13.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5z" />
                  </svg>
                </motion.div>
                
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-5 italic text-[#ffd700] drop-shadow-sm relative z-10">Damas</h3>
                <p className="text-base opacity-100 leading-relaxed uppercase tracking-[0.25em] font-bold text-white text-center relative z-10">
                  Semi Formal
                </p>
                <div className="mt-5 w-16 h-[2px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent relative z-10" />
                <p className="mt-5 text-[12px] opacity-90 uppercase tracking-widest italic leading-relaxed text-center font-medium text-white break-words relative z-10">
                  Sugerencia: Vestido de cóctel, falda o conjunto elegante.
                </p>

                <motion.a 
                  href="https://es.pinterest.com/search/pins/?q=dresscode%2015%20woman&rs=typed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border bg-gradient-to-r from-[#ffd700]/20 to-[#ffd700]/5 text-[#ffd700] font-bold shadow-[0_0_10px_rgba(255,215,0,0.2)] relative z-10"
                  style={{ borderColor: 'rgba(255,215,0,0.5)' }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 20px rgba(255,215,0,0.6)",
                    backgroundColor: "rgba(255,215,0,0.15)"
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(255,215,0,0.2)",
                      "0 0 20px rgba(255,215,0,0.5)",
                      "0 0 10px rgba(255,215,0,0.2)"
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
                  </svg>
                  <span className="text-[11px] uppercase tracking-widest font-bold">Ver Ideas</span>
                </motion.a>
              </motion.div>

              {/* Tarjeta Caballeros */}
              <motion.div 
                className="p-10 md:p-14 rounded-[3.5rem] border backdrop-blur-md flex flex-col items-center shadow-[0_0_20px_rgba(255,215,0,0.15)] relative overflow-hidden group"
                style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,215,0,0.3)' }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Resplandor de fondo en hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <motion.div 
                  className="mb-8 md:mb-10 p-6 md:p-7 rounded-full border border-[#ffd700]/50 shadow-[0_0_15px_rgba(255,215,0,0.4)] bg-black/30 relative z-10"
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(255,215,0,0.4)",
                      "0 0 30px rgba(255,215,0,0.8)",
                      "0 0 15px rgba(255,215,0,0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }} // Retraso para que palpiten asincrónicamente
                >
                  <svg width="45" height="45" className="md:w-[55px] md:h-[55px]" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20h16V2H4z" strokeOpacity="0.15"/>
                    <path d="M12 22l4-18M12 22l-4-18M12 2v6" />
                    <path d="M9 4l3 2 3-2" />
                    <path d="M12 8l-2 2h4l-2-2z" fill="#ffd700" fillOpacity={0.9} />
                  </svg>
                </motion.div>
                
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-5 italic text-[#ffd700] drop-shadow-sm relative z-10">Caballeros</h3>
                <p className="text-base opacity-100 leading-relaxed uppercase tracking-[0.25em] font-bold text-white text-center relative z-10">
                  Semi Formal
                </p>
                <div className="mt-5 w-16 h-[2px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent relative z-10" />
                <p className="mt-5 text-[12px] opacity-90 uppercase tracking-widest italic leading-relaxed text-center font-medium text-white break-words relative z-10">
                  Sugerencia: Pantalón de vestir, camisa elegante.
                </p>

                <motion.a 
                  href="https://es.pinterest.com/search/pins/?q=dresscode%2015%20men&rs=typed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border bg-gradient-to-r from-[#ffd700]/20 to-[#ffd700]/5 text-[#ffd700] font-bold shadow-[0_0_10px_rgba(255,215,0,0.2)] relative z-10"
                  style={{ borderColor: 'rgba(255,215,0,0.5)' }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 20px rgba(255,215,0,0.6)",
                    backgroundColor: "rgba(255,215,0,0.15)"
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(255,215,0,0.2)",
                      "0 0 20px rgba(255,215,0,0.5)",
                      "0 0 10px rgba(255,215,0,0.2)"
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.25 }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
                  </svg>
                  <span className="text-[11px] uppercase tracking-widest font-bold">Ver Ideas</span>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <ElegantDivider />

        <motion.section {...sectionAnim} className="py-12 md:py-20 relative overflow-hidden text-white">
          <div className="relative z-10 text-center mb-10 md:mb-16 px-6">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-5 tracking-wide text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">¿Conoces la Leyenda?</h2>
            <p className="text-base md:text-xl opacity-100 italic font-serif font-bold text-white drop-shadow-md text-center">Demuestra cuánto sabes sobre los cumpleañeros</p>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <Trivia 
              invitationId={invitationId} 
              guestName="Invitado Real" 
              accentColor={theme.accent} 
            />
          </div>
        </motion.section>

        <ElegantDivider />

        <motion.div {...sectionAnim} className="py-12 md:py-20 px-4 text-white">
          <motion.div 
            className="max-w-2xl mx-auto rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.15)] border relative backdrop-blur-md group" 
            style={{ borderColor: 'rgba(255,215,0,0.3)', backgroundColor: theme.cardBg }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 p-8 md:p-16 text-center">
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-5 tracking-wide text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">¿Aceptarás el Llamado?</h2>
              <p className="text-[12px] md:text-sm tracking-[0.25em] uppercase mb-10 md:mb-14 font-sans font-bold text-white text-center">Confirma tu presencia en el Claro Real</p>
              <RSVPForm invitationId={invitationId} />
            </div>
          </motion.div>
        </motion.div>

        <ElegantDivider />

        <motion.section {...sectionAnim} className="py-12 md:py-20 px-4 md:px-6 relative text-white">
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div 
              className="backdrop-blur-md p-8 md:p-24 rounded-[3.5rem] md:rounded-[4.5rem] border text-center shadow-[0_0_20px_rgba(255,215,0,0.15)] group relative overflow-hidden" 
              style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,215,0,0.3)' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 border border-[#ffd700]/50 shadow-[0_0_15px_rgba(255,215,0,0.4)] bg-black/30"
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(255,215,0,0.4)",
                      "0 0 30px rgba(255,215,0,0.8)",
                      "0 0 15px rgba(255,215,0,0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-3xl md:text-4xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">📸</span>
                </motion.div>
                
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-5 md:mb-7 tracking-wide text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">Inmortaliza el Momento</h2>
                <p className="text-base md:text-lg font-sans font-medium opacity-100 mb-10 md:mb-14 max-w-lg mx-auto leading-relaxed text-white text-center">
                  ¡Tu visión es parte de la leyenda! Comparte aquí las fotografías mágicas que captures durante la noche.
                </p>
                
                <PhotoUploader 
                  invitationId={invitationId} 
                  guestName="Explorador" 
                  accentColor={theme.accent} 
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        <AudioPlayer youtubeUrl={initialData.youtubeMusicLink} accentColor={theme.accent} />

        <footer className="py-16 md:py-28 text-center opacity-80 relative z-10 text-white px-4">
          <div className="w-20 h-[2px] bg-white mx-auto mb-8 md:mb-10 opacity-30" />
          <p className="text-[12px] md:text-sm tracking-[0.9em] uppercase font-sans font-bold text-white drop-shadow-md break-words">
            {initialData.quinceaneraName} • XV
          </p>
          <p className="mt-4 text-[10px] md:text-xs opacity-70 tracking-widest font-sans font-medium text-white">Te Esperamos!</p>
        </footer>
      </div>
    </div>
  );
}