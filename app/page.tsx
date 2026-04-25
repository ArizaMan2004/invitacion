'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Componentes
import { AnimatedEnvelope } from '@/components/AnimatedEnvelope';
import { InvitationSPA } from '@/components/InvitationSPA';
// Datos y tipos
import { DEFAULT_INVITATION_DATA } from '@/lib/constants';
import { InvitationData } from '@/lib/types';
import { getInvitation, supabase } from '@/lib/supabase'; 

export default function Home() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData>(DEFAULT_INVITATION_DATA);
  const [invitationId, setInvitationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeInvitation = async () => {
      try {
        // 1. Intentar obtener el ID desde la URL (?id=...)
        const urlParams = new URLSearchParams(window.location.search);
        let targetId = urlParams.get('id');
        
        // 2. Búsqueda automática si no hay ID en la URL
        // Buscamos la invitación más reciente creada en la base de datos
        if (!targetId) {
          const { data, error } = await supabase
            .from('invitations')
            .select('id')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (data && !error) {
            targetId = data.id;
          }
        }
        
        if (targetId) {
          setInvitationId(targetId);
          
          // 3. Cargar los datos completos de la invitación
          const dbData = await getInvitation(targetId);
          if (dbData) {
            setInvitationData({ 
              ...DEFAULT_INVITATION_DATA, 
              ...dbData,
              // Si la DB no tiene imágenes de galería, usamos las de respaldo
              galleryImages: (dbData.galleryImages && dbData.galleryImages.length > 0) 
                ? dbData.galleryImages 
                : DEFAULT_INVITATION_DATA.galleryImages
            });
          }
        }
      } catch (error) {
        console.error('[Sistema] Error crítico al inicializar:', error);
      } finally {
        // Un pequeño delay para que el loader no desaparezca tan de golpe
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    initializeInvitation();
  }, []);

  // Pantalla de carga elegante
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d160d] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-[10px] text-white/60 font-serif tracking-[0.4em] uppercase">
            Cargando Invitación...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="bg-[#0d160d] min-h-screen">
      {/* AnimatePresence con mode="wait" permite que el sobre termine 
          su animación de salida antes de que la invitación empiece a aparecer.
      */}
      <AnimatePresence mode="wait">
        {!envelopeOpened ? (
          <AnimatedEnvelope
            key="envelope-component"
            // Puedes cambiar este nombre por el de tus invitados
            guestName="Invitados Especiales"
            onOpen={() => setEnvelopeOpened(true)}
          />
        ) : (
          <motion.div
            key="invitation-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }} // Fade in muy lento y elegante
          >
            <InvitationSPA
              initialData={invitationData}
              invitationId={invitationId}
              isEditing={false} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}