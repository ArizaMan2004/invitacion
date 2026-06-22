'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
// Guarda en Firestore la URL ya alojada en Cloudinary
import { saveGuestPhotoUrl } from '@/lib/firebase';

// --- Configuración (centralizada para fácil ajuste) ---
const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 50; // límite por archivo (vídeos cortos incluidos)
const ACCEPTED_TYPES = ['image/', 'video/'];

interface PhotoUploaderProps {
  invitationId: string;
  guestName: string;
  accentColor: string;
  /** true = vista cámara (solo botón). false = vista invitación (QR + botón) */
  hideQR?: boolean;
}

type UploadStatus = 'idle' | 'uploading' | 'done';

export function PhotoUploader({
  invitationId,
  guestName,
  accentColor,
  hideQR = false,
}: PhotoUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [feedback, setFeedback] = useState<string>('');
  const [qrUrl, setQrUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploading = status === 'uploading';

  // Generamos el QR solo en la vista principal (no en la cámara)
  useEffect(() => {
    if (hideQR || typeof window === 'undefined') return;
    // Incluimos el id de la invitación para que las fotos desde el celular
    // NO se guarden con invitation_id vacío.
    const idParam = invitationId ? `?id=${encodeURIComponent(invitationId)}` : '';
    const cameraUrl = `${window.location.origin}/camara${idParam}`;
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      cameraUrl
    )}&color=08110b&bgcolor=fdfcf0`;
    setQrUrl(qrApi);
  }, [hideQR, invitationId]);

  // Sube un único archivo a Cloudinary y devuelve la URL segura, o null si falla
  const uploadOne = useCallback(
    async (file: File, cloudName: string, uploadPreset: string): Promise<string | null> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) return null;

        const data = (await res.json()) as { secure_url?: string };
        return data.secure_url ?? null;
      } catch {
        return null;
      }
    },
    []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setFeedback('Configuración incompleta. Inténtalo más tarde.');
      console.error('Faltan credenciales de Cloudinary (NEXT_PUBLIC_CLOUDINARY_*)');
      return;
    }

    // --- Validación en cliente (tipo, tamaño y cantidad) ---
    let files = Array.from(fileList);

    const validType = (f: File) => ACCEPTED_TYPES.some((t) => f.type.startsWith(t));
    const validSize = (f: File) => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

    const rejectedType = files.filter((f) => !validType(f)).length;
    const rejectedSize = files.filter((f) => validType(f) && !validSize(f)).length;
    files = files.filter((f) => validType(f) && validSize(f));

    if (files.length > MAX_FILES) {
      setFeedback(`Solo se permiten ${MAX_FILES} archivos a la vez. Se tomarán los primeros ${MAX_FILES}.`);
      files = files.slice(0, MAX_FILES);
    } else if (rejectedType || rejectedSize) {
      const parts: string[] = [];
      if (rejectedType) parts.push(`${rejectedType} no compatibles`);
      if (rejectedSize) parts.push(`${rejectedSize} superan ${MAX_FILE_SIZE_MB}MB`);
      setFeedback(`Se omitieron algunos archivos (${parts.join(', ')}).`);
    } else {
      setFeedback('');
    }

    if (files.length === 0) {
      setFeedback('Ningún archivo válido para subir.');
      // Permite volver a elegir los mismos archivos
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    // --- Subida secuencial con tolerancia a fallos por archivo ---
    setStatus('uploading');
    setProgress({ current: 0, total: files.length });

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      setProgress({ current: i + 1, total: files.length });
      const secureUrl = await uploadOne(files[i], cloudName, uploadPreset);
      if (secureUrl) {
        try {
          const saved = await saveGuestPhotoUrl(invitationId, guestName, secureUrl);
          if (saved) successCount++;
        } catch (err) {
          console.error('No se pudo guardar la URL en Firestore:', err);
        }
      }
    }

    setStatus('done');
    if (successCount === files.length) {
      setFeedback(`¡${successCount} recuerdo(s) guardado(s)! Aparecerán tras la revisión.`);
    } else if (successCount > 0) {
      setFeedback(`Se guardaron ${successCount} de ${files.length}. Reintenta los restantes si quieres.`);
    } else {
      setFeedback('Hubo un problema de conexión. Inténtalo de nuevo.');
    }

    // Reset para poder volver a seleccionar
    if (inputRef.current) inputRef.current.value = '';
    setTimeout(() => setStatus('idle'), 400);
  };

  const buttonLabel = uploading
    ? `SUBIENDO ${progress.current}/${progress.total}…`
    : hideQR
    ? 'SELECCIONAR FOTOS'
    : 'SUBIR DESDE AQUÍ';

  const FileInput = (
    <input
      ref={inputRef}
      type="file"
      multiple
      accept="image/*,video/*"
      className="hidden"
      onChange={handleFileChange}
      disabled={uploading}
      aria-label="Seleccionar fotos o vídeos para subir"
    />
  );

  const Helper = (
    <p
      className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-60 text-center"
      role={feedback ? 'status' : undefined}
      aria-live="polite"
    >
      {feedback || `Máximo ${MAX_FILES} archivos · hasta ${MAX_FILE_SIZE_MB}MB c/u`}
    </p>
  );

  return (
    <div className="flex flex-col items-center w-full">
      {hideQR ? (
        /* --- VISTA CÁMARA: solo botón --- */
        <div className="flex flex-col items-center gap-3 md:gap-6 w-full max-w-xs md:max-w-sm">
          <label
            className={`w-full py-3.5 md:py-5 rounded-full font-bold text-sm md:text-base text-center cursor-pointer transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)] ${
              uploading ? 'opacity-50 animate-pulse cursor-wait' : ''
            }`}
            style={{ backgroundColor: accentColor, color: '#121912' }}
          >
            {buttonLabel}
            {FileInput}
          </label>
          {Helper}
        </div>
      ) : (
        /* --- VISTA INVITACIÓN: QR + botón --- */
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 w-full px-4">
          {/* QR */}
          <div className="flex flex-col items-center gap-2 md:gap-4 flex-shrink-0">
            <p
              className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-80 text-center max-w-[120px] md:max-w-[150px]"
              style={{ color: accentColor }}
            >
              Escanea con tu celular
            </p>
            <div className="p-2 md:p-3 bg-[#fdfcf0] rounded-xl md:rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.15)] flex-shrink-0">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="Código QR para abrir la cámara y subir fotos"
                  className="w-20 h-20 md:w-32 md:h-32 rounded-lg object-contain"
                />
              ) : (
                <div className="w-20 h-20 md:w-32 md:h-32 bg-black/10 rounded-lg animate-pulse" />
              )}
            </div>
          </div>

          {/* Divisor "O" */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 opacity-30 flex-shrink-0" aria-hidden="true">
            <div className="w-12 h-[1px] md:w-[1px] md:h-20" style={{ background: accentColor }} />
            <span className="text-[10px] uppercase tracking-widest italic" style={{ color: accentColor }}>O</span>
            <div className="w-12 h-[1px] md:w-[1px] md:h-20" style={{ background: accentColor }} />
          </div>

          {/* Botón */}
          <div className="flex flex-col items-center gap-3 md:gap-5 flex-shrink-0">
            <label
              className={`px-6 py-3.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base cursor-pointer transition-all transform hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] shadow-lg ${
                uploading ? 'opacity-50 animate-pulse cursor-wait' : ''
              }`}
              style={{ backgroundColor: accentColor, color: '#121912' }}
            >
              {buttonLabel}
              {FileInput}
            </label>
            {Helper}
          </div>
        </div>
      )}
    </div>
  );
}
