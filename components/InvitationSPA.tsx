'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes de la Invitación
import { HeroSection } from './invitation/HeroSection';
import { CountdownTimer } from './invitation/CountdownTimer';
import { EventDateTime } from './invitation/EventDateTime';
import { LocationMap } from './invitation/LocationMap';
import { PhotoGallery } from './invitation/PhotoGallery';
import { TicketsSection } from './invitation/TicketsSection';
import { SpecialMessage } from './invitation/SpecialMessage';
import { RSVPForm } from './invitation/RSVPForm';
import { DressCode } from './invitation/DressCode';
import { AudioPlayer } from './invitation/AudioPlayer';

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

export function InvitationSPA({
  initialData,
  invitationId = '',
  isEditing = false,
  onDataChange,
}: InvitationSPAProps) {
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [editingField, setEditingField] = useState<keyof InvitationData | null>(null);

  // --- CONFIGURACIÓN DE TEMA DINÁMICO ---
  const isDark = (initialData as any).themeMode === 'dark';
  const theme = {
    bg: isDark ? '#121212' : (initialData.backgroundColor || '#ffffff'),
    text: isDark ? '#ffffff' : (initialData.textColor || '#1a1a1a'),
    accent: initialData.accentColor || '#d97706', 
    card: isDark ? '#1e1e1e' : '#f9f9f9',
    muted: isDark ? '#a1a1aa' : '#71717a'
  };

  const openGallery = (field: keyof InvitationData) => {
    if (!isEditing) return;
    setEditingField(field);
    setIsGalleryOpen(true);
  };

  // --- COMPONENTE INTERNO: Texto Editable In-Line ---
  const EditableText = ({ 
    field, 
    value, 
    className, 
    multiline = false 
  }: { 
    field: keyof InvitationData, 
    value: string, 
    className?: string, 
    multiline?: boolean 
  }) => {
    if (!isEditing) return <span className={className}>{value || ''}</span>;

    const inputStyles = `bg-white/10 border-2 border-transparent hover:border-amber-400/50 focus:border-amber-500 focus:bg-white/20 focus:outline-none p-1 rounded transition-all w-full text-center ${className}`;
    
    return multiline ? (
      <textarea
        value={value || ''}
        onChange={(e) => onDataChange && onDataChange(field, e.target.value)}
        className={`${inputStyles} resize-none`}
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onDataChange && onDataChange(field, e.target.value)}
        className={inputStyles}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ backgroundColor: theme.bg, color: theme.text }}
      className="min-h-screen relative transition-colors duration-500"
    >
      {/* 1. HERO SECTION (PORTADA) */}
      <EditableWrapper 
        label="Imagen de Portada" 
        type="image" 
        isEditing={isEditing} 
        onEdit={() => openGallery('heroImage')}
      >
        <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
          {initialData.heroImage ? (
            <motion.img 
              initial={{ scale: 1.1 }} 
              animate={{ scale: 1 }} 
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              src={initialData.heroImage} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-300" />
          )}
          
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 text-center px-4 w-full max-w-2xl mt-12">
            <motion.h2 className="text-white text-xl md:text-2xl font-light tracking-[0.3em] uppercase mb-4">
              Mis 15 Años
            </motion.h2>
            <EditableText 
              field="quinceaneraName" 
              value={initialData.quinceaneraName || ''} 
              className="text-white text-5xl md:text-7xl font-serif drop-shadow-2xl" 
            />
            <div className="mt-8 text-white/80 font-serif italic text-lg">
              <EditableText field="parentNames" value={initialData.parentNames || ''} />
            </div>
          </div>
        </div>
      </EditableWrapper>

      {/* 2. CUENTA REGRESIVA */}
      <div className="relative z-20 -mt-16 px-4">
        <CountdownTimer 
          eventDate={initialData.eventDate} 
          eventTime={initialData.eventTime} 
        />
      </div>

      {/* 3. FECHA Y HORA */}
      <section className="py-20 px-6">
        <EventDateTime 
          eventDate={initialData.eventDate} 
          eventTime={initialData.eventTime} 
        />
      </section>

      {/* 4. UBICACIÓN Y MAPA */}
      <section className="py-16 px-4">
        <div className="text-center mb-10">
          <h2 style={{ color: theme.accent }} className="text-3xl font-serif uppercase tracking-widest">Ubicación</h2>
          
          <div className="mt-6 max-w-lg mx-auto space-y-2">
            {/* Nombre del Salón */}
            <EditableText 
              field="venue" 
              value={initialData.venue || ''} 
              className="text-2xl font-bold block" 
            />
            
            {/* Dirección Exacta */}
            <EditableText 
              field="venueAddress" 
              value={(initialData as any).venueAddress || ''} 
              className="text-lg opacity-80 block" 
              multiline 
            />
          </div>
        </div>
        
        <EditableWrapper 
          label="Mapa GPS" 
          type="map" 
          isEditing={isEditing} 
          onEdit={() => {
            const url = prompt("Pega el enlace o el Iframe de Google Maps:", initialData.mapIframeSrc);
            if (url && onDataChange) {
              // Si pegaron todo el <iframe src="...">, extraer solo el link
              const srcMatch = url.match(/src="([^"]+)"/);
              const finalUrl = srcMatch ? srcMatch[1] : url;
              onDataChange('mapIframeSrc', finalUrl);
            }
          }}
        >
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video bg-zinc-200">
            {initialData.mapIframeSrc ? (
              <iframe 
                src={initialData.mapIframeSrc} 
                className="w-full h-full border-0" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-100">
                <p>Mapa no configurado.</p>
                {isEditing && <p className="text-xs mt-2">Haz clic en el ícono de GPS de la esquina para agregar uno.</p>}
              </div>
            )}
          </div>
        </EditableWrapper>
      </section>

      {/* 5. MENSAJE ESPECIAL */}
      <section className="py-24 px-8 text-center" style={{ backgroundColor: theme.card }}>
        <h2 style={{ color: theme.accent }} className="text-4xl font-serif mb-12">Un Mensaje Especial</h2>
        <div className="max-w-3xl mx-auto">
          <EditableText 
            field="dedicationMessage" 
            value={initialData.dedicationMessage || ''} 
            multiline 
            className="text-2xl font-light italic leading-relaxed" 
          />
        </div>
      </section>

      {/* 6. GALERÍA DE FOTOS */}
      <PhotoGallery images={initialData.galleryImages || []} />

      {/* 7. DETALLES FINALES Y RSVP */}
      <div className="py-20 space-y-20">
        <TicketsSection numberOfTickets={2} />
        
        <div className="max-w-md mx-auto text-center p-8 rounded-2xl" style={{ backgroundColor: theme.card }}>
          <h2 style={{ color: theme.accent }} className="text-xl font-serif uppercase mb-4 tracking-tighter">Código de Vestimenta</h2>
          <EditableText 
            field="dressCode" 
            value={initialData.dressCode || ''} 
            className="text-2xl font-bold" 
          />
        </div>

        <RSVPForm invitationId={invitationId} />
      </div>

      {/* 8. REPRODUCTOR DE AUDIO */}
      <AudioPlayer youtubeUrl={initialData.youtubeMusicLink} />

      {/* FOOTER */}
      <footer className="py-16 text-center border-t border-white/5 opacity-50">
        <p className="text-xs tracking-[0.5em] uppercase">
          {initialData.quinceaneraName || 'Quinceañera'} • 2026
        </p>
      </footer>

      {/* MODAL GALERÍA */}
      <AnimatePresence>
        {isGalleryOpen && (
          <GalleryModal
            onClose={() => setIsGalleryOpen(false)}
            onSelect={(url) => {
              if (editingField && onDataChange) onDataChange(editingField, url);
              setIsGalleryOpen(false);
            }}
          />
        )}
      </AnimatePresence>
      
    </motion.div>
  );
}