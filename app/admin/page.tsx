'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, 
  Users, 
  LogOut, 
  Music, 
  Mail, 
  MousePointer2, 
  Image as ImageIcon,
  MessageSquare,
  Eye,
  EyeOff,
  Settings,
  Search,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  X,
  Palette
} from 'lucide-react';
import { 
  getInvitation, 
  updateInvitation, 
  createInvitation, 
  loginAdmin, 
  getAdminSession, 
  clearAdminSession, 
  updateEnvelopeImages,
  getRSVPResponses,
  getPendingGuestPhotos,
  approveGuestPhoto,
  getPendingGuestMessages,
  approveGuestMessage
} from '@/lib/supabase';
import { RSVPResponse, GuestPhoto, GuestMessage, InvitationData } from '@/lib/types';
import { DEFAULT_INVITATION_DATA } from '@/lib/constants';
import { InvitationSPA } from '@/components/InvitationSPA';

const RECOMMENDED_SONGS = [
  { id: '1', title: "Tiempo de Vals", artist: "Chayanne", url: "https://www.youtube.com/watch?v=1bGQ1-7mB9I", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&q=80" },
  { id: '2', title: "A Thousand Years", artist: "Christina Perri", url: "https://www.youtube.com/watch?v=rtOvBOTyX00", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80" },
  { id: '3', title: "Perfect", artist: "Ed Sheeran", url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80" },
  { id: '4', title: "Quinceañera", artist: "Thalia", url: "https://www.youtube.com/watch?v=mD2bXn2u92g", cover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&q=80" },
  { id: '5', title: "My Girl", artist: "The Temptations", url: "https://www.youtube.com/watch?v=C_CSjcm-z1w", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&q=80" },
  { id: '6', title: "No Crezcas Más", artist: "Tercer Cielo", url: "https://www.youtube.com/watch?v=6P3gXvWJ9gQ", cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?w=100&q=80" },
  { id: '7', title: "Dancing Queen", artist: "ABBA", url: "https://www.youtube.com/watch?v=xFrGuyw1V8s", cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&q=80" },
  { id: '8', title: "Halo", artist: "Beyoncé", url: "https://www.youtube.com/watch?v=bnVUHWCynig", cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&q=80" },
];

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

type TabId = 'visual' | 'design' | 'envelope' | 'music' | 'rsvp' | 'photos' | 'messages' | 'settings';

export default function AdvancedAdminEditor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [invitationId, setInvitationId] = useState('');
  const [data, setData] = useState<InvitationData>(DEFAULT_INVITATION_DATA);
  const [envelopeBackUrl, setEnvelopeBackUrl] = useState('');
  const [envelopeFlapUrl, setEnvelopeFlapUrl] = useState('');
  
  const [rsvpResponses, setRsvpResponses] = useState<RSVPResponse[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<GuestPhoto[]>([]);
  const [pendingMessages, setPendingMessages] = useState<GuestMessage[]>([]);

  const [activeTab, setActiveTab] = useState<TabId>('visual');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const [musicSearchTerm, setMusicSearchTerm] = useState('');
  const [previewSongUrl, setPreviewSongUrl] = useState<string | null>(null);

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

  useEffect(() => {
    if (activeTab !== 'music') {
      setPreviewSongUrl(null);
    }
  }, [activeTab]);

  const loadAllData = async (id: string) => {
    setDataLoading(true);
    try {
      const [inv, rsvp, photos, messages] = await Promise.all([
        getInvitation(id),
        getRSVPResponses(id),
        getPendingGuestPhotos(id),
        getPendingGuestMessages(id),
      ]);
      
      if (inv) {
        setData({ ...DEFAULT_INVITATION_DATA, ...inv });
        setEnvelopeBackUrl((inv as any).envelope_back_image || '');
        setEnvelopeFlapUrl((inv as any).envelope_flap_image || '');
      }
      setRsvpResponses(rsvp || []);
      setPendingPhotos(photos || []);
      setPendingMessages(messages || []);
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
      setLoginError('Credenciales inválidas o acceso denegado.');
    }
  };

  const handleDataChange = (field: keyof InvitationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleMapChange = (url: string) => {
    const srcMatch = url.match(/src="([^"]+)"/);
    const finalUrl = srcMatch ? srcMatch[1] : url;
    handleDataChange('mapIframeSrc' as any, finalUrl);
  };

  const handlePublish = async () => {
    if (!invitationId) {
      alert('No hay un ID de invitación activo. Ve a la pestaña de Ajustes (Engranaje) para crear uno.');
      setActiveTab('settings');
      return;
    }
    setIsSaving(true);
    try {
      const successData = await updateInvitation(invitationId, data);
      const successEnvelope = await updateEnvelopeImages(invitationId, envelopeBackUrl, envelopeFlapUrl);
      
      if (successData && successEnvelope) {
        alert('Configuración guardada y publicada exitosamente.');
      } else {
        alert('Se produjo un error al guardar algunos parámetros.');
      }
    } catch (error) {
      console.error('Error durante la publicación:', error);
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
        alert(`¡Nueva invitación creada con éxito!\n\nTu nuevo ID es: ${newId}`);
        setActiveTab('design'); 
      } else {
        alert('Error al crear la invitación en la base de datos.');
      }
    } catch (error) {
      console.error('Error creando invitación:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const filteredSongs = RECOMMENDED_SONGS.filter(song => 
    song.title.toLowerCase().includes(musicSearchTerm.toLowerCase()) || 
    song.artist.toLowerCase().includes(musicSearchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-zinc-900 text-white">Inicializando entorno...</div>;
  }

  if (!isAuthenticated) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
         <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl border border-zinc-200">
           <div className="text-center mb-8">
             <div className="inline-flex w-16 h-16 bg-zinc-900 rounded-lg items-center justify-center mb-4">
               <span className="text-2xl font-bold text-white tracking-widest">SYS</span>
             </div>
             <h2 className="text-2xl font-bold text-zinc-800">Acceso Administrativo</h2>
             <p className="text-zinc-500 text-sm mt-1">Gestión de Eventos y Protocolos</p>
           </div>
           
           <form onSubmit={handleLogin} className="space-y-4">
             {loginError && <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">{loginError}</div>}
             <Input type="email" placeholder="Correo electrónico" value={email} onChange={e=>setEmail(e.target.value)} required />
             <Input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} required />
             <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white">Autenticar</Button>
           </form>
         </div>
       </div>
     );
  }

  return (
    <div className="flex h-screen w-full bg-zinc-200 overflow-hidden font-sans">
      
      {previewSongUrl && (
        <iframe
          className="hidden"
          src={`https://www.youtube.com/embed/${getYouTubeId(previewSongUrl)}?autoplay=1&enablejsapi=1`}
          allow="autoplay"
        />
      )}

      <AnimatePresence>
        {!isPreviewMode && (
          <motion.aside 
            initial={{ x: -350, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -350, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[350px] bg-white shadow-2xl flex flex-col z-20 border-r border-zinc-200 shrink-0"
          >
            <div className="flex items-center justify-between p-4 border-b bg-zinc-50">
              <span className="font-bold text-sm text-zinc-700 tracking-wider">CONSOLE</span>
              <Button variant="ghost" size="icon" onClick={() => { clearAdminSession(); setIsAuthenticated(false); }}>
                <LogOut className="h-4 w-4 text-zinc-500"/>
              </Button>
            </div>

            <div className="flex flex-wrap border-b bg-zinc-50/50">
              {[
                { id: 'design', icon: <Palette className="h-4 w-4" />, title: 'Diseño' },
                { id: 'visual', icon: <MousePointer2 className="h-4 w-4" />, title: 'Datos' },
                { id: 'envelope', icon: <Mail className="h-4 w-4" />, title: 'Sobre' },
                { id: 'music', icon: <Music className="h-4 w-4" />, title: 'Audio' },
                { id: 'rsvp', icon: <Users className="h-4 w-4" />, title: 'RSVP' },
                { id: 'settings', icon: <Settings className="h-4 w-4" />, title: 'Ajustes' }, 
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)} 
                  title={tab.title}
                  className={`p-3 flex justify-center flex-1 border-b-2 transition-colors ${activeTab === tab.id ? 'bg-white text-blue-600 border-blue-600' : 'text-zinc-400 border-transparent hover:bg-zinc-100 hover:text-zinc-600'}`}
                >
                  {tab.icon}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto relative custom-scrollbar flex flex-col">
              
              {dataLoading && (
                <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">Procesando...</span>
                </div>
              )}

              <div className="p-5 flex-1">
                
                {activeTab === 'design' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded border border-blue-100 text-xs flex items-start gap-2">
                      <Palette className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>Personaliza la paleta de colores. El modo oscuro ajustará automáticamente el contraste de los textos.</p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-400 uppercase">Estilo Global</label>
                      <div className="flex gap-2 p-1 bg-zinc-100 rounded-lg">
                        <button 
                          onClick={() => handleDataChange('themeMode' as any, 'light')}
                          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${data.themeMode !== 'dark' ? 'bg-white shadow-sm text-zinc-800' : 'text-zinc-500'}`}
                        >
                          MODO CLARO
                        </button>
                        <button 
                          onClick={() => handleDataChange('themeMode' as any, 'dark')}
                          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${data.themeMode === 'dark' ? 'bg-zinc-800 shadow-sm text-white' : 'text-zinc-500'}`}
                        >
                          MODO OSCURO
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-zinc-400 uppercase">Color de Acento</label>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">{data.accentColor || '#d97706'}</span>
                          <input 
                            type="color" 
                            value={data.accentColor || '#d97706'} 
                            onChange={(e) => handleDataChange('accentColor' as any, e.target.value)}
                            className="w-6 h-6 rounded-full border-0 cursor-pointer overflow-hidden p-0 bg-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-2">
                        {['#d97706', '#2563eb', '#db2777', '#059669', '#7c3aed', '#dc2626'].map(color => (
                          <button
                            key={color}
                            onClick={() => handleDataChange('accentColor' as any, color)}
                            style={{ backgroundColor: color }}
                            className={`h-8 rounded-md border-2 transition-all ${data.accentColor === color ? 'border-zinc-900 scale-110 shadow-lg' : 'border-transparent'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-400 uppercase">Fondo Base</label>
                       <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl border">
                          <input 
                            type="color" 
                            value={data.backgroundColor || '#ffffff'} 
                            onChange={(e) => handleDataChange('backgroundColor' as any, e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border-zinc-200"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-zinc-700">Color Manual</p>
                            <p className="text-[10px] text-zinc-400">Personaliza el fondo de la página web</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'visual' && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded border border-blue-100 text-xs flex items-start gap-2">
                      <MousePointer2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>La edición es in-line. Interactúa con la vista previa a la derecha. Aquí también puedes ajustar configuraciones técnicas.</p>
                    </div>
                    <hr className="border-zinc-200" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Fecha</label>
                        <Input type="date" value={data.eventDate || ''} onChange={e => handleDataChange('eventDate', e.target.value)} className="mt-1 text-xs h-8" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Hora</label>
                        <Input type="time" value={data.eventTime || ''} onChange={e => handleDataChange('eventTime', e.target.value)} className="mt-1 text-xs h-8" />
                      </div>
                    </div>

                    <hr className="border-zinc-200" />
                    <h3 className="font-bold text-sm text-zinc-800">Ubicación GPS y Evento</h3>
                    
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Nombre del Salón</label>
                      <Input value={data.venue || ''} onChange={e => handleDataChange('venue', e.target.value)} placeholder="Ej: Salón Emperador" className="mt-1" />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Dirección Exacta</label>
                      <Input value={data.venueAddress || ''} onChange={e => handleDataChange('venueAddress' as any, e.target.value)} placeholder="Ej: Av. Principal, Calle 4..." className="mt-1" />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Iframe / Link de Google Maps</label>
                      <Input value={data.mapIframeSrc || ''} onChange={e => handleMapChange(e.target.value)} placeholder="Pega el link o iframe aquí..." className="mt-1" />
                      <p className="text-[10px] text-zinc-400 mt-1">Ve a Google Maps &gt; Compartir &gt; Copiar enlace (o Insertar Mapa).</p>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-5 animate-in fade-in">
                    <h3 className="font-bold text-sm text-zinc-800">Ajustes del Sistema</h3>
                    
                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                      <p className="text-xs text-zinc-600 mb-3 font-semibold">¿Empezar desde cero?</p>
                      <Button onClick={handleCreateNewInvitation} className="w-full bg-green-600 hover:bg-green-700 text-white h-9 text-xs shadow-sm">
                        Crear Nueva Invitación
                      </Button>
                    </div>
                    <hr className="border-zinc-200" />
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase">ID de la Invitación Activa</label>
                      <Input value={invitationId} onChange={e => setInvitationId(e.target.value)} placeholder="Ej: 550e8400-e29b..." className="mt-1" />
                      <Button onClick={() => { if(invitationId) { localStorage.setItem('invitationId', invitationId); loadAllData(invitationId); } }} className="w-full mt-3 bg-zinc-800 hover:bg-zinc-900 text-white h-8 text-xs">
                        Cargar Datos
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'envelope' && (
                  <div className="space-y-5 animate-in fade-in">
                    <h3 className="font-bold text-sm text-zinc-800">Sobre Interactivo</h3>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase">Fondo Exterior (URL)</label>
                      <Input value={envelopeBackUrl || ''} onChange={e => setEnvelopeBackUrl(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase">Textura Solapa (URL)</label>
                      <Input value={envelopeFlapUrl || ''} onChange={e => setEnvelopeFlapUrl(e.target.value)} />
                    </div>
                  </div>
                )}

                {activeTab === 'music' && (
                  <div className="space-y-5 animate-in fade-in">
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <Input 
                        placeholder="Buscar canción o artista..." 
                        className="pl-9 bg-zinc-100 border-transparent focus:bg-white transition-colors"
                        value={musicSearchTerm}
                        onChange={(e) => setMusicSearchTerm(e.target.value)}
                      />
                    </div>

                    {(data as any).youtubeMusicLink && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">Pista Seleccionada</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-200 rounded-md flex items-center justify-center shrink-0">
                            <Music className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-semibold text-zinc-800 truncate">URL Activa</p>
                            <p className="text-[10px] text-zinc-500 truncate">{(data as any).youtubeMusicLink}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDataChange('youtubeMusicLink' as any, '')}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs"
                          >
                            Quitar
                          </Button>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase mb-3 px-1">Recomendados para 15 Años</p>
                      <div className="space-y-2">
                        {filteredSongs.length > 0 ? (
                          filteredSongs.map((song) => {
                            const isSelected = (data as any).youtubeMusicLink === song.url;
                            const isPreviewing = previewSongUrl === song.url;

                            return (
                              <div 
                                key={song.id} 
                                onClick={() => handleDataChange('youtubeMusicLink' as any, song.url)}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-amber-50 border border-amber-200' : 'hover:bg-zinc-100 border border-transparent'}`}
                              >
                                <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 group">
                                  <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                                  <div 
                                    onClick={(e) => {
                                      e.stopPropagation(); 
                                      setPreviewSongUrl(isPreviewing ? null : song.url);
                                    }}
                                    className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${isPreviewing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                  >
                                    {isPreviewing ? (
                                      <PauseCircle className="w-6 h-6 text-white animate-pulse" />
                                    ) : (
                                      <PlayCircle className="w-6 h-6 text-white" />
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold truncate ${isPreviewing ? 'text-amber-600' : 'text-zinc-800'}`}>
                                    {song.title}
                                  </p>
                                  <p className="text-xs text-zinc-500 truncate">{song.artist}</p>
                                </div>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />}
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-center py-6 text-zinc-400">
                            <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">No se encontraron resultados.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <hr className="border-zinc-200" />
                    
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">¿No está en la lista? Pega el enlace de YouTube:</label>
                      <Input 
                        value={(data as any).youtubeMusicLink || ''} 
                        onChange={e => handleDataChange('youtubeMusicLink' as any, e.target.value)} 
                        placeholder="https://youtu.be/..." 
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'rsvp' && (
                  <div className="space-y-4 animate-in fade-in">
                    <h3 className="font-bold text-sm text-zinc-800">Confirmaciones ({rsvpResponses.length})</h3>
                    {rsvpResponses.map(rsvp => (
                      <div key={rsvp.id} className="p-3 bg-zinc-50 border rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-zinc-800">{rsvp.guestName}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rsvp.attending ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {rsvp.attending ? 'CONFIRMADO' : 'DECLINADO'}
                          </span>
                        </div>
                        {rsvp.additionalNotes && <p className="text-xs text-zinc-500 mt-1">Notas: {rsvp.additionalNotes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {previewSongUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="bg-zinc-900 border-t-4 border-amber-500 p-3 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                        Audio de Previsualización
                      </span>
                    </div>
                    <button onClick={() => setPreviewSongUrl(null)} className="text-zinc-400 hover:text-white transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="rounded overflow-hidden bg-black aspect-[4/1]">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYouTubeId(previewSongUrl)}?autoplay=1`}
                      allow="autoplay; encrypted-media"
                      title="Reproductor YouTube"
                      className="border-0"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 border-t bg-zinc-50 z-50">
              <Button onClick={handlePublish} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold flex gap-2 transition-colors">
                <Save className="h-4 w-4" /> {isSaving ? 'Sincronizando...' : 'Publicar Cambios'}
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 relative flex flex-col min-w-0 bg-zinc-300">
        
        <div className="h-12 bg-zinc-800 flex items-center justify-between px-4 z-10 shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono text-zinc-400 tracking-wider">render_engine: active</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)} className="text-xs text-zinc-300 hover:text-white hover:bg-zinc-700 h-8">
            {isPreviewMode ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {isPreviewMode ? 'Restaurar Entorno' : 'Maximizar Render'}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-0 md:p-8 custom-scrollbar">
          <div className="w-full max-w-[500px] md:max-w-4xl mx-auto bg-white shadow-2xl rounded-sm ring-1 ring-black/10 transition-all relative min-h-max pb-20">
            
            {!invitationId ? (
              <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm p-6 text-center h-[500px]">
                <Settings className="h-12 w-12 text-zinc-400 mb-4 animate-spin-slow" />
                <h3 className="text-xl font-bold text-zinc-800 mb-2">Entorno no inicializado</h3>
                <p className="text-zinc-600 mb-6 max-w-md">No tienes un ID de invitación activo. Ve a la pestaña de Ajustes en el panel izquierdo para crear una nueva invitación.</p>
                <Button onClick={() => setActiveTab('settings')} className="bg-blue-600 hover:bg-blue-700">Ir a Ajustes</Button>
              </div>
            ) : null}

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
