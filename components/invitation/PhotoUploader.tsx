'use client';

import { useState, useEffect } from 'react';
// Asegúrate de que importas la nueva función saveGuestPhotoUrl de tu archivo supabase.ts
import { saveGuestPhotoUrl } from '@/lib/firebase';

export function PhotoUploader({ invitationId, guestName, accentColor, hideQR = false }: any) {
  const [uploading, setUploading] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Solo generamos el QR si NO estamos en la vista de la cámara (hideQR es false)
    if (!hideQR) {
      const baseUrl = window.location.origin;
      const cameraUrl = `${baseUrl}/camara`;
      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(cameraUrl)}&color=08110b&bgcolor=fdfcf0`;
      setQrUrl(qrApi);
    }
  }, [hideQR]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    let successCount = 0;
    const files = Array.from(e.target.files);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Faltan las credenciales de Cloudinary en el archivo .env.local");
      setUploading(false);
      return;
    }

    try {
      for (const file of files) {
        // 1. Preparar el archivo para Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        // 2. Enviar directamente a Cloudinary (usamos 'auto' para aceptar tanto imágenes como videos cortos)
        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!cloudinaryRes.ok) throw new Error('Fallo al subir el archivo a Cloudinary');
        
        const cloudinaryData = await cloudinaryRes.json();
        const secureUrl = cloudinaryData.secure_url;

        // 3. Guardar SOLO el enlace resultante en nuestra Base de Datos (Supabase)
        const savedToDB = await saveGuestPhotoUrl(invitationId, guestName, secureUrl);
        
        if (savedToDB) successCount++;
      }

      if (successCount > 0) {
        alert(`¡${successCount} recuerdo(s) guardado(s)! Los revisaremos y aparecerán pronto.`);
      } else {
        alert("Hubo un problema al guardar las fotos en la base de datos.");
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      alert("Hubo un problema de conexión al subir las fotos.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* --- VISTA CÁMARA (hideQR = true): SOLO MOSTRAMOS EL BOTÓN DE SUBIR --- */}
      {hideQR ? (
        <div className="flex flex-col items-center gap-3 md:gap-6 w-full max-w-xs md:max-w-sm">
          <label 
            className={`w-full py-3.5 md:py-5 rounded-full font-bold text-sm md:text-base text-center cursor-pointer transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)] ${uploading ? 'opacity-50 animate-pulse' : ''}`}
            style={{ backgroundColor: accentColor, color: '#121912' }}
          >
            {uploading ? 'SUBIENDO...' : 'SELECCIONAR FOTOS'}
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-50">Máximo 10 archivos a la vez</p>
        </div>
      ) : (
        /* --- VISTA INVITACIÓN PRINCIPAL: MOSTRAMOS QR Y BOTÓN SEPARADOS --- */
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 w-full px-4">
          
          {/* Lado del QR */}
          <div className="flex flex-col items-center gap-2 md:gap-4 flex-shrink-0">
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-80 text-center max-w-[120px] md:max-w-[150px]" style={{ color: accentColor }}>
              Escanea con tu celular
            </p>
            <div className="p-2 md:p-3 bg-[#fdfcf0] rounded-xl md:rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.15)] flex-shrink-0">
              {qrUrl ? (
                <img src={qrUrl} alt="QR para abrir cámara" className="w-20 h-20 md:w-32 md:h-32 rounded-lg object-contain" />
              ) : (
                <div className="w-20 h-20 md:w-32 md:h-32 bg-black/10 rounded-lg animate-pulse" />
              )}
            </div>
          </div>

          {/* Divisor "O" */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 opacity-30 flex-shrink-0">
            <div className="w-12 h-[1px] md:w-[1px] md:h-20" style={{ background: accentColor }} />
            <span className="text-[10px] uppercase tracking-widest italic" style={{ color: accentColor }}>O</span>
            <div className="w-12 h-[1px] md:w-[1px] md:h-20" style={{ background: accentColor }} />
          </div>

          {/* Lado del Botón */}
          <div className="flex flex-col items-center gap-3 md:gap-5 flex-shrink-0">
            <label 
              className={`px-6 py-3.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base cursor-pointer transition-all transform hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] shadow-lg ${uploading ? 'opacity-50 animate-pulse' : ''}`}
              style={{ backgroundColor: accentColor, color: '#121912' }}
            >
              {uploading ? 'SUBIENDO...' : 'SUBIR DESDE AQUÍ'}
              <input 
                type="file" 
                multiple 
                accept="image/*,video/*" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-50">Máximo 10 archivos a la vez</p>
          </div>

        </div>
      )}
    </div>
  );
}