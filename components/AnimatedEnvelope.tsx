'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AnimatedEnvelopeProps {
  guestName?: string;
  onOpen: () => void;
}

export function AnimatedEnvelope({
  guestName = 'Estimado Invitado',
  onOpen,
}: AnimatedEnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    // Esperar a que termine la animación de apertura
    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8">
        {/* Animated Envelope - Blue and Gold Style */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full max-w-md"
          style={{ perspective: '1000px' }}
        >
          <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
            {/* Envelope Back */}
            <div className="absolute inset-0 bg-blue-400 rounded-md shadow-2xl border border-blue-300" />

            {/* Envelope Body - White part */}
            <motion.div
              className="absolute inset-0 bg-white rounded-md shadow-2xl overflow-hidden"
              style={{ perspective: '1200px' }}
            >
              {/* Decorative line on envelope body */}
              <div className="absolute top-1/3 left-0 right-0 h-px bg-blue-200" />

              {/* Address section */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pb-12">
                <p className="text-xs tracking-widest text-blue-700 uppercase mb-3">
                  Estimado:
                </p>
                <h2 className="text-4xl font-serif font-bold text-gray-800 text-center leading-tight">
                  {guestName}
                </h2>
                <div className="mt-6 w-20 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              </div>

              {/* Decorative corner */}
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-blue-200" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-blue-200" />
            </motion.div>

            {/* Flap - Opens up */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={isOpening ? { rotateX: -150 } : { rotateX: 0 }}
              whileHover={!isOpening ? { rotateX: -25 } : {}}
              transition={{
                rotateX: isOpening
                  ? { duration: 1.2, ease: 'easeInOut' }
                  : { duration: 0.4, ease: 'easeOut' },
              }}
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-blue-500 to-blue-400 rounded-t-md origin-top shadow-xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Flap inside */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-500 flex flex-col items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Decorative Wax Seal */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={isOpening ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-white flex items-center justify-center shadow-xl"
                >
                  <span className="text-3xl font-serif font-bold text-blue-600">XV</span>
                </motion.div>

                {/* Ribbon detail */}
                <div className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
              </div>
            </motion.div>

            {/* Paper texture lines on back flap */}
            <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,.1) 1px, rgba(0,0,0,.1) 2px)'
              }} />
            </div>
          </div>
        </motion.div>

        {/* Text and Button */}
        <AnimatePresence mode="wait">
          {!isOpening ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.p
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-lg text-white mb-8 font-light"
              >
                Tienes una invitación especial
              </motion.p>

              <button
                onClick={handleClick}
                disabled={isOpening}
                className="relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Abrir Sobre
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block ml-2"
                >
                  →
                </motion.span>
              </button>

              <p className="text-xs text-blue-100 mt-6 uppercase tracking-widest">
                Haz clic en el sobre para continuar
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="opening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-lg text-white">Abriendo invitación...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
