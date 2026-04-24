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
      // Flap opens
      setOpeningStage('flap');
      setTimeout(() => {
        // Sides slide out
        setOpeningStage('sides');
        setTimeout(() => {
          // Full open
          setOpeningStage('open');
          setTimeout(() => {
            onOpen();
          }, 500);
        }, 600);
      }, 1200);
    }
  };

  return (
    <div style={{ background: `linear-gradient(135deg, ${backgroundColor}, #2a2a2a)` }} className="min-h-screen flex items-center justify-center p-4">
      <MagicalSparkles isActive={openingStage !== 'closed'} color={accentColor} count={40} />
      <div className="w-full max-w-2xl">
        {/* 3D Envelope Container */}
        <div
          className="relative mx-auto"
          style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '4/3',
            perspective: '1200px',
          }}
        >
          {/* Envelope Body - Base white rectangle */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotateX: openingStage === 'sides' || openingStage === 'open' ? 15 : 0,
            }}
            transition={{ duration: 0.8 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Back panel with texture */}
            <div className="absolute inset-0 bg-white rounded-lg shadow-2xl overflow-hidden">
              {backImage && (
                <Image
                  src={backImage}
                  alt="Envelope back"
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {!backImage && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100" />
              )}

              {/* Address section on back */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <p className="text-sm tracking-widest text-blue-700 uppercase mb-3">
                  Para:
                </p>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
                  {guestName}
                </h2>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-200 opacity-50" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-200 opacity-50" />
            </div>
          </motion.div>

          {/* Left side panel */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1/2"
            animate={
              openingStage === 'sides' || openingStage === 'open'
                ? { rotateY: -45, x: -50 }
                : { rotateY: 0, x: 0 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
          >
            <div className="absolute inset-0 bg-white rounded-l-lg shadow-lg border border-blue-100 overflow-hidden">
              {backImage && (
                <Image
                  src={backImage}
                  alt="Left panel"
                  fill
                  className="object-cover opacity-40"
                />
              )}
            </div>
          </motion.div>

          {/* Right side panel */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1/2"
            animate={
              openingStage === 'sides' || openingStage === 'open'
                ? { rotateY: 45, x: 50 }
                : { rotateY: 0, x: 0 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
          >
            <div className="absolute inset-0 bg-white rounded-r-lg shadow-lg border border-blue-100 overflow-hidden">
              {backImage && (
                <Image
                  src={backImage}
                  alt="Right panel"
                  fill
                  className="object-cover opacity-40"
                />
              )}
            </div>
          </motion.div>

          {/* Top Flap - Opens upward */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            animate={
              openingStage === 'flap' || openingStage === 'sides' || openingStage === 'open'
                ? { rotateX: -140, y: -30 }
                : { rotateX: 0, y: 0 }
            }
            transition={{
              rotateX: { duration: 1.2, ease: 'easeInOut' },
              y: { duration: 1.2, ease: 'easeInOut' },
            }}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center',
              zIndex: 10,
            }}
            onClick={handleClick}
          >
            <div
              className="absolute inset-0 bg-white rounded-t-lg shadow-xl overflow-hidden cursor-pointer"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {flapImage ? (
                <Image
                  src={flapImage}
                  alt="Envelope flap"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-500" />
              )}

              {/* Flap front decoration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={
                    openingStage !== 'closed'
                      ? { scale: 0.5, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-white shadow-lg flex items-center justify-center"
                >
                  <span className="text-2xl font-serif font-bold text-blue-600">
                    XV
                  </span>
                </motion.div>
              </div>

              {/* Ornamental design on flap */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                <div className="text-4xl text-white font-serif">✤</div>
              </div>
            </div>

            {/* Flap back side (visible when flipping) */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg shadow-xl"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                <div className="text-gray-500 text-xs">Interior del sobre</div>
              </div>
            </div>
          </motion.div>

          {/* Bottom part - invitation preview hint */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-white rounded-b-lg shadow-xl"
            style={{ zIndex: openingStage === 'open' ? 1 : 0 }}
          >
            {openingStage === 'open' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-blue-600 font-semibold">
                    Tu invitación especial
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Interactive hint */}
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
