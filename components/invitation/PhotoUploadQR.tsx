'use client';

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react'; // Necesitarás instalar: npm install qrcode.react

interface PhotoUploadQRProps {
  uploadUrl: string; // El link de tu Google Form o carpeta
  accentColor: string;
}

export function PhotoUploadQR({ uploadUrl, accentColor }: PhotoUploadQRProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="py-24 px-6 text-center"
    >
      <div 
        className="max-w-2xl mx-auto p-12 rounded-[3rem] bg-black/30 backdrop-blur-xl border-2 relative overflow-hidden"
        style={{ borderColor: `${accentColor}40` }}
      >
        {/* Adorno de esquina */}
        <div className="absolute top-0 right-0 p-4 opacity-20">
           <svg width="100" height="100" viewBox="0 0 100 100">
             <path d="M100 0 L100 100 L0 100" fill="none" stroke={accentColor} strokeWidth="2" />
           </svg>
        </div>

        <h2 className="text-3xl font-serif mb-6" style={{ color: accentColor }}>
          ¡Comparte tu mirada!
        </h2>
        <p className="text-[#fcfcf0]/80 mb-10 font-light text-lg">
          Escanea el código para subir las fotos y videos que tomes durante la noche.
        </p>

        {/* Contenedor del QR con estilo de lujo */}
        <div className="relative inline-block p-6 bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)]">
          <QRCodeSVG 
            value={uploadUrl} 
            size={180}
            fgColor="#121912" // Color del QR oscuro para que destaque en el blanco
            level="H" // Alta recuperación de errores
            includeMargin={false}
          />
          {/* Logo pequeño en el centro opcional */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-1 rounded-full">
               <div className="w-8 h-8 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <a 
            href={uploadUrl} 
            target="_blank" 
            className="text-sm tracking-[0.3em] uppercase underline underline-offset-8 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: accentColor }}
          >
            O haz clic aquí para subir
          </a>
        </div>
      </div>
    </motion.section>
  );
}