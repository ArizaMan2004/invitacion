'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import localFont from 'next/font/local';

// Configuración de la fuente local corregida
// Subimos solo un nivel (../) desde la carpeta "components" para llegar a "public"
const customHeroFont = localFont({
  src: '../public/fonts/Elegante.ttf', 
  variable: '--font-hero',
  display: 'swap',
});

// Componentes de la Invitación
import { CountdownTimer } from './invitation/CountdownTimer';
import { EventDateTime } from './invitation/EventDateTime';
import { PhotoGallery } from './invitation/PhotoGallery';
import { RSVPForm } from './invitation/RSVPForm';
import { AudioPlayer } from './invitation/AudioPlayer';
import { MagicSparks } from './invitation/MagicSparks'; 
import { Trivia } from './invitation/trivia';
import { PhotoUploader } from './invitation/PhotoUploader';

// Componentes del Editor (Admin)
import { EditableWrapper } from './admin/EditableWrapper';
import { GalleryModal } from './admin/GalleryModal';
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
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: "easeOut" }
};

export function InvitationSPA({
  initialData,
  invitationId,
  isEditing = false,
  onDataChange
}: InvitationSPAProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Configuración de tema dinámica
  const theme = {
    background: initialData.backgroundColor || '#0a0f0a',
    card: initialData.cardColor || 'rgba(18, 25, 18, 0.8)',
    accent: initialData.accentColor || '#b8860b',
    text: initialData.textColor || '#fcfcf0'
  };

  return (
    <div 
      className={`min-h-screen w-full overflow-x-hidden selection:bg-[#b8860b] selection:text-black ${customHeroFont.variable}`}
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* CAPA DE PARTÍCULAS MÁGICAS */}
      <MagicSparks color={theme.accent} />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={initialData.heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#0a0f0a]" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="block text-[10px] md:text-xs tracking-[0.6em] uppercase mb-6 opacity-60"
            style={{ color: theme.accent }}
          >
            Nuestra Celebración Especial
          </motion.span>
          
          <EditableWrapper isEnabled={isEditing} onEdit={(val) => onDataChange?.('quinceaneraName', val)}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-6xl md:text-9xl mb-8"
              style={{ fontFamily: 'var(--font-hero)' }}
            >
              {initialData.quinceaneraName}
            </motion.h1>
          </EditableWrapper>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-[#b8860b]" />
            <p className="font-serif italic text-xl md:text-2xl opacity-80 max-w-xl">
              "Hay momentos que se vuelven eternos cuando se comparten con las personas que amas."
            </p>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10">
        
        {/* 2. CUENTA REGRESIVA */}
        <motion.section {...sectionAnim} className="py-24 px-4 text-center">
          <h2 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-12">Faltan solo</h2>
          <CountdownTimer targetDate={initialData.eventDate} accentColor={theme.accent} />
        </motion.section>

        {/* 3. DEDICATORIA */}
        <motion.section {...sectionAnim} className="py-32 px-6 text-center max-w-3xl mx-auto">
          <EditableWrapper isEnabled={isEditing} onEdit={(val) => onDataChange?.('dedicationMessage', val)}>
            <p className="text-xl md:text-3xl font-serif leading-relaxed italic opacity-90">
              {initialData.dedicationMessage}
            </p>
          </EditableWrapper>
          <div className="mt-12 flex justify-center items-center">
            <div className="w-12 h-[1px] bg-[#b8860b]/30" />
            <div className="mx-4 text-[#b8860b] text-xl">✦</div>
            <div className="w-12 h-[1px] bg-[#b8860b]/30" />
          </div>
          <p className="mt-8 text-xs tracking-[0.3em] uppercase opacity-40">Mis Padres: {initialData.parentNames}</p>
        </motion.section>

        {/* 4. FECHA Y UBICACIÓN */}
        <motion.section {...sectionAnim} className="py-24 px-4">
          <EventDateTime 
            date={initialData.eventDate}
            time={initialData.eventTime}
            venue={initialData.venue}
            address={initialData.venueAddress}
            mapIframe={initialData.mapIframeSrc}
            accentColor={theme.accent}
          />
        </motion.section>

        {/* 5. CÓDIGO DE VESTIMENTA */}
        <motion.section {...sectionAnim} className="py-32 px-6 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-16">
              <h2 className="text-4xl font-serif mb-4">Código de Vestimenta</h2>
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ color: theme.accent }}>
                Formal / Gala
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Opción Damas */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="p-12 rounded-[3rem] border border-white/5 bg-white/[0.03] backdrop-blur-md flex flex-col items-center"
              >
                <div className="mb-8 p-6 bg-white/5 rounded-full">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3c0 1.5.5 3 2 3s2-1.5 2-3M14 3c0 1.5.5 3 2 3s2-1.5 2-3" />
                    <path d="M19 8.5L12 22l-7-13.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif mb-4 italic">Damas</h3>
                <p className="text-sm opacity-60 leading-relaxed uppercase tracking-[0.2em]">
                  
                </p>
                <div className="mt-4 w-8 h-[1px] bg-white/20" />
                <p className="mt-4 text-[10px] opacity-40 uppercase tracking-widest italic">Sugerencia: Evitar colores blancos</p>
              </motion.div>

              {/* Opción Caballeros */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="p-12 rounded-[3rem] border border-white/5 bg-white/[0.03] backdrop-blur-md flex flex-col items-center"
              >
                <div className="mb-8 p-6 bg-white/5 rounded-full">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20h16V2H4z" strokeOpacity="0.2"/>
                    <path d="M12 22l4-18M12 22l-4-18M12 2v6" />
                    <path d="M9 4l3 2 3-2" />
                    <path d="M12 8l-2 2h4l-2-2z" fill={theme.accent} />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif mb-4 italic">Caballeros</h3>
                <p className="text-sm opacity-60 leading-relaxed uppercase tracking-[0.2em]">
                  
                </p>
                <div className="mt-4 w-8 h-[1px] bg-white/20" />
                <p className="mt-4 text-[10px] opacity-40 uppercase tracking-widest italic">Corbata o corbatín obligatorio</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 6. GALERÍA DE FOTOS */}
        <motion.section {...sectionAnim} className="py-24 px-4 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-serif mb-2">Galería Pre-Evento</h2>
                <p className="text-[10px] tracking-widest uppercase opacity-40">Un vistazo a nuestra historia</p>
              </div>
            </div>
            <PhotoGallery images={initialData.galleryImages || []} />
          </div>
        </motion.section>

        {/* 7. TRIVIA */}
        <motion.section {...sectionAnim} className="py-32 bg-black/20">
          <div className="text-center mb-12 px-6">
            <h2 className="text-4xl font-serif mb-4">¿Cuánto nos conoces?</h2>
            <p className="text-sm opacity-50 italic">Participa en nuestra trivia especial</p>
          </div>
          <Trivia 
            invitationId={invitationId} 
            guestName="Invitado Especial" 
            accentColor={theme.accent} 
          />
        </motion.section>

        {/* 8. GALERÍA COLABORATIVA */}
        <motion.section {...sectionAnim} className="py-32 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="bg-[#121912]/60 backdrop-blur-2xl p-12 md:p-20 rounded-[4rem] border border-white/10 text-center shadow-2xl">
              <div className="w-20 h-20 bg-[#b8860b]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-3xl">📸</span>
              </div>
              <h2 className="text-4xl font-serif mb-6 text-white">Captura la Magia</h2>
              <p className="text-white/60 mb-12 max-w-md mx-auto leading-relaxed">
                ¡Sé parte de nuestra historia! Sube aquí todas las fotos que captures durante la noche.
              </p>
              
              <PhotoUploader 
                invitationId={invitationId} 
                guestName="Invitado" 
                accentColor={theme.accent} 
              />
            </div>
          </div>
        </motion.section>

        {/* 9. RSVP */}
        <motion.div {...sectionAnim} className="py-32 px-4">
          <div 
            className="max-w-2xl mx-auto rounded-[4rem] overflow-hidden shadow-2xl border transition-all hover:shadow-[0_0_50px_-12px_rgba(184,134,11,0.2)]" 
            style={{ borderColor: `${theme.accent}15`, backgroundColor: 'rgba(26, 51, 26, 0.4)' }}
          >
            <div className="p-12 text-center">
              <h2 className="text-4xl font-serif mb-4">¿Nos acompañas?</h2>
              <p className="text-xs tracking-[0.2em] uppercase opacity-40 mb-12 text-[#b8860b]">Por favor confirma tu asistencia</p>
              <RSVPForm invitationId={invitationId} />
            </div>
          </div>
        </motion.div>

        {/* REPRODUCTOR DE AUDIO */}
        <AudioPlayer youtubeUrl={initialData.youtubeMusicLink} accentColor={theme.accent} />

        {/* FOOTER */}
        <footer className="py-24 text-center opacity-30">
          <div className="w-16 h-[1px] bg-[#b8860b] mx-auto mb-8 opacity-50" />
          <p className="text-[10px] tracking-[0.8em] uppercase" style={{ color: theme.accent }}>
            {initialData.quinceaneraName} • MMXXVI
          </p>
        </footer>
      </div>

      {/* MODALES */}
      <AnimatePresence>
        {isGalleryOpen && (
          <GalleryModal 
            onClose={() => setIsGalleryOpen(false)} 
            images={initialData.galleryImages || []}
          />
        )}
      </AnimatePresence>
    </div>
  );
}