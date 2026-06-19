import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { RSVPResponse, GuestPhoto, GuestMessage, InvitationData } from './types';

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
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// ==========================================
// 1. Funciones para Invitaciones
// ==========================================

export async function getInvitation(invitationId: string): Promise<InvitationData | null> {
  try {
    const docRef = doc(db, 'invitations', invitationId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    const data = docSnap.data();

    return {
      id: docSnap.id,
      quinceaneraName: data.quinceañera_name,
      parentNames: data.parent_names,
      heroImage: data.hero_image_url,
      eventDate: data.event_date,
      eventTime: data.event_time,
      venue: data.location_name,
      venueAddress: data.location_address,
      mapIframeSrc: data.map_iframe_src || '', 
      locationLat: data.location_lat,
      locationLng: data.location_lng,
      galleryImages: data.gallery_images || [], 
      dressCode: data.dress_code,
      dedicationMessage: data.dedication_message,
      youtubeMusicLink: data.youtube_music_link,
      themeMode: data.theme_mode,
      cardColor: data.card_color,
      textColor: data.text_color,
      accentColor: data.accent_color,
      backgroundColor: data.background_color,
      maxGalleryPhotos: data.max_gallery_photos || 12,
      discoMode: data.disco_mode || false,
      primaryColor: data.theme_color || '',
      secondaryColor: '',
      twinName1: '',
      twinName2: ''
    };
  } catch (error) {
    console.error('Error en getInvitation:', error);
    return null;
  }
}

export async function createInvitation(data: InvitationData): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'invitations'), {
      quinceañera_name: data.quinceaneraName,
      parent_names: data.parentNames,
      hero_image_url: data.heroImage,
      event_date: data.eventDate,
      event_time: data.eventTime,
      location_name: data.venue,
      location_address: data.venueAddress,
      map_iframe_src: data.mapIframeSrc,
      location_lat: data.locationLat,
      location_lng: data.locationLng,
      dress_code: data.dressCode,
      dedication_message: data.dedicationMessage,
      youtube_music_link: data.youtubeMusicLink,
      theme_mode: data.themeMode,
      card_color: data.cardColor,
      text_color: data.textColor,
      accent_color: data.accentColor,
      background_color: data.backgroundColor,
      max_gallery_photos: data.maxGalleryPhotos,
      disco_mode: data.discoMode,
      created_at: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    return null;
  }
}

export async function updateInvitation(invitationId: string, data: Partial<InvitationData>): Promise<boolean> {
  try {
    const updateData: any = {};
    if (data.quinceaneraName !== undefined) updateData.quinceañera_name = data.quinceaneraName;
    if (data.parentNames !== undefined) updateData.parent_names = data.parentNames;
    if (data.heroImage !== undefined) updateData.hero_image_url = data.heroImage;
    if (data.eventDate !== undefined) updateData.event_date = data.eventDate;
    if (data.eventTime !== undefined) updateData.event_time = data.eventTime;
    if (data.venue !== undefined) updateData.location_name = data.venue;
    if (data.venueAddress !== undefined) updateData.location_address = data.venueAddress;
    if (data.mapIframeSrc !== undefined) updateData.map_iframe_src = data.mapIframeSrc;
    if (data.dressCode !== undefined) updateData.dress_code = data.dressCode;
    if (data.youtubeMusicLink !== undefined) updateData.youtube_music_link = data.youtubeMusicLink;
    if (data.accentColor !== undefined) updateData.accent_color = data.accentColor;
    if (data.backgroundColor !== undefined) updateData.background_color = data.backgroundColor;
    if (data.cardColor !== undefined) updateData.card_color = data.cardColor;
    if (data.textColor !== undefined) updateData.text_color = data.textColor;
    if (data.discoMode !== undefined) updateData.disco_mode = data.discoMode;
    if (data.maxGalleryPhotos !== undefined) updateData.max_gallery_photos = data.maxGalleryPhotos;

    updateData.updated_at = new Date().toISOString();

    await updateDoc(doc(db, 'invitations', invitationId), updateData);
    return true;
  } catch (error) {
    return false;
  }
}

// ==========================================
// 2. Funciones para RSVP
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
      created_at: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    return null;
  }
}

