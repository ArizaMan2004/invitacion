'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  LogOut, 
  Music, 
  Mail, 
  MousePointer2, 
  Eye, 
  EyeOff, 
  Settings, 
  Search, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle2, 
  X, 
  Palette, 
  MapPin, 
  Calendar 
} from 'lucide-react';

// Utilidades de Supabase y Tipos
import { 
  getInvitation, 
  updateInvitation, 
  createInvitation, 
  loginAdmin, 
  getAdminSession, 
  clearAdminSession, 
  updateEnvelopeImages,
  getRSVPResponses
} from '@/lib/supabase';
import { RSVPResponse, InvitationData } from '@/lib/types';
import { DEFAULT_INVITATION_DATA } from '@/lib/constants';
import { InvitationSPA } from '@/components/InvitationSPA';

// --- CONFIGURACIÓN DE MÚSICA RECOMENDADA ---
const RECOMMENDED_SONGS = [
  { id: '1', title: "Tiempo de Vals", artist: "Chayanne", url: "https://www.youtube.com/watch?v=1bGQ1-7mB9I", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&q=80" },
  { id: '2', title: "A Thousand Years", artist: "Christina Perri", url: "https://www.youtube.com/watch?v=rtOvBOTyX00", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80" },
  { id: '3', title: "Perfect", artist: "Ed Sheeran", url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80" },
  { id: '4', title: "Quinceañera", artist: "Thalia", url: "https://www.youtube.com/watch?v=mD2bXn2u92g", cover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&q=80" },
  { id: '5', title: "No Crezcas Más", artist: "Tercer Cielo", url: "https://www.youtube.com/watch?v=6P3gXvWJ9gQ", cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?w=100&q=80" },
];

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

type TabId = 'visual' | 'design' | 'envelope' | 'music' | 'rsvp' | 'settings';

export default function AdvancedAdminEditor() {
  // --- ESTADOS DE AUTENTICACIÓN ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // --- ESTADOS DE DATOS ---
  const [invitationId, setInvitationId] = useState('');
  const [data, setData] = useState<InvitationData>(DEFAULT_INVITATION_DATA);
  const [envelopeBackUrl, setEnvelopeBackUrl] = useState('');
  const [envelopeFlapUrl, setEnvelopeFlapUrl] = useState('');
  const [rsvpResponses, setRsvpResponses] = useState<RSVPResponse[]>([]);
  
  // --- ESTADOS DE INTERFAZ ---
  const [activeTab, setActiveTab] = useState<TabId>('design');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [musicSearchTerm, setMusicSearchTerm] = useState('');
  const [previewSongUrl, setPreviewSongUrl] = useState<string | null>(null);

  // Verificación de sesión al cargar
  useEffect(() => {
    const init = async () => {
      const session = await getAdminSession();
      if (session) {
        setIsAuthenticated(true);
        const id = localStorage.getItem('invitationId');
        if (id) {
          setInvitationId(id);
          await loadAllData(id);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  // CARGA COMPLETA DE DATOS CON FALLBACKS DE SEGURIDAD
  const loadAllData = async (id: string) => {
    setDataLoading(true);
    try {
      const [inv, rsvp] = await Promise.all([
        getInvitation(id),
        getRSVPResponses(id),
      ]);
      
      if (inv) {
        setData({ 
          ...DEFAULT_INVITATION_DATA, 
          ...inv,
          // CORRECCIÓN CRÍTICA: Si la DB no tiene imágenes, forzamos las de DEFAULT_INVITATION_DATA (locales)
          heroImage: inv.heroImage || DEFAULT_INVITATION_DATA.heroImage,
          galleryImages: (inv.galleryImages && inv.galleryImages.length > 0) 
            ? inv.galleryImages 
            : DEFAULT_INVITATION_DATA.galleryImages
        });
        setEnvelopeBackUrl((inv as any).envelope_back_image || '/envelope-back.jpg');
        setEnvelopeFlapUrl((inv as any).envelope_flap_image || '/envelope-flap.jpg');
      }
      setRsvpResponses(rsvp || []);
    } catch (error) {
      console.error('Error sincronizando datos:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const userId = await loginAdmin(email, password);
    if (userId) {
      setIsAuthenticated(true);
      const id = localStorage.getItem('invitationId');
      if (id) {
        setInvitationId(id);
        await loadAllData(id);
      }
    } else {
      setLoginError('Credenciales inválidas.');
    }
  };

  const handleDataChange = (field: keyof InvitationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePublish = async () => {
    if (!invitationId) {
      alert('Primero crea o carga una invitación en la pestaña Ajustes.');
      return;
    }
    setIsSaving(true);
    try {
      const successData = await updateInvitation(invitationId, data);
      const successEnvelope = await updateEnvelopeImages(invitationId, envelopeBackUrl, envelopeFlapUrl);
      if (successData && successEnvelope) alert('¡Publicado con éxito!');
    } catch (error) {
      console.error(error);
      alert('Error al publicar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewInvitation = async () => {
    setDataLoading(true);
    try {
      const newId = await createInvitation(DEFAULT_INVITATION_DATA);
      if (newId) {
        setInvitationId(newId);
        localStorage.setItem('invitationId', newId);
        await loadAllData(newId);
        alert(`Nueva invitación ID: ${newId}`);
      }
    } finally {
      setDataLoading(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-zinc-900 text-white font-serif tracking-widest">CARGANDO SISTEMA...</div>;

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border">
        <h2 className="text-2xl font-bold mb-6 text-center text-zinc-800">Admin Access</h2>
        {loginError && <p className="text-red-500 text-xs mb-4">{loginError}</p>}
        <Input className="mb-4" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <Input className="mb-6" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800">ENTRAR AL EDITOR</Button>
      </form>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-zinc-200 overflow-hidden font-sans">
      
      {previewSongUrl && (
        <iframe className="hidden" src={`https://www.youtube.com/embed/${getYouTubeId(previewSongUrl)}?autoplay=1`} allow="autoplay" />
      )}

      <AnimatePresence>
        {!isPreviewMode && (
          <motion.aside 
            initial={{ x: -350, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -350, opacity: 0 }}
            className="w-[350px] bg-white shadow-2xl flex flex-col z-20 border-r border-zinc-200 shrink-0"
          >
            <div className="p-4 border-b bg-zinc-50 flex justify-between items-center">
              <span className="font-bold text-[10px] tracking-[0.2em] text-zinc-400 uppercase">Bosque Encantado v2.0</span>
              <Button variant="ghost" size="icon" onClick={() => { clearAdminSession(); setIsAuthenticated(false); }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* TABS DE NAVEGACIÓN LATERAL */}
            <div className="flex flex-wrap border-b">
              {[
                { id: 'design', icon: <Palette className="h-4 w-4" /> },
                { id: 'visual', icon: <MousePointer2 className="h-4 w-4" /> },
                { id: 'envelope', icon: <Mail className="h-4 w-4" /> },
                { id: 'music', icon: <Music className="h-4 w-4" /> },
                { id: 'rsvp', icon: <Users className="h-4 w-4" /> },
                { id: 'settings', icon: <Settings className="h-4 w-4" /> },
              ].map(tab => (
                <button 
                  key={tab.id} onClick={() => setActiveTab(tab.id as TabId)}
                  className={`p-3 flex justify-center flex-1 border-b-2 transition-colors ${activeTab === tab.id ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-zinc-400'}`}
                >
                  {tab.icon}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto relative p-5 space-y-6 custom-scrollbar">
              {dataLoading && <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center font-bold text-green-700 animate-pulse">SINCRONIZANDO...</div>}

              {/* CONTENIDO DE PESTAÑAS */}
              {activeTab === 'design' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase">Estilo de Interfaz</label>
                    <div className="flex gap-2 p-1 bg-zinc-100 rounded-lg">
                      <button onClick={() => handleDataChange('themeMode', 'light')} className={`flex-1 py-2 text-[10px] font-bold rounded-md ${data.themeMode !== 'dark' ? 'bg-white shadow-sm' : 'text-zinc-500'}`}>CLARO</button>
                      <button onClick={() => handleDataChange('themeMode', 'dark')} className={`flex-1 py-2 text-[10px] font-bold rounded-md ${data.themeMode === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}>OSCURO</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase">Color de Texto</span>
                      <input type="color" value={data.textColor || '#e8efe8'} onChange={(e) => handleDataChange('textColor', e.target.value)} className="w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-sm" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase">Color de Acento</span>
                      <input type="color" value={data.accentColor || '#6b8e23'} onChange={(e) => handleDataChange('accentColor', e.target.value)} className="w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-sm" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase">Fondos Maestros</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-zinc-50 border rounded-xl flex flex-col items-center gap-2">
                        <input type="color" value={data.backgroundColor || '#121f12'} onChange={(e) => handleDataChange('backgroundColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">Fondo Web</p>
                      </div>
                      <div className="p-3 bg-zinc-50 border rounded-xl flex flex-col items-center gap-2">
                        <input type="color" value={data.cardColor || '#1d331d'} onChange={(e) => handleDataChange('cardColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">Tarjetas</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'visual' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-left-4">
                  <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase"><Calendar className="w-4 h-4" /> Fecha y Hora</div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="date" value={data.eventDate || ''} onChange={e => handleDataChange('eventDate', e.target.value)} className="text-xs" />
                    <Input type="time" value={data.eventTime || ''} onChange={e => handleDataChange('eventTime', e.target.value)} className="text-xs" />
                  </div>
                  <hr />
                  <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase"><MapPin className="w-4 h-4" /> Ubicación GPS</div>
                  <Input placeholder="Nombre del Lugar" value={data.venue || ''} onChange={e => handleDataChange('venue', e.target.value)} />
                  <Input placeholder="Dirección" value={data.venueAddress || ''} onChange={e => handleDataChange('venueAddress', e.target.value)} />
                  <Input placeholder="Iframe de Google Maps (URL)" value={data.mapIframeSrc || ''} onChange={e => handleDataChange('mapIframeSrc', e.target.value)} />
                </div>
              )}

              {activeTab === 'envelope' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-left-4">
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-[10px] text-amber-900 leading-relaxed">
                    <p>Configura las texturas del sobre virtual. Puedes usar rutas locales como <strong>/envelope-back.jpg</strong>.</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Imagen Exterior</label>
                    <Input value={envelopeBackUrl} onChange={e => setEnvelopeBackUrl(e.target.value)} className="text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Imagen Solapa (Flap)</label>
                    <Input value={envelopeFlapUrl} onChange={e => setEnvelopeFlapUrl(e.target.value)} className="text-xs" />
                  </div>
                </div>
              )}

              {activeTab === 'music' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input placeholder="Buscar canción..." className="pl-9 bg-zinc-100 border-0" value={musicSearchTerm} onChange={e => setMusicSearchTerm(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    {RECOMMENDED_SONGS.filter(s => s.title.toLowerCase().includes(musicSearchTerm.toLowerCase())).map(song => (
                      <div key={song.id} onClick={() => handleDataChange('youtubeMusicLink', song.url)} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border ${data.youtubeMusicLink === song.url ? 'border-green-400 bg-green-50' : 'border-transparent hover:bg-zinc-100'}`}>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden group">
                          <img src={song.cover} className="w-full h-full object-cover" />
                          <div onClick={e => { e.stopPropagation(); setPreviewSongUrl(previewSongUrl === song.url ? null : song.url); }} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {previewSongUrl === song.url ? <PauseCircle className="text-white w-5 h-5" /> : <PlayCircle className="text-white w-5 h-5" />}
                          </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[11px] font-bold truncate">{song.title}</p>
                          <p className="text-[9px] text-zinc-500 truncate">{song.artist}</p>
                        </div>
                        {data.youtubeMusicLink === song.url && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rsvp' && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-bold text-sm text-zinc-800 uppercase tracking-tighter">Confirmaciones ({rsvpResponses.length})</h3>
                  {rsvpResponses.map(rsvp => (
                    <div key={rsvp.id} className="p-3 bg-zinc-50 border rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{rsvp.guestName}</span>
                        <span className={rsvp.attending ? 'text-green-600' : 'text-red-600'}>{rsvp.attending ? 'SÍ' : 'NO'}</span>
                      </div>
                      {rsvp.additionalNotes && <p className="text-zinc-500 italic">"{rsvp.additionalNotes}"</p>}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6 text-center animate-in fade-in">
                  <Button onClick={handleCreateNewInvitation} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 shadow-lg shadow-green-100">NUEVA INVITACIÓN (TWINS)</Button>
                  <div className="p-4 bg-zinc-50 border rounded-xl">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-2">ID Activo</label>
                    <Input value={invitationId} onChange={e => setInvitationId(e.target.value)} className="text-xs font-mono text-center" />
                    <Button onClick={() => { if(invitationId){ localStorage.setItem('invitationId', invitationId); loadAllData(invitationId); } }} className="w-full mt-3 h-9 bg-zinc-800 text-white text-[10px]">RECARGAR ESTE ID</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-zinc-50">
              <Button onClick={handlePublish} disabled={isSaving || dataLoading} className="w-full bg-green-700 hover:bg-green-800 text-white font-black h-12 shadow-xl shadow-green-200">
                {isSaving ? "GUARDANDO..." : "PUBLICAR CAMBIOS"}
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 relative flex flex-col min-w-0 bg-zinc-300">
        {/* BARRA SUPERIOR DE PREVISUALIZACIÓN */}
        <div className="h-12 bg-zinc-800 flex items-center justify-between px-4 z-10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">invitation_editor_v2: {invitationId || 'offline'}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)} className="text-xs text-zinc-300 hover:text-white h-8">
            {isPreviewMode ? <><EyeOff className="mr-2 h-4 w-4" /> Salir del Render</> : <><Eye className="mr-2 h-4 w-4" /> Maximizar Vista</>}
          </Button>
        </div>

        {/* ÁREA DE RENDERIZADO DEL TELÉFONO */}
        <div className="flex-1 overflow-y-auto p-0 md:p-8 custom-scrollbar">
          <div className={`mx-auto transition-all duration-700 ease-in-out shadow-2xl bg-white ${isPreviewMode ? 'w-full max-w-none rounded-none' : 'w-full max-w-[420px] rounded-[3.5rem] ring-8 ring-zinc-900/10 overflow-hidden'}`}>
            <InvitationSPA 
              initialData={data} 
              invitationId={invitationId} 
              isEditing={true} 
              onDataChange={handleDataChange}
            />
          </div>
        </div>
      </main>

    </div>
  );
}