'use client';

import { useState, useEffect } from 'react';
import { uploadGuestPhotos } from '@/lib/supabase';

// Exportación nombrada correcta para evitar el error "Export doesn't exist"
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
    const success = await uploadGuestPhotos(invitationId, e.target.files, guestName);
    
    if (success) {
      alert("¡Recuerdos guardados! Los revisaremos y aparecerán pronto.");
    } else {
      alert("Hubo un problema al subir las fotos.");
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* --- VISTA CÁMARA (hideQR = true): SOLO MOSTRAMOS EL BOTÓN DE SUBIR --- */}
      {hideQR ? (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <label 
            className={`w-full py-5 rounded-full font-bold text-center cursor-pointer transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)] ${uploading ? 'opacity-50 animate-pulse' : ''}`}
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
          <p className="text-[10px] uppercase tracking-widest opacity-50">Máximo 10 archivos a la vez</p>
        </div>
      ) : (
        /* --- VISTA INVITACIÓN PRINCIPAL: MOSTRAMOS QR Y BOTÓN SEPARADOS --- */
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 w-full px-4">
          
          {/* Lado del QR */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <p className="text-[10px] uppercase tracking-widest opacity-80 text-center max-w-[150px]" style={{ color: accentColor }}>
              Escanea con tu celular
            </p>
            <div className="p-3 bg-[#fdfcf0] rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.15)] flex-shrink-0">
              {qrUrl ? (
                <img src={qrUrl} alt="QR para abrir cámara" className="w-28 h-28 md:w-32 md:h-32 rounded-lg object-contain" />
              ) : (
                <div className="w-28 h-28 md:w-32 md:h-32 bg-black/10 rounded-lg animate-pulse" />
              )}
            </div>
          </div>

          {/* Divisor "O" */}
          <div className="flex flex-col md:flex-row items-center gap-4 opacity-30 flex-shrink-0">
            <div className="w-16 h-[1px] md:w-[1px] md:h-20" style={{ background: accentColor }} />
            <span className="text-[10px] uppercase tracking-widest italic" style={{ color: accentColor }}>O</span>
            <div className="w-16 h-[1px] md:w-[1px] md:h-20" style={{ background: accentColor }} />
          </div>

          {/* Lado del Botón */}
          <div className="flex flex-col items-center gap-5 flex-shrink-0">
            <label 
              className={`px-8 py-4 rounded-full font-bold cursor-pointer transition-all transform hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] shadow-lg ${uploading ? 'opacity-50 animate-pulse' : ''}`}
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
            <p className="text-[10px] uppercase tracking-widest opacity-50">Máximo 10 archivos a la vez</p>
          </div>

        </div>
      )}
    </div>
  );
}