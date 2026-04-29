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

  // LOGICA DINÁMICA DE APERTURA SUPERPUESTA
  const handleClick = () => {
    if (openingStage === 'closed' && !isAnimating) {
      setIsAnimating(true);
      
      // 1. Fase 1: Se abre la solapa triangular (Rápido y Snappy)
      setOpeningStage('flap');

      // 2. Fase 2: Sincronización superpuesta. Las solapas laterales comienzan
      // ANTES de que la solapa superior termine. (600ms de solapamiento)
      setTimeout(() => {
        setOpeningStage('sides');
        
        // 3. Fase 3: La hoja de invitación empieza a subir JUSTO cuando las
        // solapas laterales están a mitad de camino. (400ms de solapamiento)
        setTimeout(() => {
          setOpeningStage('open');
          
          // 4. Fase 4: Transición a la página principal después del rebote elástico.
          setTimeout(() => {
            onOpen();
          }, 1800); // Tiempo suficiente para el ascenso y rebote
        }, 400); // COMPRIMIDO: La invitación sube mucho más rápido
      }, 900); // COMPRIMIDO: Las solapas laterales abren antes
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
      {/* CAPA DE MAGIA DINÁMICA: Aumentamos la cuenta y sincronizamos con el estado Sides */}
      <MagicalSparkles 
        isActive={openingStage !== 'closed'} 
        color={openingStage === 'sides' || openingStage === 'open' ? '#d4af37' : accentColor} // Oro más brillante al abrirse totalmente
        count={openingStage === 'sides' || openingStage === 'open' ? 90 : 40} // Ráfaga al abrirse
      />
      
      <div className="w-full max-w-2xl">
        {/* Contenedor 3D del Sobre con perspectiva */}
        <div
          className="relative mx-auto"
          style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '16/11',
            perspective: '1800px', // Aumentamos la perspectiva para un efecto 3D más dramático
          }}
        >
          {/* 1. FONDO DEL SOBRE (Capa más profunda) - Z-INDEX 0 */}
          <motion.div
            className="absolute inset-0"
            animate={{
              // Ligera inclinación hacia atrás cuando el sobre se abre del todo para mostrar el interior
              rotateX: openingStage === 'sides' || openingStage === 'open' ? 12 : 0,
            }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }} // Ease elástico
            style={{ transformStyle: 'preserve-3d', zIndex: 0 }}
          >
            <div 
              className="absolute inset-0 bg-white rounded-lg shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden border border-white/5"
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
                  className="text-xs tracking-[0.3em] uppercase mb-5 opacity-80"
                  style={{ color: '#a0b0a0' }} // Verde suave
                >
                  Una Invitación para:
                </p>
                <EditableWrapper isEnabled={false}> {/* Nombre no editable en esta vista */}
                  <h2 
                    className="text-4xl md:text-5xl font-serif font-bold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    style={{ color: accentColor }} // Oro viejo
                  >
                    {guestName}
                  </h2>
                </EditableWrapper>
              </div>

              {/* Decoraciones de las esquinas en latón */}
              <div 
                className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 opacity-50 z-10" 
                style={{ borderColor: accentColor }}
              />
              <div 
                className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 opacity-50 z-10" 
                style={{ borderColor: accentColor }}
              />
              
              {/* Sombra interna para dar profundidad */}
              <div className="absolute inset-0 bg-black/15 z-0 pointer-events-none" />
            </div>
          </motion.div>

          {/* 2. LA HOJA DE PAPEL / INVITACIÓN (Oculta dentro) - Z-INDEX 10 */}
          <motion.div
            className="absolute inset-x-5 top-12 bottom-6 bg-white rounded shadow-inner flex flex-col items-center justify-center border border-gray-100 p-6 md:p-10"
            style={{ 
              zIndex: 10,
              background: '#fcfcf0', // Color papel antiguo suave
              boxShadow: 'inset 0 0 25px rgba(0,0,0,0.06)'
            }}
            animate={{
              // ASCENSO DINÁMICO: Sube y tiene un micro-rebote al final
              y: openingStage === 'open' ? [0, -68, -58, -60] : 0, 
              rotateX: openingStage === 'sides' || openingStage === 'open' ? 12 : 0,
            }}
            transition={{ 
              y: { duration: 1.1, ease: [0.34, 1.36, 0.64, 1], delay: 0.1 }, // Curva de rebote elástico
              rotateX: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: openingStage === 'open' ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-center w-full"
            >
              {/* Título de bienvenida con oro viejo */}
              <p 
                className="text-3xl md:text-4xl font-serif font-bold mb-8 tracking-tight"
                style={{ color: accentColor }}
              >
                ¡Te doy la Bienvenida!
              </p>
              
              {/* Texto de invitación principal en verde musgo profundo */}
              <div 
                className="text-base md:text-xl font-light leading-relaxed max-w-sm mx-auto"
                style={{ color: '#2a4a2a' }}
              >
                <p>Eres una parte muy especial de mi vida.</p>
                <p>Me haría muy feliz que nos acompañaras en este día mágico.</p>
              </div>

              {/* Detalle decorativo central */}
              <div className="flex items-center justify-center gap-4 my-10 opacity-60">
                <div className="h-px w-20" style={{ background: accentColor }} />
                <div className="w-2 h-2 rotate-45" style={{ background: accentColor }} /> {/* Cuadrado rotado */}
                <div className="h-px w-20" style={{ background: accentColor }} />
              </div>

              <p 
                className="text-sm md:text-base uppercase tracking-[0.4em] font-medium"
                style={{ color: accentColor }}
              >
                Mis XV Años
              </p>
            </motion.div>
          </motion.div>

          {/* 3. SOLAPA IZQUIERDA - Z-INDEX 20 */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1/2"
            animate={
              openingStage === 'sides' || openingStage === 'open'
                ? { rotateY: -115, x: -18, scaleY: 1.03 } // Abre hacia afuera, micro-rebote
                : { rotateY: 0, x: 0, scaleY: 1 }
            }
            transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }} // Ease expoOut
            style={{ 
              transformStyle: 'preserve-3d', 
              transformOrigin: 'left center', 
              zIndex: 20 
            }}
          >
            <div 
              className="absolute inset-0 bg-white rounded-l-lg shadow-[5px_0_20px_rgba(0,0,0,0.15)] border-r border-black/5 overflow-hidden"
              style={{ background: primaryColor }}
            >
              {backImage && (
                <Image src={backImage} alt="Panel izquierdo" fill className="object-cover opacity-70" />
              )}
              {/* Sombra interna para efecto pliegue */}
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* 4. SOLAPA DERECHA - Z-INDEX 20 */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1/2"
            animate={
              openingStage === 'sides' || openingStage === 'open'
                ? { rotateY: 115, x: 18, scaleY: 1.03 } // Abre hacia afuera, micro-rebote
                : { rotateY: 0, x: 0, scaleY: 1 }
            }
            transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }} // Ease expoOut
            style={{ 
              transformStyle: 'preserve-3d', 
              transformOrigin: 'right center', 
              zIndex: 20 
            }}
          >
            <div 
              className="absolute inset-0 bg-white rounded-r-lg shadow-[-5px_0_20px_rgba(0,0,0,0.15)] border-l border-black/5 overflow-hidden"
              style={{ background: primaryColor }}
            >
              {backImage && (
                <Image src={backImage} alt="Panel derecho" fill className="object-cover opacity-70" />
              )}
              {/* Sombra interna para efecto pliegue */}
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* 5. SOLAPA SUPERIOR TRIANGULAR - Z-INDEX 30 */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            animate={
              openingStage === 'flap' || openingStage === 'sides' || openingStage === 'open'
                ? { rotateX: -168, y: -25, scale: 1.04 } // Abre hacia arriba y atrás de forma elástica
                : { rotateX: 0, y: 0, scale: 1 }
            }
            transition={{
              rotateX: { duration: 1.6, ease: [0.34, 1.56, 0.64, 1] }, // Ease backInOut
              y: { duration: 1.6, ease: [0.34, 1.56, 0.64, 1] },
              scale: { duration: 1.6, ease: [0.34, 1.56, 0.64, 1] }
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
              className="absolute inset-0 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] overflow-hidden cursor-pointer"
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

              {/* Sello de XV años - */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={
                    openingStage !== 'closed'
                      ? { scale: 0.5, opacity: 0, rotate: -20 } // Desaparece rápido al abrirse
                      : { scale: 1, opacity: 1, rotate: 0 }
                  }
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, #d2a138)`,
                    borderColor: primaryColor,
                    transform: 'translateY(-20px)' 
                  }}
                  className="w-18 h-18 rounded-full border-4 shadow-xl flex items-center justify-center"
                >
                  <span 
                    className="text-3xl font-serif font-bold"
                    style={{ color: primaryColor }}
                  >
                    XV
                  </span>
                </motion.div>
              </div>
              
              {/* Sombra interna para efecto de pliegue */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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

        {/* Texto y botón de "Abrir Sobre" - Dinámico */}
        <AnimatePresence>
          {openingStage === 'closed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }} // Escala hacia abajo al desaparecer
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center mt-16" // Más margen
            >
              <motion.p
                animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
                className="px-12 py-5 font-bold rounded-lg shadow-xl hover:shadow-[0_0_30px_5px_rgba(184,134,11,0.4)] transition-all duration-300 tracking-wide text-lg"
              >
                Abrir Sobre
              </button>

              <p 
                className="text-xs mt-10 uppercase tracking-widest opacity-60 font-medium"
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