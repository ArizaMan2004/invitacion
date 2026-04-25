'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
// Asegúrate de que la ruta coincida con donde guardaste el archivo de las chispas
import { MagicSparks } from './MagicSparks'; 

interface HeroSectionProps {
  quinceaneraName: string;
  parentNames?: string;
  heroImage: string;
}

export function HeroSection({
  quinceaneraName,
  parentNames,
  heroImage,
}: HeroSectionProps) {
  return (
    <section className="relative h-[85vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-blue-50">
      
      {/* 1. Contenedor de la Imagen de Fondo */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative h-full w-full"
          >
            <Image
              src={heroImage}
              alt={quinceaneraName ? `Foto de portada de ${quinceaneraName}` : 'Foto principal de la Quinceañera'}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Overlay Gradiente ajustado sutilmente para dar profundidad */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-white/20 to-white/95" />
          </motion.div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-white" />
        )}
      </div>

      {/* 2. 🌟 Las Chispas Mágicas 🌟 */}
      <MagicSparks />

      {/* 3. Contenido de Texto Animado */}
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-blue-900 mb-6 drop-shadow-md">
            Mis 15 Años
          </h1>
          
          <div className="space-y-4">
            <motion.p 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
              className="text-4xl md:text-6xl text-blue-800 font-light tracking-[0.2em] uppercase drop-shadow-sm"
            >
              {quinceaneraName || "Cargando..."}
            </motion.p>

            {parentNames && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1.5 }}
                className="text-lg md:text-2xl text-blue-700/80 font-serif italic mt-6"
              >
                Con la bendición de mis padres: <br />
                <span className="font-semibold text-blue-900 not-italic text-xl md:text-2xl tracking-wide block mt-2">
                  {parentNames}
                </span>
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* 4. Indicador de scroll animado */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute -bottom-12 md:bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-blue-900/40 rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-blue-900 rounded-full shadow-[0_0_5px_rgba(30,58,138,0.5)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}