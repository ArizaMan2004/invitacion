'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  RefreshCw,
  PlayCircle
} from 'lucide-react';

import { 
  db, 
  getAdminSession, 
  clearAdminSession, 
  getAllRSVPResponses,
  getAllApprovedGuestPhotos,
  getAllPendingGuestPhotos,
  approveGuestPhoto,
  getAllGuestMessages,
  approveGuestMessage,
  getAllTriviaResults,
  TriviaResult
} from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore'; 
import { RSVPResponse, GuestPhoto, GuestMessage } from '@/lib/types';

type TabId = 'dashboard' | 'media' | 'rsvp' | 'messages' | 'trivia';

const isVideoUrl = (url: string) => {
  if (!url) return false;
  return url.includes('.mp4') || url.includes('.mov') || url.includes('video');
};

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<{ userId: string; email: string | null } | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [approvedPhotos, setApprovedPhotos] = useState<GuestPhoto[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<GuestPhoto[]>([]);
  const [approvedMessages, setApprovedMessages] = useState<GuestMessage[]>([]);
  const [pendingMessages, setPendingMessages] = useState<GuestMessage[]>([]);
  const [triviaResults, setTriviaResults] = useState<TriviaResult[]>([]);
  
  const [loadingData, setLoadingData] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const currentSession = await getAdminSession();
      if (!currentSession) {
        router.push('/login');
      } else {
        setSession(currentSession);
        loadDashboardData();
      }
      setLoadingSession(false);
    }
    checkAuth();
  }, [router]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    
    const results = await Promise.allSettled([
      getAllRSVPResponses(),
      getAllApprovedGuestPhotos(),
      getAllPendingGuestPhotos(),
      getAllGuestMessages(true),
      getAllGuestMessages(false),
      getAllTriviaResults()
    ]);

    if (results[0].status === 'fulfilled') setRsvps(results[0].value);
    if (results[1].status === 'fulfilled') setApprovedPhotos(results[1].value);
    if (results[2].status === 'fulfilled') setPendingPhotos(results[2].value);
    if (results[3].status === 'fulfilled') setApprovedMessages(results[3].value);
    if (results[4].status === 'fulfilled') setPendingMessages(results[4].value);
    if (results[5].status === 'fulfilled') setTriviaResults(results[5].value);

    setLoadingData(false);
  };

  const handleLogout = async () => {
    await clearAdminSession();
    router.push('/login');
  };

  const handlePhotoModeration = async (photoId: string, approve: boolean) => {
    try {
      await approveGuestPhoto(photoId, approve);
      if (approve) {
        const photo = pendingPhotos.find(p => p.id === photoId);
        if (photo) {
          setApprovedPhotos(prev => [photo, ...prev]);
          setPendingPhotos(prev => prev.filter(p => p.id !== photoId));
        }
      } else {
        setPendingPhotos(prev => prev.filter(p => p.id !== photoId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMessageModeration = async (messageId: string, approve: boolean) => {
    try {
      await approveGuestMessage(messageId, approve);
      if (approve) {
        const msg = pendingMessages.find(m => m.id === messageId);
        if (msg) {
          setApprovedMessages(prev => [msg, ...prev]);
          setPendingMessages(prev => prev.filter(m => m.id !== messageId));
        }
      } else {
        setPendingMessages(prev => prev.filter(m => m.id !== messageId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRecord = async (collectionName: string, id: string, stateUpdater: () => void) => {
    if (!confirm('¿Estás seguro de que deseas eliminar permanentemente este elemento de la base de datos?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      stateUpdater();
      if (selectedMediaIndex !== null) setSelectedMediaIndex(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loadingSession || !session) {
    return (
      <div className="min-h-screen bg-[#090d09] flex items-center justify-center text-[#fcfcf0]">
        <RefreshCw className="w-10 h-10 animate-spin text-[#b8860b]" />
      </div>
    );
  }

  const allPhotosCombined = [...pendingPhotos, ...approvedPhotos];

  return (
    <div className="min-h-screen bg-[#090d09] text-[#fcfcf0] font-sans antialiased flex flex-col md:flex-row">
      
      <aside className="w-full md:w-80 bg-[#121912] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between gap-6">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#b8860b] tracking-wide">Mis 15 Años</h1>
            <p className="text-xs text-[#a0b0a0]/60 mt-1">Panel de Control General</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Resumen', icon: BarChart3 },
              { id: 'media', label: 'Fotos y Videos', icon: ImageIcon, badge: pendingPhotos.length },
              { id: 'rsvp', label: 'Asistencias', icon: Users, badge: rsvps.length },
              { id: 'messages', label: 'Mensajes', icon: MessageSquare, badge: pendingMessages.length },
              { id: 'trivia', label: 'Trivia', icon: Gamepad2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#b8860b] text-[#121912] font-semibold' 
                      : 'hover:bg-white/5 text-[#a0b0a0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-[#121912] text-[#b8860b]' : 'bg-[#b8860b]/20 text-[#b8860b]'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
          <div className="px-2">
            <p className="text-xs font-semibold text-[#a0b0a0] truncate">{session.email}</p>
            <p className="text-[10px] text-[#a0b0a0]/40">Administrador Autenticado</p>
          </div>
          <Button onClick={handleLogout} variant="destructive" className="w-full justify-start gap-3 rounded-xl bg-red-950/40 border border-red-500/20 hover:bg-red-900 text-red-200">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-serif text-[#ffd700] uppercase tracking-wider">
              {activeTab === 'dashboard' && 'Panel de Resumen'}
              {activeTab === 'media' && 'Moderación de Galería'}
              {activeTab === 'rsvp' && 'Confirmaciones de Asistencia'}
              {activeTab === 'messages' && 'Libro de Buenos Deseos'}
              {activeTab === 'trivia' && 'Resultados de la Trivia'}
            </h2>
          </div>
          <Button onClick={loadDashboardData} disabled={loadingData} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full gap-2 self-start sm:self-auto">
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} /> Sincronizar Datos
          </Button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title="Total Invitados RSVP" value={rsvps.length} subValue={`${rsvps.filter((r: any) => r.attending).length} confirmados`} icon={<Users className="w-7 h-7 text-[#b8860b]" />} />
                  <StatsCard title="Fotos en Galería" value={approvedPhotos.length + pendingPhotos.length} subValue={`${pendingPhotos.length} pendientes`} icon={<ImageIcon className="w-7 h-7 text-[#b8860b]" />} />
                  <StatsCard title="Dedicatorias" value={approvedMessages.length + pendingMessages.length} subValue={`${pendingMessages.length} sin moderar`} icon={<MessageSquare className="w-7 h-7 text-[#b8860b]" />} />
                  <StatsCard title="Participantes Trivia" value={triviaResults.length} subValue="Ranking activo" icon={<Gamepad2 className="w-7 h-7 text-[#b8860b]" />} />
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-10">
                {pendingPhotos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Por Aprobar ({pendingPhotos.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {pendingPhotos.map((photo) => (
                        <div key={photo.id} className="group relative aspect-square bg-black/40 rounded-2xl overflow-hidden border border-amber-500/30">
                          {isVideoUrl(photo.url) ? (
                            <div className="w-full h-full flex items-center justify-center bg-black/80">
                              <PlayCircle className="w-12 h-12 text-amber-500" />
                            </div>
                          ) : (
                            <img src={photo.url} alt="Pendiente" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 z-10">
                            <p className="text-xs font-semibold truncate">{photo.guest_name}</p>
                            <div className="flex gap-2">
                              <button onClick={() => handlePhotoModeration(photo.id, true)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 p-2 rounded-xl text-xs font-bold flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></button>
                              <button onClick={() => handlePhotoModeration(photo.id, false)} className="flex-1 bg-red-600 hover:bg-red-500 p-2 rounded-xl text-xs font-bold flex items-center justify-center"><XCircle className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-[#b8860b] mb-4">Aprobados e Imprimibles ({approvedPhotos.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allPhotosCombined.map((photo, index) => {
                      if (!pendingPhotos.includes(photo)) {
                        return (
                          <div key={photo.id} onClick={() => setSelectedMediaIndex(index)} className="group relative aspect-square bg-black/20 rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#b8860b]/40 transition-all">
                            {isVideoUrl(photo.url) ? (
                              <div className="w-full h-full flex items-center justify-center bg-black/40"><PlayCircle className="w-10 h-10 text-white/40" /></div>
                            ) : (
                              <img src={photo.url} alt="Galería" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            )}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-xs font-medium truncate">{photo.guest_name}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rsvp' && (
              <div className="bg-[#121912] border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-xs font-semibold uppercase tracking-wider text-[#a0b0a0]/70">
                      <th className="p-5">Nombre del Invitado</th>
                      <th className="p-5">Asistencia</th>
                      <th className="p-5">Mensaje Adjunto</th>
                      <th className="p-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {rsvps.map((rsvp: any) => (
                      <tr key={rsvp.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-5 font-medium text-white">{rsvp.guest_name || 'Sin nombre'}</td>
                        <td className="p-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            rsvp.attending ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {rsvp.attending ? 'Confirmado' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="p-5 text-[#a0b0a0] max-w-xs truncate">{rsvp.additional_notes || '—'}</td>
                        <td className="p-5 text-right">
                          <button onClick={() => handleDeleteRecord('rsvp_responses', rsvp.id, () => setRsvps(prev => prev.filter(r => r.id !== rsvp.id)))} className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-8">
                {pendingMessages.length > 0 && (
                  <div>
                    <h3 className="text-md font-bold text-amber-400 mb-4">Mensajes Pendientes de Publicación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingMessages.map((msg) => (
                        <div key={msg.id} className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <p className="text-sm italic text-amber-100">"{msg.message}"</p>
                            <p className="text-xs font-bold text-[#b8860b]">De: {msg.guest_name}</p>
                          </div>
                          <div className="flex gap-2 self-end">
                            <Button onClick={() => handleMessageModeration(msg.id, true)} className="bg-emerald-600 hover:bg-emerald-500 size-8 p-0 rounded-lg"><CheckCircle2 className="w-4 h-4" /></Button>
                            <Button onClick={() => handleMessageModeration(msg.id, false)} className="bg-red-600 hover:bg-red-500 size-8 p-0 rounded-lg"><XCircle className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-md font-bold text-[#b8860b] mb-4">Mensajes Visibles en Muro Público</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {approvedMessages.map((msg) => (
                      <div key={msg.id} className="bg-[#121912] border border-white/5 p-5 rounded-2xl flex flex-col justify-between gap-4 group relative">
                        <div className="space-y-2">
                          <p className="text-sm text-[#a0b0a0]">"{msg.message}"</p>
                          <p className="text-xs font-bold text-[#ffd700]">— {msg.guest_name}</p>
                        </div>
                        <button onClick={() => handleDeleteRecord('guest_messages', msg.id, () => setApprovedMessages(prev => prev.filter(m => m.id !== msg.id)))} className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trivia' && (
              <div className="bg-[#121912] border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-xs font-semibold uppercase tracking-wider text-[#a0b0a0]/70">
                      <th className="p-5">Posición</th>
                      <th className="p-5">Invitado</th>
                      <th className="p-5">Gemelo Elegido</th>
                      <th className="p-5 text-center">Puntaje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {triviaResults.map((result, idx) => (
                      <tr key={result.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-5 font-bold text-[#b8860b]"># {idx + 1}</td>
                        <td className="p-5 font-medium text-white">{result.guest_name}</td>
                        <td className="p-5 uppercase tracking-wider text-xs">{result.twin_selected}</td>
                        <td className="p-5 text-center font-mono font-bold text-[#ffd700]">{result.score} / {result.total_questions || 3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedMediaIndex !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
              <button onClick={() => setSelectedMediaIndex(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-all p-4 z-50 text-2xl font-bold">&times;</button>
              
              <button 
                onClick={() => setSelectedMediaIndex(prev => prev! > 0 ? prev! - 1 : allPhotosCombined.length - 1)}
                className="absolute left-4 md:left-10 p-6 text-white/20 hover:text-white transition-all bg-white/5 rounded-full z-50"
              ><ChevronLeft className="w-10 h-10" /></button>

              <div className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-6 w-full px-12">
                {isVideoUrl(allPhotosCombined[selectedMediaIndex].url) ? (
                  <video src={allPhotosCombined[selectedMediaIndex].url} controls className="max-h-[70vh] rounded-2xl shadow-2xl" />
                ) : (
                  <img src={allPhotosCombined[selectedMediaIndex].url} alt="Fullscreen View" className="max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
                )}
                <div className="flex w-full justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                  <div>
                    <p className="text-sm font-bold text-white">{allPhotosCombined[selectedMediaIndex].guest_name}</p>
                    <p className="text-xs text-[#a0b0a0]">Subido el: {new Date(allPhotosCombined[selectedMediaIndex].created_at).toLocaleDateString()}</p>
                  </div>
                  <Button 
                    onClick={() => {
                      const photo = allPhotosCombined[selectedMediaIndex];
                      const isPending = pendingPhotos.some(p => p.id === photo.id);
                      handleDeleteRecord(
                        'guest_photos', 
                        photo.id, 
                        () => isPending 
                          ? setPendingPhotos(prev => prev.filter(p => p.id !== photo.id))
                          : setApprovedPhotos(prev => prev.filter(p => p.id !== photo.id))
                      );
                    }} 
                    className="border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white px-8 py-6 rounded-full transition-all"
                  >
                    Eliminar Archivo
                  </Button>
                </div>
              </div>

              <button 
                onClick={() => setSelectedMediaIndex(prev => prev! < allPhotosCombined.length - 1 ? prev! + 1 : 0)}
                className="absolute right-4 md:right-10 p-6 text-white/20 hover:text-white transition-all bg-white/5 rounded-full z-50"
              ><ChevronRight className="w-10 h-10" /></button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

function StatsCard({ title, value, subValue, icon }: any) {
  return (
    <div className="bg-[#121912] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4 hover:border-[#b8860b]/20 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#a0b0a0]/50">{title}</p>
        <h4 className="text-4xl font-mono font-bold text-[#ffd700] mt-1">{value}</h4>
        <p className="text-xs text-[#a0b0a0]/60 mt-1.5 flex items-center gap-1">{subValue}</p>
      </div>
    </div>
  );
}