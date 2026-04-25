'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { MagicalSparkles } from './MagicalSparkles';

interface RealisticEnvelopeProps {
  backImage: string; // Imagen para la parte trasera y solapas laterales
  flapImage: string; // Imagen para la solapa triangular superior
  guestName?: string;
  primaryColor?: string; // Verde musgo profundo por defecto
  accentColor?: string; // Oro viejo para detalles
  backgroundColor?: string; // Fondo bosque oscuro por defecto
  onOpen: () => void;
}

export function RealisticEnvelope({
  backImage,
  flapImage,
  guestName = 'Estimado Invitado',
  primaryColor = '#1a331a', // Verde musgo profundo
  accentColor = '#b8860b', // Oro viejo / Latón
  backgroundColor = '#121912', // Fondo bosque oscuro
  onOpen,
}: RealisticEnvelopeProps) {
  const [openingStage, setOpeningStage] = useState<'closed' | 'flap' | 'sides' | 'open'>('closed');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (openingStage === 'closed' && !isAnimating) {
      setIsAnimating(true);
      // 1. Se abre la solapa triangular hacia arriba
      setOpeningStage('flap');
      setTimeout(() => {
        // 2. Se abren las solapas laterales
        setOpeningStage('sides');
        setTimeout(() => {
          // 3. Estado totalmente abierto, la tarjeta (hoja de papel) sube
          setOpeningStage('open');
          setTimeout(() => {
            // 4. Transición a la página principal
            onOpen();
          }, 1200);
        }, 800);
      }, 1500);
    }
  };

  return (
    <div 
      style={{ 
        background: `linear-gradient(135deg, ${backgroundColor}, #1e291e)`,
        position: 'relative',
        overflow: 'hidden'
      }} 
      className="min-h-screen flex items-center justify-center p-4"
    >
      <MagicalSparkles isActive={openingStage !== 'closed'} color={accentColor} count={60} />
      
      <div className="w-full max-w-2xl">
        {/* Contenedor 3D del Sobre con perspectiva */}
        <div
          className="relative mx-auto"
          style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '16/11', // Un poco más alargado como un sobre real
            perspective: '1500px',
          }}
        >
          {/* 1. FONDO DEL SOBRE (Capa más profunda) */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotateX: openingStage === 'sides' || openingStage === 'open' ? 10 : 0,
            }}
            transition={{ duration: 1 }}
            style={{ transformStyle: 'preserve-3d', zIndex: 0 }}
          >
            <div 
              className="absolute inset-0 bg-white rounded-lg shadow-2xl overflow-hidden border border-white/5"
              style={{ background: primaryColor }}
            >
              {backImage && (
                <Image
                  src={backImage}
                  alt="Fondo del sobre"
                  fill
                  className="object-cover opacity-60"
                  priority
                />
              )}

              {/* Dirección en la parte de atrás - Usando verdes suaves y oro */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center z-10">
                <p 
                  className="text-xs tracking-widest uppercase mb-4 opacity-70"
                  style={{ color: '#a0b0a0' }} // Verde suave
                >
                  Para:
                </p>
                <h2 
                  className="text-3xl md:text-4xl font-serif font-bold tracking-tight"
                  style={{ color: accentColor }} // Oro viejo
                >
                  {guestName}
                </h2>
              </div>

              {/* Decoraciones de las esquinas en latón */}
              <div 
                className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 opacity-40 z-10" 
                style={{ borderColor: accentColor }}
              />
              <div 
                className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 opacity-40 z-10" 
                style={{ borderColor: accentColor }}
              />
              
              {/* Sombra interna para dar profundidad */}
              <div className="absolute inset-0 bg-black/15 z-0 pointer-events-none" />
            </div>
          </motion.div>

          {/* 2. LA HOJA DE PAPEL / INVITACIÓN (Oculta dentro) - Z-INDEX 10 */}
          <motion.div
            className="absolute inset-x-5 top-12 bottom-6 bg-white rounded shadow-inner flex flex-col items-center justify-center border border-gray-100 p-6 md:p-8"
            style={{ 
              zIndex: 10,
              background: '#fcfcf0', // Color papel antiguo suave
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
            }}
            animate={{
              // Se desliza hacia arriba al abrirse
              y: openingStage === 'open' ? -60 : 0,
              rotateX: openingStage === 'sides' || openingStage === 'open' ? 10 : 0,
            }}
            transition={{ duration: 1, delay: openingStage === 'open' ? 0.3 : 0 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: openingStage === 'open' ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className="text-center w-full"
            >
              {/* Título de bienvenida con oro viejo */}
              <p 
                className="text-3xl md:text-4xl font-serif font-bold mb-6 tracking-tight"
                style={{ color: accentColor }}
              >
                ¡Te doy la Bienvenida!
              </p>
              
              {/* Texto de invitación principal en verde musgo profundo */}
              <div 
                className="text-base md:text-lg font-light leading-relaxed max-w-sm mx-auto"
                style={{ color: '#2a4a2a' }}
              >
                <p>Eres una parte muy especial de mi vida.</p>
                <p>Me haría muy feliz que nos acompañaras en este día mágico.</p>
              </div>

              {/* Detalle decorativo central */}
              <div className="flex items-center justify-center gap-4 my-8 opacity-40">
                <div className="h-px w-16" style={{ background: accentColor }} />
                <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                <div className="h-px w-16" style={{ background: accentColor }} />
              </div>

              <p 
                className="text-sm uppercase tracking-widest font-medium"
                style={{ color: accentColor }}
              >
                XV Años
              </p>
            </motion.div>
          </motion.div>

          {/* 3. SOLAPA IZQUIERDA - Z-INDEX 20 */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1/2"
            animate={
              openingStage === 'sides' || openingStage === 'open'
                ? { rotateY: -110, x: -15, scale: 1.02 } // Abre hacia afuera
                : { rotateY: 0, x: 0, scale: 1 }
            }
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            style={{ 
              transformStyle: 'preserve-3d', 
              transformOrigin: 'left center', 
              zIndex: 20 
            }}
          >
            <div 
              className="absolute inset-0 bg-white rounded-l-lg shadow-[5px_0_15px_rgba(0,0,0,0.1)] border-r border-black/5 overflow-hidden"
              style={{ background: primaryColor }}
            >
              {backImage && (
                <Image src={backImage} alt="Panel izquierdo" fill className="object-cover opacity-70" />
              )}
              {/* Sombra interna para efecto pliegue */}
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* 4. SOLAPA DERECHA - Z-INDEX 20 */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1/2"
            animate={
              openingStage === 'sides' || openingStage === 'open'
                ? { rotateY: 110, x: 15, scale: 1.02 } // Abre hacia afuera
                : { rotateY: 0, x: 0, scale: 1 }
            }
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            style={{ 
              transformStyle: 'preserve-3d', 
              transformOrigin: 'right center', 
              zIndex: 20 
            }}
          >
            <div 
              className="absolute inset-0 bg-white rounded-r-lg shadow-[-5px_0_15px_rgba(0,0,0,0.1)] border-l border-black/5 overflow-hidden"
              style={{ background: primaryColor }}
            >
              {backImage && (
                <Image src={backImage} alt="Panel derecho" fill className="object-cover opacity-70" />
              )}
              {/* Sombra interna para efecto pliegue */}
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* 5. SOLAPA SUPERIOR TRIANGULAR (Al estilo carta) - Z-INDEX 30 */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            animate={
              openingStage === 'flap' || openingStage === 'sides' || openingStage === 'open'
                ? { rotateX: -160, y: -20, scale: 1.03 } // Abre hacia arriba y atrás
                : { rotateX: 0, y: 0, scale: 1 }
            }
            transition={{
              rotateX: { duration: 1.4, ease: 'easeInOut' },
              y: { duration: 1.4, ease: 'easeInOut' },
              scale: { duration: 1.4, ease: 'easeInOut' }
            }}
            style={{ 
              transformStyle: 'preserve-3d', 
              transformOrigin: 'top center', 
              zIndex: 30,
            }}
            onClick={handleClick}
          >
            {/* Cara externa de la solapa triangular */}
            <div
              className="absolute inset-0 bg-white shadow-[0_6px_15px_rgba(0,0,0,0.2)] overflow-hidden cursor-pointer"
              style={{ 
                backfaceVisibility: 'hidden',
                background: primaryColor,
                // Efecto triangular usando clip-path
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                border: '1px solid rgba(255,255,255,0.03)'
              }}
            >
              {flapImage ? (
                <Image 
                  src={flapImage} 
                  alt="Solapa superior" 
                  fill 
                  className="object-cover opacity-70" 
                  priority 
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 to-blue-500/30" />
              )}

              {/* Sello de XV años - Rediseñado para Bosque Encantado */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={
                    openingStage !== 'closed'
                      ? { scale: 0.5, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, #d2a138)`,
                    borderColor: primaryColor,
                    transform: 'translateY(-20px)' // Ajuste por la forma triangular
                  }}
                  className="w-16 h-16 rounded-full border-4 shadow-xl flex items-center justify-center"
                >
                  <span 
                    className="text-2xl font-serif font-bold"
                    style={{ color: primaryColor }}
                  >
                    XV
                  </span>
                </motion.div>
              </div>
              
              {/* Sombra interna para efecto de pliegue */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            </div>

            {/* Parte interna de la solapa triangular */}
            <div
              className="absolute inset-0 shadow-xl"
              style={{ 
                backfaceVisibility: 'hidden', 
                transform: 'rotateX(180deg)',
                background: backgroundColor, // Fondo oscuro interior
                // El mismo clip-path invertido
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              }}
            >
              {flapImage && (
                <Image src={flapImage} alt="Interior solapa" fill className="object-cover opacity-20" />
              )}
              {/* Degradado interno */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  background: `radial-gradient(circle at center, rgba(255,255,255,0.1), transparent)`
                }}
              />
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
              className="text-center mt-14"
            >
              <motion.p
                animate={{ y: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-lg mb-8 font-light"
                style={{ color: '#a0b0a0' }} // Verde suave
              >
                Te espera un mensaje muy especial...
              </motion.p>

              <button
                onClick={handleClick}
                style={{ 
                  background: `linear-gradient(135deg, ${accentColor}, #d2a138)`,
                  color: primaryColor,
                }}
                className="px-10 py-4 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 tracking-wide text-lg"
              >
                Abrir Sobre
              </button>

              <p 
                className="text-xs mt-8 uppercase tracking-widest opacity-60"
                style={{ color: '#a0b0a0' }}
              >
                Toca o haz clic para revelar el misterio
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}