'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { MagicalSparkles } from './MagicalSparkles';

interface RealisticEnvelopeProps {
  backImage: string;
  flapImage: string;
  guestName?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  onOpen: () => void;
}

export function RealisticEnvelope({
  backImage,
  flapImage,
  guestName = 'Estimado Invitado',
  primaryColor = '#c0c0c0',
  accentColor = '#ffd700',
  backgroundColor = '#1a1a1a',
  onOpen,
}: RealisticEnvelopeProps) {
  const [openingStage, setOpeningStage] = useState<'closed' | 'flap' | 'sides' | 'open'>('closed');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (openingStage === 'closed' && !isAnimating) {
      setIsAnimating(true);
      // 1. Se abre la solapa de arriba
      setOpeningStage('flap');
      setTimeout(() => {
        // 2. Se abren las solapas laterales
        setOpeningStage('sides');
        setTimeout(() => {
          // 3. Estado totalmente abierto (la tarjeta sube un poco)
          setOpeningStage('open');
          setTimeout(() => {
            // 4. Transición a la página principal
            onOpen();
          }, 800);
        }, 600);
      }, 1200);
    }
  };

  return (
    <div style={{ background: `linear-gradient(135deg, ${backgroundColor}, #2a2a2a)` }} className="min-h-screen flex items-center justify-center p-4">
      <MagicalSparkles isActive={openingStage !== 'closed'} color={accentColor} count={40} />
      <div className="w-full max-w-2xl">
        {/* Contenedor 3D del Sobre */}
        <div
          className="relative mx-auto"
          style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '4/3',
            perspective: '1200px',
          }}
        >
          {/* 1. FONDO DEL SOBRE (Capa más profunda) */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotateX: openingStage === 'sides' || openingStage === 'open' ? 15 : 0,
            }}
            transition={{ duration: 0.8 }}
            style={{ transformStyle: 'preserve-3d', zIndex: 0 }}
          >
            <div className="absolute inset-0 bg-white rounded-lg shadow-2xl overflow-hidden">
              {backImage ? (
                <Image
                  src={backImage}
                  alt="Envelope back"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100" />
              )}

              {/* Dirección en la parte de atrás */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-10">
                <p className="text-sm tracking-widest text-blue-700 uppercase mb-3">
                  Para:
                </p>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
                  {guestName}
                </h2>
              </div>

              {/* Decoraciones de las esquinas */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-200 opacity-50 z-10" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-200 opacity-50 z-10" />
              
              {/* Sombra interna para dar profundidad */}
              <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />
            </div>
          </motion.div>

          {/* 2. LA TARJETA (Oculta dentro del sobre) - Z-INDEX 10 */}
          <motion.div
            className="absolute inset-x-4 top-10 bottom-4 bg-white rounded-lg shadow-xl flex items-center justify-center border border-gray-100"
            style={{ zIndex: 10 }}
            animate={{
              // Sube ligeramente cuando el sobre está abierto
              y: openingStage === 'open' ? -35 : 0,
              rotateX: openingStage === 'sides' || openingStage === 'open' ? 15 : 0,
            }}
            transition={{ duration: 0.8, delay: openingStage === 'open' ? 0.2 : 0 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: openingStage === 'open' ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="text-center px-4"
            >
              <p className="text-xl md:text-2xl text-blue-600 font-semibold">
                Tu invitación especial
              </p>
            </motion.div>
          </motion.div>

          {/* 3. SOLAPA IZQUIERDA - Z-INDEX 20 */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1/2"
            animate={
              openingStage === 'sides' || openingStage === 'open'
                ? { rotateY: -115, x: -10 } // Abre hacia afuera
                : { rotateY: 0, x: 0 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center', zIndex: 20 }}
          >
            <div className="absolute inset-0 bg-white rounded-l-lg shadow-[5px_0_15px_rgba(0,0,0,0.1)] border-r border-blue-100 overflow-hidden">
              {backImage && (
                <Image src={backImage} alt="Left panel" fill className="object-cover opacity-90" />
              )}
            </div>
          </motion.div>

          {/* 4. SOLAPA DERECHA - Z-INDEX 20 */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1/2"
            animate={
              openingStage === 'sides' || openingStage === 'open'
                ? { rotateY: 115, x: 10 } // Abre hacia afuera
                : { rotateY: 0, x: 0 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center', zIndex: 20 }}
          >
            <div className="absolute inset-0 bg-white rounded-r-lg shadow-[-5px_0_15px_rgba(0,0,0,0.1)] border-l border-blue-100 overflow-hidden">
              {backImage && (
                <Image src={backImage} alt="Right panel" fill className="object-cover opacity-90" />
              )}
            </div>
          </motion.div>

          {/* 5. SOLAPA SUPERIOR - Z-INDEX 30 */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            animate={
              openingStage === 'flap' || openingStage === 'sides' || openingStage === 'open'
                ? { rotateX: -160, y: -10 } 
                : { rotateX: 0, y: 0 }
            }
            transition={{
              rotateX: { duration: 1.2, ease: 'easeInOut' },
              y: { duration: 1.2, ease: 'easeInOut' },
            }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center', zIndex: 30 }}
            onClick={handleClick}
          >
            <div
              className="absolute inset-0 bg-white rounded-t-lg shadow-[0_5px_15px_rgba(0,0,0,0.15)] overflow-hidden cursor-pointer"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {flapImage ? (
                <Image src={flapImage} alt="Envelope flap" fill className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-500" />
              )}

              {/* Sello de XV años */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={
                    openingStage !== 'closed'
                      ? { scale: 0.5, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-white shadow-lg flex items-center justify-center translate-y-4"
                >
                  <span className="text-2xl font-serif font-bold text-blue-600">XV</span>
                </motion.div>
              </div>
            </div>

            {/* Parte interna de la solapa superior */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg shadow-xl"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
            >
              <div className="absolute inset-0 opacity-40 flex items-center justify-center">
                <div className="text-gray-500 text-xs tracking-widest uppercase">Interior del sobre</div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Texto y botón de "Abrir Sobre" */}
        <AnimatePresence>
          {openingStage === 'closed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-12"
            >
              <motion.p
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-white text-lg mb-6 font-light"
              >
                Tienes una invitación especial
              </motion.p>

              <button
                onClick={handleClick}
                style={{ 
                  background: `linear-gradient(135deg, ${accentColor}, #ffed4e)`,
                  color: backgroundColor,
                }}
                className="px-8 py-3 text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Abrir Sobre
              </button>

              <p className="text-xs text-gray-300 mt-6 uppercase tracking-widest">
                Haz clic en el sobre para abrir
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}