'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  LogOut, 
  Image as ImageIcon, 
  MessageSquare, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink
} from 'lucide-react';

// Utilidades de Supabase y Tipos
import { 
  supabase, // 🔥 Asegurado para la auto-recuperación
  getAdminSession, 
  clearAdminSession, 
  getRSVPResponses,
  getApprovedGuestPhotos,
  getPendingGuestPhotos,
  approveGuestPhoto,
  getApprovedGuestMessages,
  getPendingGuestMessages,
  approveGuestMessage,
  getInvitation
} from '@/lib/supabase';
import { RSVPResponse, GuestPhoto, GuestMessage, InvitationData } from '@/lib/types';

type TabId = 'dashboard' | 'media' | 'rsvp' | 'messages';

export default function AdvancedAdminEditor() {
  // --- ESTADOS DE AUTENTICACIÓN ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ESTADOS DE DATOS ---
  const [invitationId, setInvitationId] = useState('');
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<GuestPhoto[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [pendingMessages, setPendingMessages] = useState<GuestMessage[]>([]);
  
  // --- ESTADOS DE INTERFAZ ---
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  // Verificación de sesión al cargar
  useEffect(() => {
    const init = async () => {
      const session = await getAdminSession();
      if (session) {
        setIsAuthenticated(true);
        let id = localStorage.getItem('invitationId');
        
        // 🔥 NUEVO: AUTO-RECUPERACIÓN DE INVITATION ID
        // Si el admin entra directo y no hay ID en memoria, traemos el primer evento disponible
        if (!id) {
          const { data, error } = await supabase.from('invitations').select('id').limit(1).maybeSingle();
          if (data?.id) {
            id = data.id;
            localStorage.setItem('invitationId', id);
          } else {
            console.warn("No hay invitaciones creadas en la base de datos.");
          }
        }

        if (id) {
          setInvitationId(id);
          await loadAllData(id);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const loadAllData = async (id: string) => {
    setDataLoading(true);
    try {
      const [inv, rsvpRes, appPhotos, penPhotos, appMsg, penMsg] = await Promise.all([
        getInvitation(id),
        getRSVPResponses(id),
        getApprovedGuestPhotos(id),
        getPendingGuestPhotos(id),
        getApprovedGuestMessages(id),
        getPendingGuestMessages(id)
      ]);
      
      setInvitation(inv);
      setRsvps(rsvpRes || []);
      setPhotos(appPhotos || []);
      setPendingPhotos(penPhotos || []);
      setMessages(appMsg || []);
      setPendingMessages(penMsg || []);
    } catch (error) {
      console.error('Error sincronizando panel:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleApproveMedia = async (id: string) => {
    const success = await approveGuestPhoto(id);
    if (success && invitationId) loadAllData(invitationId);
  };

  const handleApproveMessage = async (id: string) => {
    const success = await approveGuestMessage(id);
    if (success && invitationId) loadAllData(invitationId);
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#121912] text-[#b8860b] font-serif tracking-[0.3em] animate-pulse">AUTENTICANDO SISTEMA...</div>;

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-[#121912] p-4">
      <div className="text-center space-y-6">
        <h2 className="text-[#fcfcf0] text-2xl font-serif">Acceso Restringido</h2>
        <p className="text-[#a0b0a0] text-sm italic">Por favor, inicia sesión desde la página de acceso principal.</p>
        <Button onClick={() => window.location.href = '/login'} className="bg-[#b8860b] text-[#121912] font-bold">VOLVER AL LOGIN</Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#0a0f0a] overflow-hidden font-sans text-[#fcfcf0]">
      
      {/* SIDEBAR DE NAVEGACIÓN */}
      <aside className="w-20 md:w-64 bg-[#121912] border-r border-white/5 flex flex-col z-20 shrink-0">
        <div className="p-6 border-b border-white/5 flex flex-col gap-1">
          <span className="font-serif text-[#b8860b] text-xl hidden md:block">Gestión Elite</span>
          <span className="text-[9px] tracking-[0.2em] text-[#a0b0a0] uppercase">v2.5 Control Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
            { id: 'media', label: 'Álbum y Videos', icon: <ImageIcon className="w-5 h-5" /> },
            { id: 'rsvp', label: 'Asistencias', icon: <Users className="w-5 h-5" /> },
            { id: 'messages', label: 'Mensajes', icon: <MessageSquare className="w-5 h-5" /> },
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id as TabId)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-[#b8860b] text-[#121912] shadow-lg shadow-[#b8860b]/10' : 'text-[#a0b0a0] hover:bg-white/5'}`}
            >
              {tab.icon}
              <span className="hidden md:block font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Button variant="ghost" className="w-full justify-start gap-4 text-red-400 hover:bg-red-400/10" onClick={() => { clearAdminSession(); window.location.reload(); }}>
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block text-sm">Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar relative">
        {dataLoading && <div className="sticky top-0 z-50 h-1 bg-[#b8860b] animate-shimmer" />}

        <header className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#b8860b]">
              {activeTab === 'dashboard' && 'Resumen General'}
              {activeTab === 'media' && 'Galería Colaborativa'}
              {activeTab === 'rsvp' && 'Control de Invitados'}
              {activeTab === 'messages' && 'Muro de Dedicatorias'}
            </h1>
            <p className="text-sm text-[#a0b0a0] mt-1">ID Evento: <span className="font-mono text-xs text-white">{invitationId || 'Buscando...'}</span></p>
          </div>
          <Button onClick={() => loadAllData(invitationId)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs tracking-widest">SINCRONIZAR DATOS</Button>
        </header>

        <div className="px-8 pb-12">
          <AnimatePresence mode="wait">
            
            {/* 📊 TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Confirmados" value={rsvps.filter(r => r.attending).length} subValue={`De ${rsvps.length} totales`} icon={<CheckCircle2 className="text-green-500" />} />
                <StatsCard title="Media Pendiente" value={pendingPhotos.length} subValue="Nuevas fotos/videos" icon={<ImageIcon className="text-amber-500" />} />
                <StatsCard title="Mensajes Nuevos" value={pendingMessages.length} subValue="Por revisar" icon={<MessageSquare className="text-blue-500" />} />
                <StatsCard title="Asistencia %" value={`${Math.round((rsvps.filter(r => r.attending).length / (rsvps.length || 1)) * 100)}%`} subValue="Ratio de éxito" icon={<BarChart3 className="text-purple-500" />} />
              </motion.div>
            )}

            {/* 📸 TAB: MEDIA (Carrusel y Moderación) */}
            {activeTab === 'media' && (
              <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                
                {/* 🔥 NUEVO: Aviso si no hay nada en absoluto */}
                {pendingPhotos.length === 0 && photos.length === 0 && (
                  <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                    <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-[#a0b0a0] font-light">Aún no hay fotos ni videos subidos por los invitados.</p>
                  </div>
                )}

                {pendingPhotos.length > 0 && (
                  <section className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-3xl">
                    <h3 className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2"><Clock className="w-4 h-4" /> Moderación Pendiente</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {pendingPhotos.map(photo => (
                        <div key={photo.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/50">
                          <img src={photo.photoUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={() => handleApproveMedia(photo.id)} className="p-2 bg-green-500 rounded-full text-black hover:scale-110 transition-transform shadow-lg"><CheckCircle2 className="w-5 h-5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {photos.length > 0 && (
                  <section>
                    <h3 className="text-[#a0b0a0] font-bold text-sm uppercase tracking-widest mb-6">Galería Pública (Aprobadas)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {photos.map((photo, index) => (
                        <div 
                          key={photo.id} 
                          onClick={() => setSelectedMediaIndex(index)}
                          className="cursor-pointer aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-[#b8860b]/50 transition-all shadow-xl bg-black/50"
                        >
                          <img src={photo.photoUrl} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {/* 👥 TAB: RSVPs */}
            {activeTab === 'rsvp' && (
              <motion.div key="rsvp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#121912] rounded-[2rem] border border-white/5 overflow-hidden">
                {rsvps.length === 0 ? (
                  <p className="p-12 text-center text-white/50">No hay confirmaciones de asistencia todavía.</p>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-[#a0b0a0]">
                      <tr>
                        <th className="p-6">Invitado</th>
                        <th className="p-6">Estado</th>
                        <th className="p-6">Cupos</th>
                        <th className="p-6">Notas / Dieta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rsvps.map(rsvp => (
                        <tr key={rsvp.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-6 font-medium">{rsvp.guestName}</td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${rsvp.attending ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {rsvp.attending ? 'ASISTIRÁ' : 'NO ASISTIRÁ'}
                            </span>
                          </td>
                          <td className="p-6 opacity-60">{rsvp.numberOfGuests} pax</td>
                          <td className="p-6 text-sm italic opacity-50 max-w-xs truncate">{rsvp.additionalNotes || 'Sin observaciones'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}

            {/* 💬 TAB: MENSAJES */}
            {activeTab === 'messages' && (
              <motion.div key="msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingMessages.length === 0 && messages.length === 0 && (
                  <p className="col-span-full py-12 text-center text-white/50 border-2 border-dashed border-white/5 rounded-3xl">No hay mensajes en el muro.</p>
                )}
                
                {pendingMessages.map(msg => (
                  <div key={msg.id} className="bg-[#1a241a] p-6 rounded-3xl border-l-4 border-amber-500 space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[#b8860b]">{msg.guestName}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveMessage(msg.id)} className="text-green-400 hover:scale-110 transition-transform"><CheckCircle2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                    <p className="text-sm italic text-[#fcfcf0]/80">"{msg.message}"</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Pendiente de aprobación</p>
                  </div>
                ))}
                {messages.map(msg => (
                  <div key={msg.id} className="bg-[#121912] p-6 rounded-3xl border border-white/5 space-y-4">
                    <span className="font-bold text-[#a0b0a0] block">{msg.guestName}</span>
                    <p className="text-sm italic opacity-70">"{msg.message}"</p>
                    <div className="pt-4 flex items-center gap-2 text-[10px] text-green-500 uppercase font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Visible en el muro
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* 🖼️ MODAL CARRUSEL DE MEDIA */}
      <AnimatePresence>
        {selectedMediaIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <button onClick={() => setSelectedMediaIndex(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><XCircle className="w-10 h-10" /></button>
            
            <button 
              onClick={() => setSelectedMediaIndex(prev => prev! > 0 ? prev! - 1 : photos.length - 1)}
              className="absolute left-4 p-4 text-white/20 hover:text-white transition-all"
            ><ChevronLeft className="w-12 h-12" /></button>

            <motion.div key={selectedMediaIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl max-h-[80vh] flex flex-col items-center">
              <img src={photos[selectedMediaIndex].photoUrl} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
              <div className="mt-6 text-center">
                <p className="text-xl font-serif text-[#b8860b]">Subido por {photos[selectedMediaIndex].guestName}</p>
                <p className="text-xs opacity-40 uppercase tracking-widest mt-2">{new Date(photos[selectedMediaIndex].createdAt).toLocaleDateString()}</p>
              </div>
            </motion.div>

            <button 
              onClick={() => setSelectedMediaIndex(prev => prev! < photos.length - 1 ? prev! + 1 : 0)}
              className="absolute right-4 p-4 text-white/20 hover:text-white transition-all"
            ><ChevronRight className="w-12 h-12" /></button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Componentes Auxiliares
function StatsCard({ title, value, subValue, icon }: any) {
  return (
    <div className="bg-[#121912] p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">{icon}</div>
      <div>
        <h4 className="text-3xl font-serif text-[#fcfcf0]">{value}</h4>
        <p className="text-xs font-bold text-[#b8860b] uppercase tracking-widest mt-1">{title}</p>
        <p className="text-[10px] text-[#a0b0a0] mt-2 italic">{subValue}</p>
      </div>
    </div>
  );
}