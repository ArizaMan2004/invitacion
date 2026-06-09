'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase'; // Asegúrate de que esta ruta es correcta en tu proyecto

interface RSVPFormProps {
  invitationId: string;
}

// Estilos comunes para los inputs oscuros (Ajustados con responsividad)
const inputStyles = "w-full p-3 md:p-4 text-sm md:text-base bg-black/30 border border-white/10 rounded-xl md:rounded-2xl text-[#fcfcf0] placeholder:text-[#a0b0a0]/50 focus:outline-none focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b] transition-all";

export function RSVPForm({ invitationId }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Por favor, ingresa tu nombre.');
      setLoading(false);
      return;
    }

    try {
      // 1. Guardar la confirmación de asistencia en Supabase
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvp_responses')
        .insert({
          invitation_id: invitationId,
          guest_name: formData.name,
          attending: true, // Asumimos que asiste si llena el formulario
          numberOfGuests: 1, // Valor por defecto
        })
        .select('id')
        .single();

      if (rsvpError) throw rsvpError;

      // 2. Guardar el mensaje (solo si escribieron algo)
      if (formData.message.trim()) {
        const { error: msgError } = await supabase
          .from('guest_messages')
          .insert({
            invitation_id: invitationId,
            guest_name: formData.name,
            message: formData.message,
            approved: false, // Requiere moderación
          });
          
        if (msgError) console.error("Error guardando mensaje:", msgError);
      }

      setSubmitted(true);

    } catch (err) {
      setError('Hubo un problema al guardar tu respuesta. Por favor, inténtalo de nuevo.');
      console.error('RSVP Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 sm:px-0 relative z-10">
      <AnimatePresence mode="wait">
        {submitted ? (
          // ESTADO: CONFIRMACIÓN EXITOSA
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 px-5 md:py-10 md:px-6 bg-green-950/20 border border-green-500/20 rounded-2xl md:rounded-3xl backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-14 h-14 md:w-16 md:h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
            <p className="text-xl md:text-2xl font-serif text-[#fcfcf0] mb-2 md:mb-3">
              ¡Confirmación enviada!
            </p>
            <p className="text-sm md:text-base text-[#a0b0a0] font-light leading-relaxed">
              Gracias por acompañarnos en este día tan especial. Tu mensaje ha sido recibido.
            </p>
          </motion.div>
        ) : (
          // ESTADO: FORMULARIO ACTIVO
          <motion.form 
            key="form"
            onSubmit={handleSubmit} 
            className="space-y-4 md:space-y-6 bg-white/[0.02] p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-md"
          >
            <div className="text-center mb-6 md:mb-10">
                <h3 className="text-xs md:text-sm font-sans uppercase text-[#b8860b] tracking-[0.3em] md:tracking-[0.4em] mb-2 md:mb-3 opacity-80">
                    RSVP
                </h3>
                <p className="text-2xl md:text-3xl font-serif text-[#fcfcf0]">
                    Confirma tu asistencia
                </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/50 border border-red-500/50 rounded-lg p-3 md:p-4 text-red-200 text-xs md:text-sm font-light text-center"
              >
                {error}
              </motion.div>
            )}

            {/* CAMPO: NOMBRE */}
            <div className="space-y-1.5 md:space-y-2">
              <label htmlFor="name" className="text-[10px] md:text-xs font-medium text-[#a0b0a0] uppercase tracking-widest pl-1 opacity-70">
                Nombre y Apellido *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                required
                className={inputStyles}
              />
            </div>

            {/* CAMPO: MENSAJE */}
            <div className="space-y-1.5 md:space-y-2">
              <label htmlFor="message" className="text-[10px] md:text-xs font-medium text-[#a0b0a0] uppercase tracking-widest pl-1 opacity-70">
                Un mensaje (Opcional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Escribe tus buenos deseos..."
                rows={3}
                className={`${inputStyles} resize-none`}
              />
            </div>

            {/* BOTÓN DORADO */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 bg-[#b8860b] hover:bg-[#a67c0a] text-[#121912] font-sans font-bold text-sm md:text-base uppercase tracking-[0.15em] md:tracking-[0.2em] py-3.5 md:py-5 rounded-full transition-all shadow-lg shadow-[#b8860b]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Confirmar Asistencia'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}