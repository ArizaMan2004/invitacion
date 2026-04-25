'use client';

import { useState } from 'react';
import { uploadGuestPhotos } from '@/lib/supabase';

export function PhotoUploader({ invitationId, guestName, accentColor }: any) {
  const [uploading, setUploading] = useState(false);

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
    <div className="flex flex-col items-center gap-4">
      <label 
        className={`px-8 py-4 rounded-full font-bold cursor-pointer transition-all transform hover:scale-105 shadow-lg ${uploading ? 'opacity-50 animate-pulse' : ''}`}
        style={{ backgroundColor: accentColor, color: '#121912' }}
      >
        {uploading ? 'SUBIENDO...' : 'SUBIR FOTOS Y VIDEOS'}
        <input 
          type="file" 
          multiple 
          accept="image/*,video/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      <p className="text-[10px] uppercase tracking-widest opacity-40">Máximo 10 archivos a la vez</p>
    </div>
  );
}