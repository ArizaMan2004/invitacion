import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { RSVPResponse, GuestPhoto, GuestMessage } from './types';

export interface TriviaResult {
  id: string;
  invitation_id: string;
  guest_name: string;
  twin_selected: string;
  score: number;
  total_questions: number;
  created_at: string;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// ==========================================
// Helpers (orden en memoria => sin índices compuestos)
// ==========================================

const ts = (v: any): number => {
  // created_at se guarda como string ISO; toleramos también Date / number
  if (!v) return 0;
  const n = new Date(v).getTime();
  return Number.isNaN(n) ? 0 : n;
};

const byCreatedDesc = (a: any, b: any) => ts(b.created_at) - ts(a.created_at);
const byScoreDesc = (a: any, b: any) => (b.score ?? 0) - (a.score ?? 0);

/**
 * Normaliza un documento de foto: conserva los campos crudos (snake_case)
 * que ya usa el panel admin y AÑADE alias consistentes (url / photoUrl),
 * eliminando el fantasma de Supabase donde el campo se llamaba "url".
 */
const normalizePhoto = (d: any): any => {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    url: data.photo_url ?? data.url ?? '',
    photoUrl: data.photo_url ?? data.url ?? '',
  };
};

// ==========================================
// 2. RSVP
// ==========================================

export async function createRSVPResponse(response: RSVPResponse): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'rsvp_responses'), {
      invitation_id: response.invitationId,
      guest_name: response.guestName,
      guest_email: response.guestEmail,
      guest_phone: response.guestPhone,
      attending: response.attending,
      adult_count: response.numberOfGuests,
      dietary_restrictions: response.dietaryRestrictions,
      additional_notes: response.additionalNotes,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('[firebase] createRSVPResponse falló:', error);
    return null;
  }
}

export async function getRSVPResponses(invitationId: string): Promise<RSVPResponse[]> {
  try {
    const q = query(collection(db, 'rsvp_responses'), where('invitation_id', '==', invitationId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)).sort(byCreatedDesc);
  } catch (error) {
    console.error('[firebase] getRSVPResponses falló:', error);
    return [];
  }
}

export async function getAllRSVPResponses(): Promise<RSVPResponse[]> {
  try {
    const snap = await getDocs(collection(db, 'rsvp_responses'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)).sort(byCreatedDesc);
  } catch (error) {
    console.error('[firebase] getAllRSVPResponses falló:', error);
    return [];
  }
}

// ==========================================
// 3. Fotos
// ==========================================

export async function saveGuestPhotoUrl(
  invitationId: string,
  guestName: string,
  photoUrl: string
): Promise<boolean> {
  try {
    await addDoc(collection(db, 'guest_photos'), {
      invitation_id: invitationId || '',
      guest_name: guestName || 'Invitado',
      photo_url: photoUrl,
      approved: false,
      created_at: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('[firebase] saveGuestPhotoUrl falló:', error);
    return false;
  }
}

/**
 * Galería pública. Evento único: devolvemos las fotos APROBADAS y, además de
 * las del invitationId dado, rescatamos las legadas con invitation_id vacío.
 */
export async function getApprovedGuestPhotos(invitationId: string): Promise<GuestPhoto[]> {
  try {
    const q = query(collection(db, 'guest_photos'), where('approved', '==', true));
    const snap = await getDocs(q);
    return snap.docs
      .map(normalizePhoto)
      .filter((p) => !invitationId || p.invitation_id === invitationId || !p.invitation_id)
      .sort(byCreatedDesc);
  } catch (error) {
    console.error('[firebase] getApprovedGuestPhotos falló:', error);
    return [];
  }
}

export async function getAllApprovedGuestPhotos(): Promise<GuestPhoto[]> {
  try {
    const q = query(collection(db, 'guest_photos'), where('approved', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(normalizePhoto).sort(byCreatedDesc);
  } catch (error) {
    console.error('[firebase] getAllApprovedGuestPhotos falló:', error);
    return [];
  }
}

export async function getAllPendingGuestPhotos(): Promise<GuestPhoto[]> {
  try {
    const q = query(collection(db, 'guest_photos'), where('approved', '==', false));
    const snap = await getDocs(q);
    return snap.docs.map(normalizePhoto).sort(byCreatedDesc);
  } catch (error) {
    console.error('[firebase] getAllPendingGuestPhotos falló:', error);
    return [];
  }
}

export async function approveGuestPhoto(
  photoId: string,
  approvedState: boolean = true
): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'guest_photos', photoId), { approved: approvedState });
    return true;
  } catch (error) {
    console.error('[firebase] approveGuestPhoto falló:', error);
    return false;
  }
}

// ==========================================
// 4. Mensajes
// ==========================================

export async function createGuestMessage(message: GuestMessage): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'guest_messages'), {
      invitation_id: message.invitationId,
      guest_name: message.guestName,
      guest_email: message.guestEmail,
      message: message.message,
      approved: false,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('[firebase] createGuestMessage falló:', error);
    return null;
  }
}

export async function getApprovedGuestMessages(invitationId: string): Promise<GuestMessage[]> {
  try {
    const q = query(collection(db, 'guest_messages'), where('approved', '==', true));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as any))
      .filter((m) => !invitationId || m.invitation_id === invitationId || !m.invitation_id)
      .sort(byCreatedDesc);
  } catch (error) {
    console.error('[firebase] getApprovedGuestMessages falló:', error);
    return [];
  }
}

export async function getAllGuestMessages(isApproved: boolean): Promise<GuestMessage[]> {
  try {
    const q = query(collection(db, 'guest_messages'), where('approved', '==', isApproved));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)).sort(byCreatedDesc);
  } catch (error) {
    console.error('[firebase] getAllGuestMessages falló:', error);
    return [];
  }
}

export async function approveGuestMessage(
  messageId: string,
  approvedState: boolean = true
): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'guest_messages', messageId), { approved: approvedState });
    return true;
  } catch (error) {
    console.error('[firebase] approveGuestMessage falló:', error);
    return false;
  }
}

// ==========================================
// 5. Trivia
// ==========================================

export async function getTriviaResults(invitationId: string): Promise<TriviaResult[]> {
  try {
    const q = query(collection(db, 'trivia_results'), where('invitation_id', '==', invitationId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)).sort(byScoreDesc);
  } catch (error) {
    console.error('[firebase] getTriviaResults falló:', error);
    return [];
  }
}

export async function getAllTriviaResults(): Promise<TriviaResult[]> {
  try {
    const snap = await getDocs(collection(db, 'trivia_results'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)).sort(byScoreDesc);
  } catch (error) {
    console.error('[firebase] getAllTriviaResults falló:', error);
    return [];
  }
}

// ==========================================
// 6. Autenticación de administrador
// ==========================================

export async function loginAdmin(email: string, password: string): Promise<string | null> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user.uid;
  } catch (error) {
    console.error('[firebase] loginAdmin falló:', error);
    return null;
  }
}

export async function getAdminSession(): Promise<{ userId: string; email: string | null } | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user ? { userId: user.uid, email: user.email } : null);
    });
  });
}

export async function clearAdminSession(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('[firebase] clearAdminSession falló:', error);
  }
}
