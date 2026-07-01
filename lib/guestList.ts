// lib/guestList.ts
// Gestión de la lista de invitados y sus pases asignados (auditoría de aforo).
// Colección Firestore: "guest_list". Solo el admin autenticado puede leer/escribir
// (cubierto por tu regla comodín `allow read, write: if request.auth != null`).

import { db } from './firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const COL = 'guest_list';

export interface GuestPass {
  id: string;
  guest_name: string;
  passes: number;
  phone?: string;
  notes?: string;
  created_at?: string;
}

export interface GuestPassInput {
  guest_name: string;
  passes: number;
  phone?: string;
  notes?: string;
}

export async function getGuestList(): Promise<GuestPass[]> {
  try {
    const snap = await getDocs(collection(db, COL));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as GuestPass))
      .sort((a, b) => (a.guest_name || '').localeCompare(b.guest_name || '', 'es'));
  } catch (e) {
    console.error('[guestList] getGuestList falló:', e);
    return [];
  }
}

export async function addGuestToList(data: GuestPassInput): Promise<string | null> {
  try {
    const ref = await addDoc(collection(db, COL), {
      guest_name: (data.guest_name || '').trim(),
      passes: Number(data.passes) || 0,
      phone: (data.phone || '').trim(),
      notes: (data.notes || '').trim(),
      created_at: new Date().toISOString(),
    });
    return ref.id;
  } catch (e) {
    console.error('[guestList] addGuestToList falló:', e);
    return null;
  }
}

export async function updateGuestInList(id: string, data: Partial<GuestPassInput>): Promise<boolean> {
  try {
    const u: any = {};
    if (data.guest_name !== undefined) u.guest_name = data.guest_name.trim();
    if (data.passes !== undefined) u.passes = Number(data.passes) || 0;
    if (data.phone !== undefined) u.phone = (data.phone || '').trim();
    if (data.notes !== undefined) u.notes = (data.notes || '').trim();
    await updateDoc(doc(db, COL, id), u);
    return true;
  } catch (e) {
    console.error('[guestList] updateGuestInList falló:', e);
    return false;
  }
}

export async function deleteGuestFromList(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COL, id));
    return true;
  } catch (e) {
    console.error('[guestList] deleteGuestFromList falló:', e);
    return false;
  }
}
