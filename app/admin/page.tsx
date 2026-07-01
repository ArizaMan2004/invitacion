'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  PlayCircle,
  Download,
  Eye,
  X,
  FileText,
  FileSpreadsheet,
  FileType,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Ticket,
  Search,
  AlertTriangle,
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
  TriviaResult,
} from '@/lib/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { runExport, ExportColumn, ExportFormat } from '@/lib/exporters';

type TabId = 'dashboard' | 'rsvp' | 'media' | 'messages' | 'trivia';

const TABS: { id: TabId; label: string; short: string; icon: any }[] = [
  { id: 'dashboard', label: 'Resumen', short: 'Inicio', icon: BarChart3 },
  { id: 'rsvp', label: 'Asistencias y Pases', short: 'RSVP', icon: Users },
  { id: 'media', label: 'Fotos y Videos', short: 'Fotos', icon: ImageIcon },
  { id: 'messages', label: 'Mensajes', short: 'Mensajes', icon: MessageSquare },
  { id: 'trivia', label: 'Trivia', short: 'Trivia', icon: Gamepad2 },
];

const isVideoUrl = (url?: string) => {
  if (!url) return false;
  return url.includes('.mp4') || url.includes('.mov') || url.includes('/video/');
};
const thumb = (url?: string, w = 400) => {
  if (!url || !url.includes('/upload/')) return url || '';
  return url.replace('/upload/', `/upload/w_${w},c_fill,q_auto,f_auto/`);
};
const dedupeById = <T extends { id?: string }>(arr: T[]): T[] => {
  const map = new Map<string, T>();
  for (const x of arr) if (x?.id && !map.has(x.id)) map.set(x.id, x);
  return [...map.values()];
};
const fmtDate = (v?: string) => (v ? new Date(v).toLocaleString() : '—');
const normalize = (s?: string) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();

// Lectura de campos de un registro RSVP
const getAssignedPasses = (r: any): number | null => (typeof r.passes === 'number' ? r.passes : null);
const getPeople = (r: any): number => Number(r.adult_count) || 0;

