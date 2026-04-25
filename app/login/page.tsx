'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginAdmin, getAdminSession } from '@/lib/supabase';
import { MagicSparks } from '@/components/invitation/MagicSparks';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si ya hay una sesión activa para redirigir directamente
  useEffect(() => {
    const checkSession = async () => {
      const session = await getAdminSession();
      if (session) {
        router.push('/admin');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userId = await loginAdmin(email, password);
      if (userId) {
        router.push('/admin');
      } else {
        setError('Las credenciales no coinciden con nuestros registros.');
      }
    } catch (err) {
      setError('Ocurrió un error técnico. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#121912] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Fondo Místico */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(42,74,42,0.4),_transparent_70%)]" />
        <MagicSparks />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-[#1a241a]/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#b8860b]/10 border border-[#b8860b]/20 mb-6"
            >
              <ShieldCheck className="w-8 h-8 text-[#b8860b]" />
            </motion.div>
            <h1 className="text-3xl font-serif text-[#fcfcf0] mb-2">Panel de Control</h1>
            <p className="text-[#a0b0a0] text-xs uppercase tracking-[0.3em]">Acceso Administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-2xl focus:border-[#b8860b] transition-all"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-2xl focus:border-[#b8860b] transition-all"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-[#b8860b] hover:bg-[#d2a138] text-[#121912] font-bold text-sm tracking-widest transition-all shadow-lg shadow-[#b8860b]/20"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#121912]/30 border-t-[#121912] rounded-full animate-spin" />
                  ENTRANDO...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  INICIAR SESIÓN
                </span>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-[#a0b0a0] uppercase tracking-[0.4em] opacity-40">
              Siskoven Cloud &bull; 2026
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}