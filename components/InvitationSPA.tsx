'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  invitationId?: string;
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
  invitationId = '',
  isEditing = false,
  onDataChange,
}: InvitationSPAProps) {
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [editingField, setEditingField] = useState<keyof InvitationData | null>(null);

  const theme = {
    bg: initialData.backgroundColor || '#121912', 
    text: initialData.textColor || '#fcfcf0',
    accent: initialData.accentColor || '#b8860b', 
    card: initialData.cardColor || '#1a331a', 
  };

  const openGallery = (field: keyof InvitationData) => {
    if (!isEditing) return;
    setEditingField(field);
    setIsGalleryOpen(true);
  };

  const EditableText = ({ field, value, className, multiline = false }: any) => {
    if (!isEditing) return <span className={className}>{value || ''}</span>;
    const inputStyles = `bg-black/10 border-2 border-transparent hover:border-amber-400/50 focus:border-amber-500 focus:bg-black/20 focus:outline-none p-1 rounded transition-all w-full text-center ${className}`;
    
    return multiline ? (
      <textarea value={value || ''} onChange={(e) => onDataChange?.(field, e.target.value)} className={`${inputStyles} resize-none`} rows={3} style={{ color: 'inherit' }} />
    ) : (
      <input type="text" value={value || ''} onChange={(e) => onDataChange?.(field, e.target.value)} className={inputStyles} style={{ color: 'inherit' }} />
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ backgroundColor: theme.bg, color: theme.text }} 
      className="min-h-screen relative transition-colors duration-500 overflow-hidden font-sans"
    >
      {/* FONDO MÁGICO */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(42,74,42,0.5),_transparent_70%)]" 
        />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <div className="relative z-10">
        
        {/* 1. PORTADA */}
        <EditableWrapper label="Imagen de Portada" type="image" isEditing={isEditing} onEdit={() => openGallery('heroImage')}>
          <section className="relative h-screen w-full flex items-center justify-center overflow-hidden rounded-b-[5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            {initialData.heroImage && (
              <motion.img 
                initial={{ scale: 1.15 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }} 
                src={initialData.heroImage} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-[#121912]" />
            <MagicSparks />

            <div className="relative z-10 text-center px-4">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                style={{ color: theme.accent }}
                className="text-xl md:text-2xl font-light tracking-[0.5em] uppercase mb-8"
              >
                Mis 15 Años
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
              >
                <EditableText field="quinceaneraName" value={initialData.quinceaneraName} className="text-[#fcfcf0] text-7xl md:text-9xl font-serif drop-shadow-[0_10px_20px_rgba(0,0,0,1)] block mb-6" />
              </motion.div>
            </div>
          </section>
        </EditableWrapper>

        {/* 2. CUENTA REGRESIVA */}
        <motion.div {...sectionAnim} className="relative z-20 -mt-24 px-4 max-w-5xl mx-auto">
          <div className="rounded-[4rem] overflow-hidden backdrop-blur-xl bg-black/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-3" style={{ border: `1px solid ${theme.accent}30` }}>
            <div className="rounded-[3.5rem] bg-white/5 py-8 md:py-12">
              <CountdownTimer eventDate={initialData.eventDate} eventTime={initialData.eventTime} />
            </div>
          </div>
        </motion.div>

        {/* 3. FECHA Y HORA */}
        <motion.section {...sectionAnim} className="min-h-[70vh] flex items-center justify-center px-6">
          <EventDateTime eventDate={initialData.eventDate} eventTime={initialData.eventTime} />
        </motion.section>

        {/* 4. UBICACIÓN */}
        <motion.section {...sectionAnim} className="py-24 px-4 text-center">
          <h2 style={{ color: theme.accent }} className="text-4xl font-serif uppercase tracking-[0.3em] mb-16">Ubicación</h2>
          <div className="max-w-xl mx-auto space-y-6 mb-16">
            <EditableText field="venue" value={initialData.venue} className="text-4xl font-serif block" />
            <EditableText field="venueAddress" value={initialData.venueAddress} className="text-xl opacity-80 block font-light leading-relaxed" multiline />
          </div>
          <div className="max-w-5xl mx-auto rounded-[4rem] overflow-hidden shadow-2xl aspect-video border-2" style={{ borderColor: `${theme.accent}20` }}>
            <iframe src={initialData.mapIframeSrc} className="w-full h-full border-0 grayscale-[30%] contrast-[110%]" allowFullScreen loading="lazy"></iframe>
          </div>
        </motion.section>

        {/* 5. TRIVIA */}
        <motion.div {...sectionAnim}>
          <Trivia invitationId={invitationId} guestName="Invitado" accentColor={theme.accent} />
        </motion.div>

        {/* 6. VESTIMENTA */}
        <motion.section {...sectionAnim} className="py-32 px-4">
          <div className="max-w-4xl mx-auto text-center p-16 md:p-24 rounded-[5rem] shadow-2xl relative overflow-hidden" style={{ backgroundColor: theme.card, border: `1px solid ${theme.accent}20` }}>
            <h2 style={{ color: theme.accent }} className="text-sm font-sans uppercase mb-20 tracking-[0.5em] opacity-70">Dress Code</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-32">
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="0.8" className="w-28 h-28 mb-8 drop-shadow-lg opacity-90">
                  <path d="M7 12l-5-3v6l5-3zM17 12l5-3v6l5-3z" /><circle cx="12" cy="12" r="1.5" /><path d="M7 8l5 4 5-4M12 14v8M4 22h16" />
                </svg>
                <span className="text-2xl font-serif tracking-widest uppercase">Smoking</span>
              </div>
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="0.8" className="w-28 h-28 mb-8 drop-shadow-lg opacity-90">
                  <path d="M9 4s-1 0-1 2l-1 5h10l-1-5c0-2-1-2-1-2M7 11c0 2 5 2 5 2s5 0 5-2M7 13l-2.5 9h15l-2.5-9" />
                </svg>
                <span className="text-2xl font-serif tracking-widest uppercase">Vestido Largo</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 7. GALERÍA Y CARGA NATIVA (SUPABASE BUCKET) */}
        <motion.section {...sectionAnim} className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <PhotoGallery images={initialData.galleryImages || []} />
            
            <div className="mt-20 p-12 md:p-20 rounded-[4rem] bg-black/20 backdrop-blur-md border border-white/5 shadow-2xl">
              <h2 className="text-3xl font-serif mb-6" style={{ color: theme.accent }}>
                Álbum de Recuerdos
              </h2>
              <p className="max-w-lg mx-auto mb-12 opacity-70 font-light leading-relaxed">
                ¡Sé parte de nuestra historia! Sube aquí todas las fotos y videos que captures durante esta noche mágica.
              </p>
              
              {/* ✅ INTEGRACIÓN DEFINITIVA DEL PHOTO UPLOADER */}
              <PhotoUploader 
                invitationId={invitationId} 
                guestName="Invitado" 
                accentColor={theme.accent} 
              />
            </div>
          </div>
        </motion.section>

        {/* 8. RSVP */}
        <motion.div {...sectionAnim} className="py-32 px-4">
          <div className="max-w-2xl mx-auto rounded-[4rem] overflow-hidden shadow-2xl border" style={{ borderColor: `${theme.accent}15`, backgroundColor: 'rgba(26, 51, 26, 0.4)' }}>
            <RSVPForm invitationId={invitationId} />
          </div>
        </motion.div>

        <AudioPlayer youtubeUrl={initialData.youtubeMusicLink} accentColor={theme.accent} />

        <footer className="py-24 text-center opacity-30">
          <p className="text-xs tracking-[0.8em] uppercase" style={{ color: theme.accent }}>{initialData.quinceaneraName} • MMXXVI</p>
        </footer>
      </div>

      <AnimatePresence>
        {isGalleryOpen && (
          <GalleryModal 
            onClose={() => setIsGalleryOpen(false)} 
            onSelect={(url) => { if (editingField) onDataChange?.(editingField, url); setIsGalleryOpen(false); }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}