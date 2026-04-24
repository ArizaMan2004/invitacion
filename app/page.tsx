'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RealisticEnvelope } from '@/components/RealisticEnvelope';
import { InvitationSPA } from '@/components/InvitationSPA';
import { DEFAULT_INVITATION_DATA } from '@/lib/constants';
import { InvitationData } from '@/lib/types';
import { getEnvelopeImages, getInvitation } from '@/lib/supabase';
// Importamos el cliente de supabase directamente para hacer la búsqueda automática
import { supabase } from '@/lib/supabase'; 

export default function Home() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData>(DEFAULT_INVITATION_DATA);
  const [invitationId, setInvitationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [envelopeBackImage, setEnvelopeBackImage] = useState<string>('');
  const [envelopeFlapImage, setEnvelopeFlapImage] = useState<string>('');

  useEffect(() => {
    const initializeInvitation = async () => {
      try {
        // 1. Verificamos si vienes de un link específico (por si acaso)
        const urlParams = new URLSearchParams(window.location.search);
        let targetId = urlParams.get('id');
        
        // 2. BÚSQUEDA AUTOMÁTICA GLOABAL
        // Si no hay ID en la URL, buscamos la invitación principal en la base de datos
        if (!targetId) {
          const { data, error } = await supabase
            .from('invitations')
            .select('id')
            .order('created_at', { ascending: false }) // Trae la más reciente
            .limit(1)
            .single();
            
          if (data && !error) {
            targetId = data.id;
          }
        }
        
        if (targetId) {
          setInvitationId(targetId);
          
          // Cargar la data global desde Supabase
          const dbData = await getInvitation(targetId);
          if (dbData) {
            setInvitationData({ ...DEFAULT_INVITATION_DATA, ...dbData });
          }

          const envelopeImages = await getEnvelopeImages(targetId);
          if (envelopeImages?.back) setEnvelopeBackImage(envelopeImages.back);
          if (envelopeImages?.flap) setEnvelopeFlapImage(envelopeImages.flap);
        }
      } catch (error) {
        console.error('[Sistema] Error al cargar la invitación global:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeInvitation();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121f12] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-800 border-t-green-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-green-200 font-serif tracking-[0.3em] uppercase">Iniciando Magia...</p>
        </div>
      </div>
    );
  }

  if (!envelopeOpened) {
    return (
      <div className="bg-[#0d160d] min-h-screen">
        <RealisticEnvelope
          backImage={envelopeBackImage || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800'}
          flapImage={envelopeFlapImage || 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800'}
          guestName="Invitados Especiales"
          onOpen={() => setEnvelopeOpened(true)}
        />
        
        <Link 
          href="/admin" 
          className="fixed bottom-6 right-6 text-[10px] text-white/10 hover:text-white/40 transition-colors z-50 tracking-widest uppercase font-bold"
        >
          Panel de Control
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-1000">
      <InvitationSPA
        initialData={invitationData}
        invitationId={invitationId}
        isEditing={false} 
      />
      
      <Link 
        href="/admin" 
        className="fixed bottom-6 right-6 text-[10px] text-white/10 hover:text-white/40 transition-colors z-50 tracking-widest uppercase font-bold"
      >
        Panel de Control
      </Link>
    </div>
  );
}