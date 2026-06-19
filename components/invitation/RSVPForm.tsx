'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRSVPResponse, createGuestMessage } from '@/lib/firebase';
import { User, MessageSquare, Check, AlertCircle, Loader2 } from 'lucide-react';

interface RSVPFormProps {
  invitationId: string;
}

export function RSVPForm({ invitationId }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Por favor, dinos tu nombre para registrarte.');
      setLoading(false);
      return;
    }

    try {
      const rsvpId = await createRSVPResponse({
        invitationId: invitationId,
        guestName: formData.name.trim(),
        guestEmail: '',
        guestPhone: '',
        attending: true,
        numberOfGuests: 1,
        dietaryRestrictions: '',
        additionalNotes: formData.message.trim()
      });

      if (!rsvpId) throw new Error('Error al crear el RSVP');

      if (formData.message.trim()) {
        await createGuestMessage({
          invitationId: invitationId,
          guestName: formData.name.trim(),
          guestEmail: '',
          message: formData.message.trim(),
          approved: false
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('No logramos conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 relative z-10 font-sans">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12 px-8 bg-gradient-to-b from-emerald-950/30 to-black/40 border border-emerald-500/30 rounded-[2.5rem] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-serif text-white tracking-wide mt-2">¡Asistencia Confirmada!</h3>
            <p className="text-sm text-[#a0b0a0]/80 leading-relaxed max-w-xs">
              Tu lugar ha sido reservado de forma segura. Gracias por acompañarnos en esta noche mágica.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="relative space-y-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6),_inset_0_1px_2px_rgba(255,255,255,0.05)] backdrop-blur-xl overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent" />

            <div className="text-center space-y-2">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#b8860b] font-semibold block">
                Confirmación de Asistencia
              </span>
              <h3 className="text-3xl font-serif text-[#ffd700] tracking-wide drop-shadow-md">
                ¿Nos Acompañas?
              </h3>
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#b8860b] to-transparent mx-auto mt-2" />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-2 text-xs text-red-300"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#a0b0a0] uppercase tracking-widest pl-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#b8860b]" /> Nombre Completo <span className="text-[#ffd700]">*</span>
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Familia Martínez o Tu Nombre"
                required
                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-full text-white placeholder:text-[#a0b0a0]/30 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50 transition-all duration-300 shadow-inner text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#a0b0a0] uppercase tracking-widest pl-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#b8860b]" /> Mensaje o Felicitación
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Déjale tus buenos deseos a la quinceañera aquí..."
                rows={3}
                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-[1.5rem] text-white placeholder:text-[#a0b0a0]/30 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50 transition-all duration-300 shadow-inner text-sm resize-none font-medium leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] text-[#090d09] font-extrabold py-4.5 px-6 rounded-full uppercase tracking-[0.2em] text-xs shadow-[0_4px_30px_rgba(255,215,0,0.2)] hover:shadow-[0_4px_40px_rgba(255,215,0,0.4)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group-hover:brightness-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#090d09]" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <span>Confirmar Asistencia</span>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}