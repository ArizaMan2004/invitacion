'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Componentes
import { MagicalBook } from '@/components/AnimatedEnvelope';
import { InvitationSPA } from '@/components/InvitationSPA';
// Datos
import { DEFAULT_INVITATION_DATA } from '@/lib/constants';

export default function Home() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pequeño delay para que el loader no desaparezca tan de golpe
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Pantalla de carga elegante (Sincronizada con el tema morado/azul)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0514] flex items-center justify-center relative overflow-hidden">
        {/* Fondo sutil similar a la invitación */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center relative z-10"
        >
          {/* Spinner dorado con sombra brillante */}
          <div className="relative w-16 h-16 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-[#ffd700]/20" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.5)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Destello central */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-2 h-2 bg-[#ffd700] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
            </motion.div>
          </div>

          <motion.p
            className="text-[11px] text-[#ffd700] font-sans font-bold tracking-[0.5em] uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Preparando Magia...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="bg-[#0a0514] min-h-screen">
      {/* AnimatePresence con mode="wait" permite que el sobre termine
          su animación de salida antes de que la invitación empiece a aparecer.
      */}
      <AnimatePresence mode="wait">
        {!envelopeOpened ? (
          <MagicalBook
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
              initialData={DEFAULT_INVITATION_DATA}
              invitationId=""
              isEditing={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
