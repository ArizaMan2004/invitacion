'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes de la Invitación
import { CountdownTimer } from './invitation/CountdownTimer';
import { EventDateTime } from './invitation/EventDateTime';
import { PhotoGallery } from './invitation/PhotoGallery';
import { RSVPForm } from './invitation/RSVPForm';
import { AudioPlayer } from './invitation/AudioPlayer';
// 🌟 Importamos las chispas mágicas que creamos antes
import { MagicSparks } from './invitation/MagicSparks'; 

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

// ✨ Configuración de animación reutilizable para el scroll
const scrollAnim = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

export function InvitationSPA({
  initialData,
  invitationId = '',
  isEditing = false,
  onDataChange,
}: InvitationSPAProps) {
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [editingField, setEditingField] = useState<keyof InvitationData | null>(null);

  const isDark = initialData.themeMode === 'dark';
  const theme = {
    bg: isDark ? (initialData.backgroundColor || '#121f12') : (initialData.backgroundColor || '#ffffff'),
    text: isDark ? (initialData.textColor || '#e8efe8') : (initialData.textColor || '#1a1a1a'),
    accent: initialData.accentColor || '#6b8e23', 
    card: isDark ? (initialData.cardColor || '#1d331d') : (initialData.cardColor || '#f9f9f9'),
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: theme.bg, color: theme.text }} className="min-h-screen relative transition-colors duration-500 overflow-hidden">
      
      {/* 1. PORTADA CON ANIMACIONES Y CHISPAS */}
      <EditableWrapper label="Imagen de Portada" type="image" isEditing={isEditing} onEdit={() => openGallery('heroImage')}>
        <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
          {initialData.heroImage && (
            <motion.img 
              initial={{ scale: 1.1 }} 
              animate={{ scale: 1 }} 
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }} 
              src={initialData.heroImage} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
          
          {/* 🌟 Las Chispas Mágicas flotando en el fondo */}
          <MagicSparks />

          <div className="relative z-10 text-center px-4 mt-12">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-white text-xl md:text-2xl font-light tracking-[0.3em] uppercase mb-4"
            >
              Mis 15 Años
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            >
              <EditableText field="quinceaneraName" value={initialData.quinceaneraName} className="text-white text-5xl md:text-7xl font-serif drop-shadow-2xl block" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1.5 }}
              className="mt-8 text-white/80 font-serif italic text-lg"
            >
              <EditableText field="parentNames" value={initialData.parentNames} />
            </motion.div>
          </div>
        </div>
      </EditableWrapper>

      {/* 2. CUENTA REGRESIVA */}
      <motion.div {...scrollAnim} className="relative z-20 -mt-16 px-4">
        <CountdownTimer eventDate={initialData.eventDate} eventTime={initialData.eventTime} />
      </motion.div>

      {/* 3. FECHA Y HORA */}
      <motion.section {...scrollAnim} className="py-20 px-6">
        <EventDateTime eventDate={initialData.eventDate} eventTime={initialData.eventTime} />
      </motion.section>

      {/* 4. UBICACIÓN */}
      <motion.section {...scrollAnim} className="py-16 px-4 text-center">
        <h2 style={{ color: theme.accent }} className="text-3xl font-serif uppercase tracking-widest mb-10">Ubicación</h2>
        <div className="max-w-lg mx-auto space-y-2 mb-10">
          <EditableText field="venue" value={initialData.venue} className="text-2xl font-bold block" />
          <EditableText field="venueAddress" value={initialData.venueAddress} className="text-lg opacity-80 block" multiline />
        </div>
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video" style={{ backgroundColor: theme.card }}>
          {initialData.mapIframeSrc ? (
            <iframe src={initialData.mapIframeSrc} className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-50"><p>Mapa no configurado.</p></div>
          )}
        </div>
      </motion.section>

      {/* 5. MENSAJE */}
      <motion.section {...scrollAnim} className="py-24 px-8 text-center" style={{ backgroundColor: theme.card }}>
        <h2 style={{ color: theme.accent }} className="text-4xl font-serif mb-12">Un Mensaje Especial</h2>
        <div className="max-w-3xl mx-auto">
          <EditableText field="dedicationMessage" value={initialData.dedicationMessage} multiline className="text-2xl font-light italic leading-relaxed" />
        </div>
      </motion.section>

      {/* 6. GALERÍA */}
      <motion.div {...scrollAnim}>
        <EditableWrapper 
          label="Galería de Fotos" 
          type="image" 
          isEditing={isEditing} 
          onEdit={() => {
            const urls = prompt("Ingresa las URLs de las fotos separadas por coma:", initialData.galleryImages?.join(', '));
            if (urls && onDataChange) {
              onDataChange('galleryImages', urls.split(',').map(u => u.trim()));
            }
          }}
        >
          <PhotoGallery images={initialData.galleryImages || []} />
        </EditableWrapper>
      </motion.div>

      {/* 7. VESTIMENTA Y RSVP */}
      <div className="py-20 space-y-20">
        <motion.div {...scrollAnim} className="max-w-md mx-auto text-center p-8 rounded-2xl shadow-xl" style={{ backgroundColor: theme.card }}>
          <h2 style={{ color: theme.accent }} className="text-xl font-serif uppercase mb-4 tracking-tighter">Código de Vestimenta</h2>
          <EditableText field="dressCode" value={initialData.dressCode} className="text-2xl font-bold" />
        </motion.div>
        
        <motion.div {...scrollAnim}>
          <RSVPForm invitationId={invitationId} />
        </motion.div>
      </div>

      {/* 8. AUDIO */}
      <AudioPlayer youtubeUrl={initialData.youtubeMusicLink} accentColor={theme.accent} />

      <footer className="py-16 text-center border-t border-white/5 opacity-50">
        <p className="text-xs tracking-[0.5em] uppercase">{initialData.quinceaneraName} • 2026</p>
      </footer>

      {/* MODAL PARA CAMBIO DE IMÁGENES */}
      <AnimatePresence>
        {isGalleryOpen && (
          <GalleryModal 
            onClose={() => setIsGalleryOpen(false)} 
            onSelect={(url) => { 
              if (editingField) onDataChange?.(editingField, url); 
              setIsGalleryOpen(false); 
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}