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
  initial: { opacity: 0, y: 30 }, 
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, ease: "easeOut" } 
};

const TypewriterText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const letters = Array.from(text);
  
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

const AmbientGradient = () => (
  <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden bg-gradient-to-br from-[#120524] via-[#090b21] to-[#040b1a]">
    <motion.div
      className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[120px] bg-[#6b21a8]"
      animate={{ x: [0, 20, 0], y: [0, 30, 0] }} 
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
      style={{ willChange: "transform" }}
    />
    <motion.div
      className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[150px] bg-[#1e3a8a]"
      animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      style={{ willChange: "transform" }}
    />
    <motion.div
      className="absolute -bottom-[20%] left-[20%] w-[80%] h-[60%] rounded-full mix-blend-screen filter blur-[140px] bg-[#312e81]"
      animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      style={{ willChange: "transform" }}
    />
  </div>
);

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

  // Base del filtro CSS para convertir cualquier color a Dorado brillante
  const baseGoldFilter = "brightness(0) saturate(100%) invert(85%) sepia(30%) saturate(1000%) hue-rotate(355deg) brightness(105%) contrast(110%)";

  return (
    <div 
      className={`min-h-screen w-full overflow-x-hidden selection:bg-[#ffffff] selection:text-[#0a0514] ${customHeroFont.variable} ${fontSerif.variable} ${fontSans.variable} font-sans`}
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <AmbientGradient />
      <MagicalFireflies color={theme.accent} />
      <FallingStars accentColor={theme.accent} />
      <FlyingButterflies color="#ffffff" />
      <GrowingMagicPlant color={theme.accent} />

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
            className="w-full h-full object-cover grayscale" 
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6b21a8] to-[#1e3a8a] mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/70 via-[#0a0514]/30 to-transparent" />
        </motion.div>

        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="block text-[11px] md:text-sm tracking-[0.6em] uppercase mb-4 md:mb-6 drop-shadow-md font-sans font-bold text-white"
          >
            Felices XV Años
          </motion.span>

          {/* LOGO ANIMADO (Reemplaza el texto H1) */}
          <motion.img 
            src="/logojj.png"
            alt="Logo XV Años"
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              filter: `${baseGoldFilter} drop-shadow(0 0 0px rgba(255,215,0,0))`
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: [
                `${baseGoldFilter} drop-shadow(0 0 10px rgba(255,215,0,0.4))`,
                `${baseGoldFilter} drop-shadow(0 0 35px rgba(255,215,0,0.8))`,
                `${baseGoldFilter} drop-shadow(0 0 10px rgba(255,215,0,0.4))`
              ]
            }}
            transition={{ 
              default: { delay: 0.5, duration: 1.2 }, 
              filter: { 
                delay: 1.7, 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }
            }}
            className="w-full max-w-[400px] md:max-w-[600px] h-auto object-contain mx-auto mb-6 md:mb-8"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-4 md:gap-8 w-full"
          >
            <div 
              className="w-[2px] h-16 md:h-28 rounded-full bg-gradient-to-b from-transparent via-[#ffd700] to-transparent" 
            />
            
            <TypewriterText 
              text='"Acompáñanos en este día tan especial para celebrar la vida y nuestro nacimiento."'
              delay={1.5}
              className="font-serif italic text-xl md:text-3xl font-medium opacity-100 max-w-2xl drop-shadow-md leading-relaxed px-4 text-white"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
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
        
        <motion.section {...sectionAnim} className="py-16 md:py-28 px-4 text-center relative">
          <h2 className="text-[11px] md:text-sm tracking-[0.4em] uppercase font-bold font-sans mb-10 md:mb-14 text-white drop-shadow-md">Solo Faltan</h2>
          <div 
            className="relative z-10 p-6 md:p-12 rounded-[2.5rem] border backdrop-blur-md shadow-xl max-w-4xl mx-auto w-full text-white"
            style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <CountdownTimer targetDate={initialData.eventDate} accentColor="#ffffff" />
          </div>
        </motion.section>

        <motion.section {...sectionAnim} className="py-20 md:py-36 px-6 text-center max-w-3xl mx-auto">
          <EditableWrapper isEnabled={isEditing} onEdit={(val) => onDataChange?.('dedicationMessage', val)}>
            <TypewriterText 
              text='"Si la fiesta quieres disfrutar, a tus niños en camita debes dejar."'
              delay={0}
              className="text-3xl md:text-5xl font-serif font-bold leading-relaxed italic opacity-100 drop-shadow-lg text-white"
            />
          </EditableWrapper>
        </motion.section>

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

            <div className="mt-12 md:mt-16 text-center mb-6">
              <TypewriterText 
                text="La historia empieza a la hora, así que llega puntual."
                delay={0}
                className="text-xl md:text-3xl font-serif italic text-white drop-shadow-md tracking-wide font-bold"
              />
            </div>

            <div className="mt-16 md:mt-24 text-center mb-10 md:mb-14">
              <h2 className="text-4xl md:text-6xl font-serif mb-3 tracking-wide font-bold text-white">Ubicación</h2>
              <p className="text-[11px] tracking-[0.4em] uppercase font-sans font-bold text-white opacity-90 drop-shadow-sm">
                Sigue el sendero hacia la celebración
              </p>
            </div>

            <div 
              className="p-3 md:p-4 rounded-[3rem] border backdrop-blur-md max-w-4xl mx-auto shadow-xl"
              style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="rounded-[2.5rem] overflow-hidden relative w-full h-[320px] md:h-[500px]">
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
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionAnim} className="py-20 md:py-36 px-6 relative text-white">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="mb-14 md:mb-20">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-5 tracking-wide text-white drop-shadow-md">Dress Code</h2>
              <p className="text-[12px] md:text-sm tracking-[0.4em] uppercase font-sans font-bold text-white">
                Estilo Semi Formal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 font-sans">
              <div 
                className="p-10 md:p-14 rounded-[3.5rem] border backdrop-blur-md flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="mb-8 md:mb-10 p-6 md:p-7 bg-white/10 rounded-full border border-white/20">
                  <svg width="45" height="45" className="md:w-[55px] md:h-[55px]" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3c0 1.5.5 3 2 3s2-1.5 2-3M14 3c0 1.5.5 3 2 3s2-1.5 2-3" />
                    <path d="M19 8.5L12 22l-7-13.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-5 italic text-white drop-shadow-sm">Damas</h3>
                <p className="text-base opacity-100 leading-relaxed uppercase tracking-[0.25em] font-bold text-white">
                  Semi Formal
                </p>
                <div className="mt-5 w-16 h-[2px] bg-white/30" />
                <p className="mt-5 text-[12px] opacity-90 uppercase tracking-widest italic leading-relaxed text-center font-medium text-white">
                  Sugerencia: Vestido de cóctel, falda o conjunto elegante.
                </p>

                <a 
                  href="https://es.pinterest.com/search/pins/?q=dresscode%2015%20woman&rs=typed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all duration-200 hover:scale-105 bg-white/10 text-white font-bold"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
                  </svg>
                  <span className="text-[11px] uppercase tracking-widest font-bold">Ver Ideas</span>
                </a>
              </div>

              <div 
                className="p-10 md:p-14 rounded-[3.5rem] border backdrop-blur-md flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="mb-8 md:mb-10 p-6 md:p-7 bg-white/10 rounded-full border border-white/20">
                  <svg width="45" height="45" className="md:w-[55px] md:h-[55px]" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20h16V2H4z" strokeOpacity="0.15"/>
                    <path d="M12 22l4-18M12 22l-4-18M12 2v6" />
                    <path d="M9 4l3 2 3-2" />
                    <path d="M12 8l-2 2h4l-2-2z" fill="#ffffff" fillOpacity={0.9} />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-5 italic text-white drop-shadow-sm">Caballeros</h3>
                <p className="text-base opacity-100 leading-relaxed uppercase tracking-[0.25em] font-bold text-white">
                  Semi Formal
                </p>
                <div className="mt-5 w-16 h-[2px] bg-white/30" />
                <p className="mt-5 text-[12px] opacity-90 uppercase tracking-widest italic leading-relaxed text-center font-medium text-white">
                  Sugerencia: Pantalón de vestir, camisa elegante.
                </p>

                <a 
                  href="https://es.pinterest.com/search/pins/?q=dresscode%2015%20men&rs=typed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border transition-all duration-200 hover:scale-105 bg-white/10 text-white font-bold"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
                  </svg>
                  <span className="text-[11px] uppercase tracking-widest font-bold">Ver Ideas</span>
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionAnim} className="py-20 md:py-36 relative overflow-hidden text-white">
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

        <motion.div {...sectionAnim} className="py-20 md:py-36 px-4 text-white">
          <div 
            className="max-w-2xl mx-auto rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-xl border relative backdrop-blur-md" 
            style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: theme.cardBg }}
          >
            <div className="relative z-10 p-10 md:p-16 text-center">
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-5 tracking-wide text-white drop-shadow-md">¿Aceptarás el Llamado?</h2>
              <p className="text-[12px] md:text-sm tracking-[0.25em] uppercase mb-10 md:mb-14 font-sans font-bold text-white">Confirma tu presencia en el Claro Real</p>
              <RSVPForm invitationId={invitationId} />
            </div>
          </div>
        </motion.div>

        <motion.section {...sectionAnim} className="py-20 md:py-36 px-4 md:px-6 relative text-white">
          <div className="max-w-4xl mx-auto relative z-10">
            <div 
              className="backdrop-blur-md p-10 md:p-24 rounded-[3.5rem] md:rounded-[4.5rem] border text-center shadow-xl" 
              style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 border border-white/20">
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

        <AudioPlayer youtubeUrl={initialData.youtubeMusicLink} accentColor="#ffffff" />

        <footer className="py-16 md:py-28 text-center opacity-80 relative z-10 text-white">
          <div className="w-20 h-[2px] bg-white mx-auto mb-8 md:mb-10 opacity-30" />
          <p className="text-[12px] md:text-sm tracking-[0.9em] uppercase font-sans font-bold text-white drop-shadow-md">
            {initialData.quinceaneraName} • XV
          </p>
          <p className="mt-4 text-[10px] md:text-xs opacity-70 tracking-widest font-sans font-medium text-white">Te Esperamos!</p>
        </footer>
      </div>
    </div>
  );
}