// Específica (para la vista pública si es necesario)
export async function getRSVPResponses(invitationId: string): Promise<RSVPResponse[]> {
  try {
    const q = query(
      collection(db, 'rsvp_responses'), 
      where('invitation_id', '==', invitationId), 
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

// Global (para el Admin Dashboard)
export async function getAllRSVPResponses(): Promise<RSVPResponse[]> {
  try {
    const q = query(collection(db, 'rsvp_responses'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

// ==========================================
// 3. Funciones para Fotos
// ==========================================

export async function saveGuestPhotoUrl(invitationId: string, guestName: string, photoUrl: string): Promise<boolean> {
  try {
    await addDoc(collection(db, 'guest_photos'), {
      invitation_id: invitationId,
      guest_name: guestName,
      photo_url: photoUrl,
      photo_bucket_path: 'cloudinary',
      approved: false, 
      created_at: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error al guardar la URL de la foto en Firebase:', error);
    return false;
  }
}

// Específica (para la vista pública)
export async function getApprovedGuestPhotos(invitationId: string): Promise<GuestPhoto[]> {
  try {
    const q = query(
      collection(db, 'guest_photos'),
      where('invitation_id', '==', invitationId),
      where('approved', '==', true),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

// Globales (para el Admin Dashboard)
export async function getAllApprovedGuestPhotos(): Promise<GuestPhoto[]> {
  try {
    const q = query(collection(db, 'guest_photos'), where('approved', '==', true), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

export async function getAllPendingGuestPhotos(): Promise<GuestPhoto[]> {
  try {
    const q = query(collection(db, 'guest_photos'), where('approved', '==', false), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

export async function approveGuestPhoto(photoId: string, approvedState: boolean = true): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'guest_photos', photoId), { approved: approvedState });
    return true;
  } catch (error) { return false; }
}

// ==========================================
// 4. Funciones para Mensajes
// ==========================================

export async function createGuestMessage(message: GuestMessage): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'guest_messages'), {
      invitation_id: message.invitationId,
      guest_name: message.guestName,
      guest_email: message.guestEmail,
      message: message.message,
      approved: false,
      created_at: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    return null;
  }
}

// Específica (para la vista pública)
export async function getApprovedGuestMessages(invitationId: string): Promise<GuestMessage[]> {
  try {
    const q = query(
      collection(db, 'guest_messages'),
      where('invitation_id', '==', invitationId),
      where('approved', '==', true),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

// Global (para el Admin Dashboard)
export async function getAllGuestMessages(isApproved: boolean): Promise<GuestMessage[]> {
  try {
    const q = query(collection(db, 'guest_messages'), where('approved', '==', isApproved), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

export async function approveGuestMessage(messageId: string, approvedState: boolean = true): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'guest_messages', messageId), { approved: approvedState });
    return true;
  } catch (error) { return false; }
}

// ==========================================
// 5. Funciones para Trivia
// ==========================================

// Específica (por si muestras el ranking en la invitación pública)
export async function getTriviaResults(invitationId: string): Promise<TriviaResult[]> {
  try {
    const q = query(
      collection(db, 'trivia_results'),
      where('invitation_id', '==', invitationId),
      orderBy('score', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

// Global (para el Admin Dashboard)
export async function getAllTriviaResults(): Promise<TriviaResult[]> {
  try {
    const q = query(collection(db, 'trivia_results'), orderBy('score', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) { return []; }
}

// ==========================================
// 6. Funciones para Sobres y Visuales
// ==========================================

export async function updateEnvelopeImages(invitationId: string, backImageUrl?: string, flapImageUrl?: string): Promise<boolean> {
  try {
    const updates: any = {};
    if (backImageUrl) updates.envelope_back_image = backImageUrl;
    if (flapImageUrl) updates.envelope_flap_image = flapImageUrl;
    await updateDoc(doc(db, 'invitations', invitationId), updates);
    return true;
  } catch { return false; }
}

export async function getEnvelopeImages(invitationId: string) {
  try {
    const docSnap = await getDoc(doc(db, 'invitations', invitationId));
    if (!docSnap.exists()) return { back: null, flap: null };
    const data = docSnap.data();
    return {
      back: data.envelope_back_image,
      flap: data.envelope_flap_image
    };
  } catch {
    return { back: null, flap: null };
  }
}

// ==========================================
// 7. Autenticación y Sesión de Administrador
// ==========================================

export async function loginAdmin(email: string, password: string): Promise<string | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user.uid;
  } catch (error) {
    console.error('Error en login:', error);
    return null;
  }
}

export async function getAdminSession(): Promise<{ userId: string; email: string | null } | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); 
      if (user) {
        resolve({ userId: user.uid, email: user.email });
      } else {
        resolve(null);
      }
    });
  });
}

export async function clearAdminSession(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error en logout:', error);
  }
}