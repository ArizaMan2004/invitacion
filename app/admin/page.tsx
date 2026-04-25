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
  ChevronLeft,
  ChevronRight,
  Clock,
  Gamepad2,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';

// Importación de utilidades de Supabase y Tipos
import { 
  supabase, 
  getAdminSession, 
  clearAdminSession, 
  getRSVPResponses,
  getApprovedGuestPhotos,
  getPendingGuestPhotos,
  approveGuestPhoto,
  getApprovedGuestMessages,
  getPendingGuestMessages,
  approveGuestMessage,
  getInvitation,
  getTriviaResults,
  TriviaResult
} from '@/lib/supabase';
import { RSVPResponse, GuestPhoto, GuestMessage, InvitationData } from '@/lib/types';

type TabId = 'dashboard' | 'media' | 'rsvp' | 'messages' | 'trivia';

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
  const [triviaScores, setTriviaScores] = useState<TriviaResult[]>([]);
  
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  // --- EFECTO INICIAL: SESIÓN Y CARGA ---
  useEffect(() => {
    const init = async () => {
      const session = await getAdminSession();
      if (session) {
        setIsAuthenticated(true);
        // Intentamos recuperar el ID de la invitación del localStorage o de la DB
        let id = localStorage.getItem('invitationId');
        
        if (!id) {
          const { data } = await supabase.from('invitations').select('id').limit(1).maybeSingle();
          if (data?.id) {
            id = data.id;
            localStorage.setItem('invitationId', id);
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

  // --- FUNCIÓN MAESTRA DE CARGA DE DATOS ---
  const loadAllData = async (id: string) => {
    setDataLoading(true);
    try {
      const [
        inv, 
        rsvpRes, 
        appPhotos, 
        penPhotos, 
        appMsg, 
        penMsg,
        triviaRes
      ] = await Promise.all([
        getInvitation(id),
        getRSVPResponses(id),
        getApprovedGuestPhotos(id),
        getPendingGuestPhotos(id),
        getApprovedGuestMessages(id),
        getPendingGuestMessages(id),
        getTriviaResults(id)
      ]);
      
      setInvitation(inv);
      setRsvps(rsvpRes || []);
      setPhotos(appPhotos || []);
      setPendingPhotos(penPhotos || []);
      setMessages(appMsg || []);
      setPendingMessages(penMsg || []);
      setTriviaScores(triviaRes || []);
    } catch (error) {
      console.error('Error sincronizando panel:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // --- HANDLERS DE ACCIONES ---
  const handleApproveMedia = async (id: string) => {
    const success = await approveGuestPhoto(id);
    if (success && invitationId) loadAllData(invitationId);
  };

  const handleApproveMessage = async (id: string) => {
    const success = await approveGuestMessage(id);
    if (success && invitationId) loadAllData(invitationId);
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta foto permanentemente?')) return;
    const { error } = await supabase.from('guest_photos').delete().eq('id', id);
    if (!error && invitationId) loadAllData(invitationId);
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este mensaje?')) return;
    const { error } = await supabase.from('guest_messages').delete().eq('id', id);
    if (!error && invitationId) loadAllData(invitationId);
  };

  // --- VISTAS DE CARGA Y LOGIN ---
  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0f0a] text-[#b8860b] font-serif tracking-[0.3em] animate-pulse">
      AUTENTICANDO SISTEMA...
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a] p-4 text-center">
      <div className="space-y-6">
        <h2 className="text-[#fcfcf0] text-2xl font-serif">Acceso Restringido</h2>
        <p className="text-[#a0b0a0] text-sm italic">Inicia sesión desde la página de acceso principal.</p>
        <Button onClick={() => window.location.href = '/login'} className="bg-[#b8860b] text-[#121912] font-bold px-8 py-6 rounded-full hover:scale-105 transition-transform">
          VOLVER AL LOGIN
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#070b07] overflow-hidden font-sans text-[#fcfcf0]">
      
      {/* SIDEBAR NAVEGACIÓN */}
      <aside className="w-20 md:w-64 bg-[#121912] border-r border-white/5 flex flex-col z-20 shrink-0">
        <div className="p-6 border-b border-white/5">
          <span className="font-serif text-[#b8860b] text-xl hidden md:block">Gestión Elite</span>
          <span className="text-[9px] tracking-[0.2em] text-[#a0b0a0] uppercase block">Control Panel v3.0</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
            { id: 'media', label: 'Álbum y Videos', icon: <ImageIcon className="w-5 h-5" /> },
            { id: 'rsvp', label: 'Asistencias', icon: <Users className="w-5 h-5" /> },
            { id: 'messages', label: 'Mensajes', icon: <MessageSquare className="w-5 h-5" /> },
            { id: 'trivia', label: 'Ranking Trivia', icon: <Gamepad2 className="w-5 h-5" /> },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-[#b8860b] text-[#121912] shadow-lg font-bold' : 'text-[#a0b0a0] hover:bg-white/5'}`}
            >
              {tab.icon}
              <span className="hidden md:block text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Button variant="ghost" className="w-full justify-start gap-4 text-red-400 hover:bg-red-400/10 rounded-xl" onClick={() => { clearAdminSession(); window.location.reload(); }}>
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block text-sm">Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {dataLoading && <div className="sticky top-0 z-50 h-1 bg-[#b8860b] animate-pulse" />}

        <header className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#b8860b]">
              {activeTab === 'dashboard' && 'Resumen General'}
              {activeTab === 'media' && 'Galería Colaborativa'}
              {activeTab === 'rsvp' && 'Control de Invitados'}
              {activeTab === 'messages' && 'Muro de Dedicatorias'}
              {activeTab === 'trivia' && 'Resultados de Trivia'}
            </h1>
            <p className="text-sm text-[#a0b0a0] mt-1 italic">
              {invitation?.quinceaneraName ? `Evento: ${invitation.quinceaneraName}` : 'Gestión de la experiencia'}
            </p>
          </div>
          <Button 
            onClick={() => loadAllData(invitationId)} 
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs tracking-widest px-6 py-4 rounded-full flex gap-2 items-center"
          >
            <RefreshCw className={`w-3 h-3 ${dataLoading ? 'animate-spin' : ''}`} />
            SINCRONIZAR DATOS
          </Button>
        </header>

        <div className="px-8 pb-12">
          <AnimatePresence mode="wait">
            
            {/* --- SECCIÓN: DASHBOARD --- */}
            {activeTab === 'dashboard' && (
               <motion.div 
                 key="dash" 
                 initial={{ opacity: 0, y: 20 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 exit={{ opacity: 0 }} 
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
               >
                 <StatsCard title="Confirmados" value={rsvps.filter(r => r.attending).length} subValue={`De ${rsvps.length} totales`} icon={<CheckCircle2 className="text-green-500" />} />
                 <StatsCard title="Media Pendiente" value={pendingPhotos.length} icon={<ImageIcon className="text-amber-500" />} subValue="Fotos por moderar" />
                 <StatsCard title="Trivia" value={triviaScores.length} icon={<Gamepad2 className="text-blue-500" />} subValue="Partidas completadas" />
                 <StatsCard title="Mensajes" value={messages.length} icon={<MessageSquare className="text-purple-500" />} subValue="Deseos aprobados" />
               </motion.div>
            )}

            {/* --- SECCIÓN: MEDIA (FOTOS/VIDEOS) --- */}
            {activeTab === 'media' && (
              <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                {pendingPhotos.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold tracking-[0.2em] text-amber-500 uppercase mb-6 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Moderación Pendiente
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {pendingPhotos.map(photo => (
                        <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                          <img src={photo.photoUrl} className="w-full h-full object-cover opacity-60" alt="Pendiente" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-sm">
                            <button onClick={() => handleApproveMedia(photo.id)} className="p-3 bg-green-500 text-black rounded-full hover:scale-110 transition-transform"><CheckCircle2 className="w-5 h-5" /></button>
                            <button onClick={() => handleDeleteMedia(photo.id)} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                
                <section>
                  <h3 className="text-sm font-bold tracking-[0.2em] text-[#b8860b] uppercase mb-6 flex justify-between items-center">
                    <span>Galería Pública ({photos.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {photos.map((photo, index) => (
                      <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5 cursor-pointer" onClick={() => setSelectedMediaIndex(index)}>
                        <img src={photo.photoUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Galería" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] font-bold truncate text-white uppercase tracking-tighter">{photo.guestName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* --- SECCIÓN: RSVP (INVITADOS) --- */}
            {activeTab === 'rsvp' && (
              <motion.div key="rsvp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#121912] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-[#a0b0a0]">
                        <th className="p-6 font-bold">Invitado</th>
                        <th className="p-6 font-bold">Estado</th>
                        <th className="p-6 font-bold">Adultos</th>
                        <th className="p-6 font-bold">Niños</th>
                        <th className="p-6 font-bold">Observaciones / Dieta</th>
                        <th className="p-6 font-bold">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rsvps.map(rsvp => (
                        <tr key={rsvp.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-6">
                            <p className="font-bold text-[#b8860b]">{rsvp.guestName}</p>
                            <p className="text-[10px] opacity-40">{rsvp.guestPhone || 'Sin teléfono'}</p>
                          </td>
                          <td className="p-6">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest ${rsvp.attending ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                              {rsvp.attending ? 'CONFIRMADO' : 'DECLINADO'}
                            </span>
                          </td>
                          <td className="p-6 text-sm">{rsvp.numberOfGuests}</td>
                          <td className="p-6 text-sm">{rsvp.childCount}</td>
                          <td className="p-6 text-xs italic opacity-60 max-w-xs truncate">
                            {rsvp.dietaryRestrictions || rsvp.additionalNotes || '---'}
                          </td>
                          <td className="p-6 text-[10px] opacity-30">{new Date(rsvp.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* --- SECCIÓN: MESSAGES (MURO) --- */}
            {activeTab === 'messages' && (
              <motion.div key="msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {pendingMessages.length > 0 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {pendingMessages.map(msg => (
                       <div key={msg.id} className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[2.5rem] flex justify-between items-center backdrop-blur-md">
                         <div>
                           <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Mensaje Pendiente</p>
                           <p className="text-lg italic text-white/90">"{msg.message}"</p>
                           <p className="text-xs mt-3 font-bold text-[#b8860b]">— {msg.guestName}</p>
                         </div>
                         <div className="flex flex-col gap-2">
                           <Button onClick={() => handleApproveMessage(msg.id)} size="icon" className="bg-green-500 text-black rounded-full hover:scale-110"><CheckCircle2 className="w-5 h-5" /></Button>
                           <Button onClick={() => handleDeleteMessage(msg.id)} size="icon" className="bg-white/5 text-red-500 rounded-full hover:bg-red-500/20"><Trash2 className="w-5 h-5" /></Button>
                         </div>
                       </div>
                     ))}
                   </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {messages.map(msg => (
                    <div key={msg.id} className="bg-[#121912] p-8 rounded-[2.5rem] border border-white/5 relative group hover:border-[#b8860b]/30 transition-all shadow-lg">
                      <p className="text-sm text-white/70 italic leading-relaxed mb-6">"{msg.message}"</p>
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] text-[#b8860b] font-bold uppercase tracking-[0.2em]">{msg.guestName}</p>
                        <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 text-red-500/40 hover:text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- SECCIÓN: TRIVIA (RANKING) --- */}
            {activeTab === 'trivia' && (
              <motion.div key="trivia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#121912] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] uppercase tracking-[0.3em] text-[#a0b0a0]">
                    <tr>
                      <th className="p-6">Jugador</th>
                      <th className="p-6">Gemelo Elegido</th>
                      <th className="p-6">Aciertos</th>
                      <th className="p-6 text-right">Fecha de Juego</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {triviaScores.map(scoreRecord => (
                      <tr key={scoreRecord.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-6 font-bold text-[#b8860b] uppercase tracking-tighter">{scoreRecord.guest_name}</td>
                        <td className="p-6">
                          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${scoreRecord.twin_selected === 'Jesus' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'}`}>
                            {scoreRecord.twin_selected}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-serif text-white">{scoreRecord.score}</span>
                            <span className="text-[10px] opacity-30 font-bold uppercase">/ {scoreRecord.total_questions}</span>
                          </div>
                        </td>
                        <td className="p-6 text-right text-[10px] opacity-30 font-mono">
                          {new Date(scoreRecord.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {triviaScores.length === 0 && (
                  <div className="p-20 text-center text-[#a0b0a0] italic text-sm">
                    Aún nadie ha participado en la trivia...
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* MODAL: CARRUSEL DE MEDIA (PANTALLA COMPLETA) */}
      <AnimatePresence>
        {selectedMediaIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 backdrop-blur-2xl"
          >
            <button onClick={() => setSelectedMediaIndex(null)} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"><XCircle className="w-12 h-12" /></button>
            
            <button 
              onClick={() => setSelectedMediaIndex(prev => prev! > 0 ? prev! - 1 : photos.length - 1)}
              className="absolute left-4 md:left-10 p-6 text-white/20 hover:text-white transition-all bg-white/5 rounded-full"
            ><ChevronLeft className="w-10 h-10" /></button>

            <motion.div key={selectedMediaIndex} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center max-w-6xl w-full">
              <img src={photos[selectedMediaIndex].photoUrl} className="max-w-full max-h-[75vh] object-contain rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10" alt="Vista ampliada" />
              <div className="mt-10 text-center">
                <p className="text-3xl font-serif text-[#b8860b] mb-2">{photos[selectedMediaIndex].guestName}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mb-8">{new Date(photos[selectedMediaIndex].createdAt).toLocaleString()}</p>
                <div className="flex justify-center gap-4">
                   <Button variant="outline" onClick={() => handleDeleteMedia(photos[selectedMediaIndex].id)} className="border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white px-8 py-6 rounded-full transition-all">Eliminar Imagen</Button>
                </div>
              </div>
            </motion.div>

            <button 
              onClick={() => setSelectedMediaIndex(prev => prev! < photos.length - 1 ? prev! + 1 : 0)}
              className="absolute right-4 md:right-10 p-6 text-white/20 hover:text-white transition-all bg-white/5 rounded-full"
            ><ChevronRight className="w-10 h-10" /></button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// COMPONENTE AUXILIAR: TARJETA DE ESTADÍSTICAS
function StatsCard({ title, value, subValue, icon }: any) {
  return (
    <div className="bg-[#121912] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4 hover:border-[#b8860b]/20 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h4 className="text-4xl font-serif text-[#fcfcf0]">{value}</h4>
        <p className="text-[10px] font-black text-[#b8860b] uppercase tracking-[0.2em] mt-1">{title}</p>
        <p className="text-[10px] text-[#a0b0a0] mt-3 italic opacity-60">{subValue}</p>
      </div>
    </div>
  );
}