const messageColumns: ExportColumn<any>[] = [
  { header: 'Nombre', accessor: (m) => m.guest_name },
  { header: 'Email', accessor: (m) => m.guest_email },
  { header: 'Mensaje', accessor: (m) => m.message },
  { header: 'Estado', accessor: (m) => (m.approved ? 'Publicado' : 'Pendiente') },
  { header: 'Fecha', accessor: (m) => fmtDate(m.created_at) },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<{ userId: string; email: string | null } | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const [rsvps, setRsvps] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [triviaResults, setTriviaResults] = useState<TriviaResult[]>([]);

  const [loadingData, setLoadingData] = useState(false);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [actionError, setActionError] = useState('');

  const [processingPhotos, setProcessingPhotos] = useState<Set<string>>(new Set());
  const [processingMsgs, setProcessingMsgs] = useState<Set<string>>(new Set());
  const [savingPasses, setSavingPasses] = useState<Set<string>>(new Set());
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ kind: 'rsvp' | 'message'; data: any } | null>(null);

  // Búsqueda / filtro / orden de la pestaña de asistencias
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'attending' | 'declined' | 'unassigned' | 'over'>('all');
  const [rsvpSort, setRsvpSort] = useState<'name' | 'passes' | 'recent'>('name');

  const pendingPhotos = useMemo(() => photos.filter((p) => !p.approved), [photos]);
  const approvedPhotos = useMemo(() => photos.filter((p) => p.approved), [photos]);
  const pendingMessages = useMemo(() => messages.filter((m) => !m.approved), [messages]);
  const approvedMessages = useMemo(() => messages.filter((m) => m.approved), [messages]);

  const selectedIndex = selectedPhotoId ? approvedPhotos.findIndex((p) => p.id === selectedPhotoId) : -1;
  const selectedPhoto = selectedIndex >= 0 ? approvedPhotos[selectedIndex] : null;

  // --- Auditoría de pases sobre los registrados ---
  const isOver = useCallback((r: any) => {
    const a = getAssignedPasses(r);
    return !!r.attending && a !== null && getPeople(r) > a;
  }, []);

  const attendingCount = useMemo(() => rsvps.filter((r) => r.attending).length, [rsvps]);
  const peopleConfirmed = useMemo(
    () => rsvps.filter((r) => r.attending).reduce((s, r) => s + getPeople(r), 0),
    [rsvps]
  );
  const passesAssigned = useMemo(
    () => rsvps.reduce((s, r) => s + (getAssignedPasses(r) ?? 0), 0),
    [rsvps]
  );
  const unassignedCount = useMemo(
    () => rsvps.filter((r) => r.attending && getAssignedPasses(r) === null).length,
    [rsvps]
  );
  const overCount = useMemo(() => rsvps.filter(isOver).length, [rsvps, isOver]);

  const filteredRsvps = useMemo(() => {
    const q = normalize(rsvpSearch);
    let list = q ? rsvps.filter((r) => normalize(r.guest_name).includes(q)) : [...rsvps];

    if (rsvpFilter !== 'all') {
      list = list.filter((r) => {
        if (rsvpFilter === 'attending') return !!r.attending;
        if (rsvpFilter === 'declined') return !r.attending;
        if (rsvpFilter === 'unassigned') return r.attending && getAssignedPasses(r) === null;
        if (rsvpFilter === 'over') return isOver(r);
        return true;
      });
    }

    list.sort((a, b) => {
      if (rsvpSort === 'passes') return (getAssignedPasses(b) ?? -1) - (getAssignedPasses(a) ?? -1);
      if (rsvpSort === 'recent') return (b.created_at || '').localeCompare(a.created_at || '');
      return (a.guest_name || '').localeCompare(b.guest_name || '', 'es');
    });
    return list;
  }, [rsvps, rsvpSearch, rsvpFilter, rsvpSort, isOver]);

  // Documentos administrativos (sin texto libre de invitados)
  const rsvpExportColumns: ExportColumn<any>[] = useMemo(
    () => [
      { header: 'Nombre', accessor: (r) => r.guest_name },
      { header: 'Asiste', accessor: (r) => (r.attending ? 'Sí' : 'No') },
      { header: 'Personas confirmadas', accessor: (r) => getPeople(r) },
      { header: 'Pases asignados', accessor: (r) => (getAssignedPasses(r) ?? 'Sin asignar') },
      { header: 'Email', accessor: (r) => r.guest_email },
      { header: 'Teléfono', accessor: (r) => r.guest_phone },
      { header: 'Restricciones', accessor: (r) => r.dietary_restrictions },
      { header: 'Fecha', accessor: (r) => fmtDate(r.created_at) },
    ],
    []
  );

  const loadDashboardData = useCallback(async () => {
    setLoadingData(true);
    setLoadErrors([]);

    const tasks = [
      { label: 'Asistencias', run: getAllRSVPResponses },
      { label: 'Fotos aprobadas', run: getAllApprovedGuestPhotos },
      { label: 'Fotos pendientes', run: getAllPendingGuestPhotos },
      { label: 'Mensajes aprobados', run: () => getAllGuestMessages(true) },
      { label: 'Mensajes pendientes', run: () => getAllGuestMessages(false) },
      { label: 'Trivia', run: getAllTriviaResults },
    ];

    const results = await Promise.allSettled(tasks.map((t) => t.run()));
    const errors: string[] = [];
    const val = (i: number, fallback: any[] = []) =>
      results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<any>).value : fallback;

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[Admin] Falló "${tasks[i].label}":`, r.reason);
        errors.push(tasks[i].label);
      }
    });

    setRsvps(val(0));
    setPhotos(dedupeById([...val(2), ...val(1)]));
    setMessages(dedupeById([...val(4), ...val(3)]));
    setTriviaResults(val(5));
    setLoadErrors(errors);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const s = await getAdminSession();
      if (!active) return;
      if (!s) router.push('/login');
      else {
        setSession(s);
        loadDashboardData();
      }
      setLoadingSession(false);
    })();
    return () => {
      active = false;
    };
  }, [router, loadDashboardData]);

  useEffect(() => {
    if (!selectedPhotoId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhotoId(null);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const len = approvedPhotos.length;
        if (!len) return;
        const dir = e.key === 'ArrowLeft' ? -1 : 1;
        setSelectedPhotoId(approvedPhotos[(selectedIndex + dir + len) % len]?.id ?? null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedPhotoId, selectedIndex, approvedPhotos]);

  const handleLogout = async () => {
    await clearAdminSession();
    router.push('/login');
  };

  // --- Asignar / ajustar pases sobre el registro RSVP ---
  const handleSetPasses = useCallback(
    async (id: string, value: number) => {
      const v = Math.max(0, Math.floor(value) || 0);
      setSavingPasses((s) => new Set(s).add(id));
      setActionError('');
      let snapshot: any[] = [];
      setRsvps((prev) => {
        snapshot = prev;
        return prev.map((r) => (r.id === id ? { ...r, passes: v } : r));
      });
      setDetail((d) => (d && d.kind === 'rsvp' && d.data.id === id ? { ...d, data: { ...d.data, passes: v } } : d));
      try {
        await updateDoc(doc(db, 'rsvp_responses', id), { passes: v });
      } catch (e) {
        console.error('[Admin] No se pudo guardar pases:', e);
        setRsvps(snapshot);
        setActionError('No se pudieron guardar los pases.');
      } finally {
        setSavingPasses((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
      }
    },
    []
  );

  const handlePhotoApprove = async (id: string) => {
    if (processingPhotos.has(id)) return;
    setActionError('');
    setProcessingPhotos((s) => new Set(s).add(id));
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, approved: true } : p)));
    const ok = await approveGuestPhoto(id, true);
    if (!ok) {
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, approved: false } : p)));
      setActionError('No se pudo aprobar la foto. Reintenta.');
    }
    setProcessingPhotos((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  const handlePhotoDelete = async (id: string) => {
    if (!confirm('¿Eliminar permanentemente este archivo?')) return;
    setActionError('');
    const snap = photos;
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (selectedPhotoId === id) setSelectedPhotoId(null);
    try {
      await deleteDoc(doc(db, 'guest_photos', id));
    } catch (e) {
      console.error(e);
      setPhotos(snap);
      setActionError('No se pudo eliminar la foto.');
    }
  };

  const handleMessageApprove = async (id: string) => {
    if (processingMsgs.has(id)) return;
    setActionError('');
    setProcessingMsgs((s) => new Set(s).add(id));
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, approved: true } : m)));
    const ok = await approveGuestMessage(id, true);
    if (!ok) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, approved: false } : m)));
      setActionError('No se pudo aprobar el mensaje. Reintenta.');
    }
    setProcessingMsgs((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  const handleMessageDelete = async (id: string) => {
    if (!confirm('¿Eliminar permanentemente este mensaje?')) return;
    setActionError('');
    const snap = messages;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (detail?.data?.id === id) setDetail(null);
    try {
      await deleteDoc(doc(db, 'guest_messages', id));
    } catch (e) {
      console.error(e);
      setMessages(snap);
      setActionError('No se pudo eliminar el mensaje.');
    }
  };

  const handleRsvpDelete = async (id: string) => {
    if (!confirm('¿Eliminar este registro de asistencia?')) return;
    const snap = rsvps;
    setRsvps((prev) => prev.filter((r) => r.id !== id));
    if (detail?.data?.id === id) setDetail(null);
    try {
      await deleteDoc(doc(db, 'rsvp_responses', id));
    } catch (e) {
      console.error(e);
      setRsvps(snap);
      setActionError('No se pudo eliminar el registro.');
    }
  };

  if (loadingSession || !session) {
    return (
      <div className="min-h-screen bg-[#090d09] flex items-center justify-center text-[#fcfcf0]">
        <RefreshCw className="w-10 h-10 animate-spin text-[#b8860b]" />
      </div>
    );
  }

  const headerTitle =
    activeTab === 'dashboard'
      ? 'Panel de Resumen'
      : activeTab === 'rsvp'
      ? 'Asistencias y Pases'
      : activeTab === 'media'
      ? 'Moderación de Galería'
      : activeTab === 'messages'
      ? 'Libro de Buenos Deseos'
      : 'Resultados de la Trivia';

  return (
    <div className="min-h-screen bg-[#090d09] text-[#fcfcf0] font-sans antialiased md:flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-[#121912] border-r border-white/5 p-6 flex-col justify-between gap-6 sticky top-0 h-screen">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#b8860b] tracking-wide">Mis 15 Años</h1>
            <p className="text-xs text-[#a0b0a0]/60 mt-1">Panel de Control General</p>
          </div>
          <nav className="space-y-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const badge =
                tab.id === 'media' ? pendingPhotos.length : tab.id === 'rsvp' ? unassignedCount : tab.id === 'messages' ? pendingMessages.length : 0;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-[#b8860b] text-[#121912] font-semibold' : 'hover:bg-white/5 text-[#a0b0a0]'}`}>
                  <div className="flex items-center gap-3"><Icon className="w-5 h-5" /><span>{tab.label}</span></div>
                  {badge > 0 && <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-[#121912] text-[#b8860b]' : 'bg-[#b8860b]/20 text-[#b8860b]'}`}>{badge}</span>}
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

      {/* Top bar móvil */}
      <div className="md:hidden sticky top-0 z-30 bg-[#121912]/95 backdrop-blur border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-serif font-bold text-[#b8860b] leading-none">Mis 15 Años</h1>
          <p className="text-[10px] text-[#a0b0a0]/50 mt-0.5">{headerTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadDashboardData} disabled={loadingData} className="p-2.5 rounded-xl bg-white/5 active:bg-white/10 text-white"><RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} /></button>
          <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/20 text-red-200"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <main className="flex-1 p-4 sm:p-6 md:p-12 pb-28 md:pb-12 overflow-y-auto md:max-h-screen">
        <header className="hidden md:flex items-center justify-between gap-4 mb-10">
          <h2 className="text-3xl font-serif text-[#ffd700] uppercase tracking-wider">{headerTitle}</h2>
          <Button onClick={loadDashboardData} disabled={loadingData} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full gap-2">
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} /> Sincronizar Datos
          </Button>
        </header>

        {(loadErrors.length > 0 || actionError) && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-950/40 px-5 py-3 text-sm text-red-200">
            {actionError && <p>{actionError}</p>}
            {loadErrors.length > 0 && <p>No se pudieron cargar: {loadErrors.join(', ')}. Revisa la consola (F12).</p>}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {/* ---------- DASHBOARD ---------- */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                <StatsCard title="Registrados" value={rsvps.length} subValue={`${attendingCount} asistirán`} icon={<Users className="w-6 h-6 text-[#b8860b]" />} />
                <StatsCard title="Pases asignados" value={passesAssigned} subValue={`${unassignedCount} sin asignar`} icon={<Ticket className="w-6 h-6 text-[#b8860b]" />} />
                <StatsCard title="Personas confirmadas" value={peopleConfirmed} subValue={`${overCount} exceden pases`} icon={<CheckCircle2 className="w-6 h-6 text-[#b8860b]" />} />
                <StatsCard title="Fotos" value={photos.length} subValue={`${pendingPhotos.length} pendientes`} icon={<ImageIcon className="w-6 h-6 text-[#b8860b]" />} />
                <StatsCard title="Dedicatorias" value={messages.length} subValue={`${pendingMessages.length} sin moderar`} icon={<MessageSquare className="w-6 h-6 text-[#b8860b]" />} />
                <StatsCard title="Trivia" value={triviaResults.length} subValue="Ranking activo" icon={<Gamepad2 className="w-6 h-6 text-[#b8860b]" />} />
              </div>
            )}

            {/* ---------- ASISTENCIAS Y PASES ---------- */}
            {activeTab === 'rsvp' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <MiniStat label="Registrados" value={rsvps.length} />
                  <MiniStat label="Pases asignados" value={passesAssigned} accent />
                  <MiniStat label="Personas confirmadas" value={peopleConfirmed} tone="ok" />
                  <MiniStat label="Sin pases" value={unassignedCount} tone="muted" />
                </div>

                {overCount > 0 && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {overCount} registro(s) confirmaron más personas de las que tienen pases asignados.
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#a0b0a0]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input value={rsvpSearch} onChange={(e) => setRsvpSearch(e.target.value)} placeholder="Buscar registrado..." className="w-full bg-[#121912] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#a0b0a0]/40 focus:outline-none focus:border-[#b8860b]/50" />
                  </div>
                  <ExportMenu rows={rsvps} columns={rsvpExportColumns} filename="asistencias_y_pases" title="Asistencias y Pases" disabled={rsvps.length === 0} />
                </div>

                {rsvps.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {([
                      ['all', 'Todos'],
                      ['attending', 'Asisten'],
                      ['declined', 'No asisten'],
                      ['unassigned', 'Sin pases'],
                      ['over', 'Exceden pases'],
                    ] as const).map(([key, label]) => (
                      <button key={key} onClick={() => setRsvpFilter(key)} className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${rsvpFilter === key ? 'bg-[#b8860b] text-[#121912] border-[#b8860b]' : 'bg-transparent text-[#a0b0a0] border-white/10 hover:border-white/20'}`}>
                        {label}
                      </button>
                    ))}
                    <div className="ml-auto shrink-0">
                      <select value={rsvpSort} onChange={(e) => setRsvpSort(e.target.value as any)} className="bg-[#121912] border border-white/10 rounded-full px-3 py-1.5 text-xs text-[#a0b0a0] focus:outline-none focus:border-[#b8860b]/50">
                        <option value="name">Orden: Nombre</option>
                        <option value="passes">Orden: Más pases</option>
                        <option value="recent">Orden: Recientes</option>
                      </select>
                    </div>
                  </div>
                )}

                {rsvps.length === 0 ? (
                  <EmptyState text="Aún no hay registros en el formulario RSVP." />
                ) : filteredRsvps.length === 0 ? (
                  <EmptyState text="Ningún registro coincide con el filtro." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {filteredRsvps.map((rsvp) => {
                      const assigned = getAssignedPasses(rsvp);
                      const people = getPeople(rsvp);
                      const over = isOver(rsvp);
                      const saving = savingPasses.has(rsvp.id);
                      return (
                        <div key={rsvp.id} className={`bg-[#121912] border rounded-2xl p-4 sm:p-5 flex flex-col gap-3 ${over ? 'border-amber-500/40' : 'border-white/5'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate">{rsvp.guest_name || 'Sin nombre'}</p>
                              <span className={`inline-flex mt-1.5 items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${rsvp.attending ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {rsvp.attending ? `Asiste · ${people} pers.` : 'No asiste'}
                              </span>
                            </div>
                          </div>

                          {/* Asignación de pases */}
                          <div className="flex items-center justify-between gap-2 bg-black/20 rounded-xl px-3 py-2">
                            <div className="flex items-center gap-1.5 text-[#a0b0a0]">
                              <Ticket className="w-4 h-4" />
                              <span className="text-xs font-semibold uppercase tracking-wide">Pases</span>
                            </div>
                            <PassesStepper assigned={assigned} suggested={people || 1} saving={saving} onCommit={(n) => handleSetPasses(rsvp.id, n)} />
                          </div>

                          <div className="flex items-center gap-2 flex-wrap min-h-[1px]">
                            {assigned === null && rsvp.attending && (
                              <span className="text-[10px] font-bold text-[#a0b0a0]/60 uppercase tracking-wide">Sin pases asignados</span>
                            )}
                            {over && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300">
                                <AlertTriangle className="w-3 h-3" /> Confirmó {people}, tiene {assigned}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
                            <button onClick={() => setDetail({ kind: 'rsvp', data: rsvp })} className="flex items-center gap-1.5 text-xs font-semibold text-[#b8860b] hover:text-[#ffd700] active:opacity-70 px-3 py-2 rounded-lg bg-[#b8860b]/10"><Eye className="w-4 h-4" /> Ver detalles</button>
                            <button onClick={() => handleRsvpDelete(rsvp.id)} className="text-red-400 hover:text-red-300 active:opacity-70 p-2"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ---------- MEDIA ---------- */}
            {activeTab === 'media' && (
              <div className="space-y-10">
                {pendingPhotos.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-amber-400 mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Por Aprobar ({pendingPhotos.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {pendingPhotos.map((photo) => {
                        const busy = processingPhotos.has(photo.id);
                        return (
                          <div key={photo.id} className="group relative aspect-square bg-black/40 rounded-2xl overflow-hidden border border-amber-500/30">
                            {isVideoUrl(photo.url) ? (
                              <div className="w-full h-full flex items-center justify-center bg-black/80"><PlayCircle className="w-12 h-12 text-amber-500" /></div>
                            ) : (
                              <img src={thumb(photo.url)} alt="Pendiente" loading="lazy" className="w-full h-full object-cover" />
                            )}
                            <div className={`absolute inset-0 bg-black/70 transition-opacity flex flex-col justify-between p-3 z-10 ${busy ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              <p className="text-xs font-semibold truncate">{photo.guest_name}</p>
                              <div className="flex gap-2">
                                <button onClick={() => handlePhotoApprove(photo.id)} disabled={busy} className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 p-2 rounded-xl flex items-center justify-center">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}</button>
                                <button onClick={() => handlePhotoDelete(photo.id)} disabled={busy} className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 p-2 rounded-xl flex items-center justify-center"><XCircle className="w-4 h-4" /></button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#b8860b] mb-4">Aprobados e Imprimibles ({approvedPhotos.length})</h3>
                  {approvedPhotos.length === 0 ? (
                    <p className="text-sm text-[#a0b0a0]/50">Aún no hay fotos aprobadas.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {approvedPhotos.map((photo) => (
                        <div key={photo.id} onClick={() => setSelectedPhotoId(photo.id)} className="group relative aspect-square bg-black/20 rounded-2xl overflow-hidden border border-white/5 cursor-pointer active:scale-95 transition-all">
                          {isVideoUrl(photo.url) ? (
                            <div className="w-full h-full flex items-center justify-center bg-black/40"><PlayCircle className="w-10 h-10 text-white/40" /></div>
                          ) : (
                            <img src={thumb(photo.url)} alt="Galería" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 p-3 opacity-0 group-hover:opacity-100 transition-opacity"><p className="text-xs font-medium truncate">{photo.guest_name}</p></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------- MENSAJES ---------- */}
            {activeTab === 'messages' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-[#a0b0a0]">{messages.length} dedicatoria(s) · {pendingMessages.length} pendientes</p>
                  <ExportMenu rows={messages} columns={messageColumns} filename="dedicatorias" title="Libro de Buenos Deseos" disabled={messages.length === 0} />
                </div>
                {pendingMessages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-amber-400 mb-4">Pendientes de Publicación</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {pendingMessages.map((msg) => {
                        const busy = processingMsgs.has(msg.id);
                        return (
                          <div key={msg.id} className="bg-amber-500/5 border border-amber-500/20 p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3">
                            <div className="space-y-2">
                              <p className="text-sm italic text-amber-100 line-clamp-3">&ldquo;{msg.message}&rdquo;</p>
                              <p className="text-xs font-bold text-[#b8860b]">De: {msg.guest_name}</p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <button onClick={() => setDetail({ kind: 'message', data: msg })} className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 active:opacity-70 px-2.5 py-2 rounded-lg bg-amber-500/10"><Eye className="w-4 h-4" /> Ver completo</button>
                              <div className="flex gap-2">
                                <Button onClick={() => handleMessageApprove(msg.id)} disabled={busy} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 size-9 p-0 rounded-lg">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}</Button>
                                <Button onClick={() => handleMessageDelete(msg.id)} disabled={busy} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 size-9 p-0 rounded-lg"><XCircle className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-[#b8860b] mb-4">Visibles en el Muro Público</h3>
                  {approvedMessages.length === 0 ? (
                    <EmptyState text="Aún no hay mensajes publicados." />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                      {approvedMessages.map((msg) => (
                        <div key={msg.id} className="bg-[#121912] border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3 group relative">
                          <div className="space-y-2">
                            <p className="text-sm text-[#a0b0a0] line-clamp-4">&ldquo;{msg.message}&rdquo;</p>
                            <p className="text-xs font-bold text-[#ffd700]">— {msg.guest_name}</p>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <button onClick={() => setDetail({ kind: 'message', data: msg })} className="flex items-center gap-1.5 text-xs font-semibold text-[#b8860b] active:opacity-70 px-2.5 py-2 rounded-lg bg-[#b8860b]/10"><Eye className="w-4 h-4" /> Ver completo</button>
                            <button onClick={() => handleMessageDelete(msg.id)} className="text-red-400 hover:text-red-300 active:opacity-70 p-2"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------- TRIVIA ---------- */}
            {activeTab === 'trivia' && (
              <div className="bg-[#121912] border border-white/5 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[480px]">
                    <thead>
                      <tr className="border-b border-white/5 bg-black/20 text-xs font-semibold uppercase tracking-wider text-[#a0b0a0]/70">
                        <th className="p-4 sm:p-5">Pos.</th>
                        <th className="p-4 sm:p-5">Invitado</th>
                        <th className="p-4 sm:p-5">Gemelo</th>
                        <th className="p-4 sm:p-5 text-center">Puntaje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {triviaResults.map((result, idx) => (
                        <tr key={result.id} className="hover:bg-white/[0.01]">
                          <td className="p-4 sm:p-5 font-bold text-[#b8860b]"># {idx + 1}</td>
                          <td className="p-4 sm:p-5 font-medium text-white">{result.guest_name}</td>
                          <td className="p-4 sm:p-5 uppercase tracking-wider text-xs">{result.twin_selected}</td>
                          <td className="p-4 sm:p-5 text-center font-mono font-bold text-[#ffd700]">{result.score} / {result.total_questions || 3}</td>
                        </tr>
                      ))}
                      {triviaResults.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-[#a0b0a0]/50">Aún no hay participantes.</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Visor de foto */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPhotoId(null)} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 sm:p-4">
              <button onClick={() => setSelectedPhotoId(null)} className="absolute top-4 right-4 text-white/60 hover:text-white p-3 z-50"><X className="w-7 h-7" /></button>
              <button onClick={(e) => { e.stopPropagation(); const len = approvedPhotos.length; setSelectedPhotoId(approvedPhotos[(selectedIndex - 1 + len) % len]?.id ?? null); }} className="absolute left-1 sm:left-6 p-3 sm:p-5 text-white/30 hover:text-white bg-white/5 rounded-full z-50"><ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9" /></button>
              <div onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-4 w-full px-10 sm:px-12">
                {isVideoUrl(selectedPhoto.url) ? (
                  <video src={selectedPhoto.url} controls className="max-h-[65vh] rounded-2xl shadow-2xl" />
                ) : (
                  <img src={selectedPhoto.url} alt="Vista completa" className="max-h-[65vh] object-contain rounded-2xl shadow-2xl" />
                )}
                <div className="flex w-full justify-between items-center bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{selectedPhoto.guest_name}</p>
                    <p className="text-xs text-[#a0b0a0]">{fmtDate(selectedPhoto.created_at)}</p>
                  </div>
                  <Button onClick={() => handlePhotoDelete(selectedPhoto.id)} className="border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-5 py-5 rounded-full whitespace-nowrap">Eliminar</Button>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); const len = approvedPhotos.length; setSelectedPhotoId(approvedPhotos[(selectedIndex + 1) % len]?.id ?? null); }} className="absolute right-1 sm:right-6 p-3 sm:p-5 text-white/30 hover:text-white bg-white/5 rounded-full z-50"><ChevronRight className="w-7 h-7 sm:w-9 sm:h-9" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <DetailModal
          detail={detail}
          saving={detail?.kind === 'rsvp' ? savingPasses.has(detail.data.id) : false}
          onClose={() => setDetail(null)}
          onDelete={(kind, id) => (kind === 'rsvp' ? handleRsvpDelete(id) : handleMessageDelete(id))}
          onSetPasses={handleSetPasses}
        />
      </main>

      {/* Bottom nav móvil */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#121912]/95 backdrop-blur-lg border-t border-white/10 flex pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          const badge = tab.id === 'media' ? pendingPhotos.length : tab.id === 'messages' ? pendingMessages.length : tab.id === 'rsvp' ? unassignedCount : 0;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex-1 relative flex flex-col items-center justify-center gap-1 py-2.5 active:scale-95 transition-transform">
              {active && <motion.span layoutId="navActive" className="absolute -top-px h-0.5 w-8 rounded-full bg-[#b8860b]" />}
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'text-[#b8860b]' : 'text-[#a0b0a0]/60'}`} />
                {badge > 0 && <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{badge}</span>}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-[#b8860b]' : 'text-[#a0b0a0]/50'}`}>{tab.short}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ===================== Componentes auxiliares =====================

function EmptyState({ text }: { text: string }) {
  return <div className="bg-[#121912] border border-white/5 rounded-2xl p-8 text-center text-sm text-[#a0b0a0]/50">{text}</div>;
}

function MiniStat({ label, value, tone, accent }: { label: string; value: number; tone?: 'ok' | 'muted'; accent?: boolean }) {
  const color = accent ? 'text-[#ffd700]' : tone === 'ok' ? 'text-emerald-400' : tone === 'muted' ? 'text-[#a0b0a0]' : 'text-white';
  return (
    <div className="bg-[#121912] border border-white/5 rounded-2xl p-3 sm:p-4">
      <p className="text-[10px] uppercase tracking-widest text-[#a0b0a0]/50 font-semibold">{label}</p>
      <p className={`text-2xl sm:text-3xl font-mono font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function StatsCard({ title, value, subValue, icon }: { title: string; value: number; subValue: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#121912] p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-white/5 shadow-2xl space-y-3 sm:space-y-4 hover:border-[#b8860b]/20 transition-all group">
      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#a0b0a0]/50">{title}</p>
        <h4 className="text-2xl sm:text-4xl font-mono font-bold text-[#ffd700] mt-1">{value}</h4>
        <p className="text-[10px] sm:text-xs text-[#a0b0a0]/60 mt-1">{subValue}</p>
      </div>
    </div>
  );
}

function PassesStepper({
  assigned,
  suggested,
  saving,
  onCommit,
}: {
  assigned: number | null;
  suggested: number;
  saving: boolean;
  onCommit: (n: number) => void;
}) {
  const shown = assigned ?? suggested ?? 0;
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => onCommit(Math.max(0, shown - 1))} disabled={saving} className="w-8 h-8 rounded-lg bg-white/5 text-white text-lg leading-none active:scale-90 disabled:opacity-40 flex items-center justify-center">−</button>
      <div className={`min-w-[2.5rem] text-center font-bold tabular-nums ${assigned === null ? 'text-[#a0b0a0]/50 italic' : 'text-[#ffd700]'}`}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-[#ffd700]" /> : shown}
      </div>
      <button onClick={() => onCommit(shown + 1)} disabled={saving} className="w-8 h-8 rounded-lg bg-white/5 text-white text-lg leading-none active:scale-90 disabled:opacity-40 flex items-center justify-center">+</button>
    </div>
  );
}

const EXPORT_OPTIONS: { format: ExportFormat; label: string; icon: any; color: string }[] = [
  { format: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet, color: 'text-emerald-400' },
  { format: 'pdf', label: 'PDF (imprimir)', icon: FileText, color: 'text-red-400' },
  { format: 'word', label: 'Word (.docx)', icon: FileType, color: 'text-blue-400' },
  { format: 'csv', label: 'CSV (.csv)', icon: Download, color: 'text-[#a0b0a0]' },
];

function ExportMenu({ rows, columns, filename, title, disabled }: { rows: any[]; columns: ExportColumn<any>[]; filename: string; title: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const handle = async (format: ExportFormat) => {
    setBusy(format);
    try {
      await runExport(format, rows, columns, filename, title);
      setOpen(false);
    } catch (e) {
      console.error('[Export] error:', e);
      alert('No se pudo generar el archivo. ¿Instalaste las dependencias (xlsx, docx)?');
    } finally {
      setBusy(null);
    }
  };
  return (
    <div className="relative shrink-0">
      <Button onClick={() => setOpen((o) => !o)} disabled={disabled} className="bg-[#b8860b] hover:bg-[#caa022] disabled:opacity-40 text-[#121912] font-semibold rounded-full gap-2 px-4">
        <Download className="w-4 h-4" /> Descargar
      </Button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-56 z-50 bg-[#1a221a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5">
              <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#a0b0a0]/40 font-semibold">Formato de descarga</p>
              {EXPORT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isBusy = busy === opt.format;
                return (
                  <button key={opt.format} onClick={() => handle(opt.format)} disabled={!!busy} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white hover:bg-white/5 disabled:opacity-50 transition-colors">
                    {isBusy ? <Loader2 className={`w-4 h-4 animate-spin ${opt.color}`} /> : <Icon className={`w-4 h-4 ${opt.color}`} />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#a0b0a0]/50 font-semibold">{icon}{label}</span>
      <span className="text-sm text-white break-words whitespace-pre-wrap">{value}</span>
    </div>
  );
}

function DetailModal({
  detail,
  saving,
  onClose,
  onDelete,
  onSetPasses,
}: {
  detail: { kind: 'rsvp' | 'message'; data: any } | null;
  saving: boolean;
  onClose: () => void;
  onDelete: (kind: 'rsvp' | 'message', id: string) => void;
  onSetPasses: (id: string, n: number) => void;
}) {
  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detail, onClose]);

  return (
    <AnimatePresence>
      {detail && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-lg bg-[#141a14] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#b8860b] font-bold">{detail.kind === 'rsvp' ? 'Registro de Asistencia' : 'Dedicatoria'}</p>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">{detail.data.guest_name || 'Sin nombre'}</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-[#a0b0a0] hover:text-white active:scale-90 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {detail.kind === 'rsvp' ? (
                <>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${detail.data.attending ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{detail.data.attending ? 'Asistirá al evento' : 'No podrá asistir'}</span>

                  {/* Asignación de pases dentro del detalle */}
                  <div className="flex items-center justify-between gap-3 bg-black/20 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#a0b0a0]/50 font-semibold">Pases asignados</p>
                      <p className="text-xs text-[#a0b0a0]/70 mt-0.5">Confirmó {getPeople(detail.data)} persona(s)</p>
                    </div>
                    <PassesStepper assigned={getAssignedPasses(detail.data)} suggested={getPeople(detail.data) || 1} saving={saving} onCommit={(n) => onSetPasses(detail.data.id, n)} />
                  </div>

                  <DetailRow icon={<Mail className="w-3 h-3" />} label="Email" value={detail.data.guest_email} />
                  <DetailRow icon={<Phone className="w-3 h-3" />} label="Teléfono" value={detail.data.guest_phone} />
                  <DetailRow label="Restricciones alimentarias" value={detail.data.dietary_restrictions} />
                  <DetailRow label="Notas / Mensaje del invitado" value={detail.data.additional_notes} />
                  <DetailRow icon={<Calendar className="w-3 h-3" />} label="Fecha de respuesta" value={fmtDate(detail.data.created_at)} />
                </>
              ) : (
                <>
                  <DetailRow label="Mensaje completo" value={detail.data.message} />
                  <DetailRow icon={<Mail className="w-3 h-3" />} label="Email" value={detail.data.guest_email} />
                  <DetailRow label="Estado" value={detail.data.approved ? 'Publicado en el muro' : 'Pendiente de aprobación'} />
                  <DetailRow icon={<Calendar className="w-3 h-3" />} label="Fecha" value={fmtDate(detail.data.created_at)} />
                </>
              )}
            </div>

            <div className="p-5 border-t border-white/5 flex gap-3">
              <Button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl">Cerrar</Button>
              <Button onClick={() => onDelete(detail.kind, detail.data.id)} className="bg-red-600 hover:bg-red-500 text-white rounded-xl gap-2 px-5"><Trash2 className="w-4 h-4" /> Eliminar</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
