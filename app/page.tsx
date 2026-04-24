'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RealisticEnvelope } from '@/components/RealisticEnvelope';
import { InvitationSPA } from '@/components/InvitationSPA';
import { DEFAULT_INVITATION_DATA } from '@/lib/constants';
import { InvitationData } from '@/lib/types';
import { getEnvelopeImages, getInvitation } from '@/lib/supabase';

export default function Home() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData>(DEFAULT_INVITATION_DATA);
  const [invitationId, setInvitationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [envelopeBackImage, setEnvelopeBackImage] = useState<string>('');
  const [envelopeFlapImage, setEnvelopeFlapImage] = useState<string>('');

  // Inicializar invitación buscando datos existentes, SIN crear registros nuevos
  useEffect(() => {
    const initializeInvitation = async () => {
      try {
        // 1. Buscar el ID en la URL (ideal para cuando envíes el link a los invitados)
        const urlParams = new URLSearchParams(window.location.search);
        const idFromUrl = urlParams.get('id');
        
        // 2. Si no hay en la URL, revisar el localStorage (útil para el administrador)
        const savedId = idFromUrl || localStorage.getItem('invitationId');
        
        if (savedId) {
          setInvitationId(savedId);
          // Si el ID vino de la URL, lo guardamos para no perderlo al recargar
          if (idFromUrl) {
            localStorage.setItem('invitationId', savedId);
          }
          
          // Cargar los datos REALES de la invitación desde la base de datos
          const dbData = await getInvitation(savedId);
          if (dbData) {
             setInvitationData({ ...DEFAULT_INVITATION_DATA, ...dbData });
          }

          // Cargar texturas del sobre
          const envelopeImages = await getEnvelopeImages(savedId);
          if (envelopeImages?.back) setEnvelopeBackImage(envelopeImages.back);
          if (envelopeImages?.flap) setEnvelopeFlapImage(envelopeImages.flap);
          
        } else {
          console.log('[Sistema] No se encontró ID de invitación. Mostrando plantilla base.');
        }
      } catch (error) {
        console.error('[Sistema] Error inicializando vista pública:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeInvitation();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <p className="text-lg text-amber-800 font-serif tracking-widest uppercase">Preparando evento...</p>
        </div>
      </div>
    );
  }

  if (!envelopeOpened) {
    return (
      <>
        <RealisticEnvelope
          backImage={envelopeBackImage || 'https://images.unsplash.com/photo-1577720643272-265f434884e0?w=800'}
          flapImage={envelopeFlapImage || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'}
          guestName="Invitado Especial"
          onOpen={() => setEnvelopeOpened(true)}
        />
        
        {/* Acceso Administrador */}
        <Link href="/admin" className="fixed bottom-4 right-4 text-xs text-black/20 hover:text-black/60 transition-colors z-50">
          Admin
        </Link>
      </>
    );
  }

  return (
    <>
      <InvitationSPA
        initialData={invitationData}
        invitationId={invitationId}
        isEditing={false} // Nos aseguramos de que la vista pública nunca sea editable
      />
      
      {/* Acceso Administrador */}
      <Link href="/admin" className="fixed bottom-4 right-4 text-xs text-black/20 hover:text-black/60 transition-colors z-50">
        Admin
      </Link>
    </>
  );
}