'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

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
      {/* Contenedor de la Imagen de Fondo */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative h-full w-full"
          >
            <Image
              src={heroImage}
              // FIX: Fallback para evitar el error de consola si el nombre no ha cargado
              alt={quinceaneraName ? `Foto de portada de ${quinceaneraName}` : 'Foto principal de la Quinceañera'}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Overlay Gradiente para mejorar legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-white/90" />
          </motion.div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-white" />
        )}
      </div>

      {/* Contenido de Texto */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-blue-900 mb-6 drop-shadow-sm">
            Mis 15 Años
          </h1>
          
          <div className="space-y-2">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-3xl md:text-5xl text-blue-800 font-light tracking-wide uppercase"
            >
              {quinceaneraName || "Cargando..."}
            </motion.p>

            {parentNames && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="text-lg md:text-2xl text-blue-700 font-serif italic mt-4"
              >
                Con la bendición de mis padres: <br />
                <span className="font-semibold not-italic">{parentNames}</span>
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Indicador de scroll animado */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-blue-900/30 rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-blue-900 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}