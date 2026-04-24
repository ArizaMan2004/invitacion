import { createClient } from '@supabase/supabase-js';
import { RSVPResponse, GuestPhoto, GuestMessage, InvitationData } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// Funciones para Invitaciones
// ==========================================
export async function getInvitation(invitationId: string): Promise<InvitationData | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      quinceaneraName: data.quinceañera_name,
      heroImage: data.hero_image_url,
      eventDate: data.event_date,
      eventTime: data.event_time,
      venue: data.location_name,
      venueAddress: data.location_address,
      mapIframeSrc: '', // No guardamos iframe en BD
      locationLat: data.location_lat,
      locationLng: data.location_lng,
      galleryImages: [],
      dressCode: data.dress_code,
      dedicationMessage: data.dedication_message,
      themeColor: data.theme_color,
      youtubeMusicLink: data.youtube_music_link, // Añadido para el módulo de música
    };
  } catch (error) {
    console.error('Error en getInvitation:', error);
    return null;
  }
}

export async function createInvitation(data: InvitationData): Promise<string | null> {
  try {
    const { data: response, error } = await supabase
      .from('invitations')
      .insert({
        // Usamos valores por defecto (|| '') para evitar que la BD rechace el registro por campos nulos
        quinceañera_name: data.quinceaneraName || 'Quinceañera',
        hero_image_url: data.heroImage || '',
        event_date: data.eventDate || '',
        event_time: data.eventTime || '',
        location_name: data.venue || '',
        location_address: data.venueAddress || '',
        location_lat: data.locationLat || 0,
        location_lng: data.locationLng || 0,
        dress_code: data.dressCode || '',
        dedication_message: data.dedicationMessage || '',
        theme_color: data.themeColor || 'amber',
        youtube_music_link: data.youtubeMusicLink || '',
      })
      .select('id')
      .single();

    if (error) {
      console.error('🚨 Error en BD al crear invitación:', error.message, error.details);
      return null;
    }

    return response.id;
  } catch (err) {
    console.error('🚨 Error inesperado creando invitación:', err);
    return null;
  }
}

export async function updateInvitation(invitationId: string, data: Partial<InvitationData>): Promise<boolean> {
  try {
    const updateData: any = {};

    if (data.quinceaneraName !== undefined) updateData.quinceañera_name = data.quinceaneraName;
    if (data.heroImage !== undefined) updateData.hero_image_url = data.heroImage;
    if (data.eventDate !== undefined) updateData.event_date = data.eventDate;
    if (data.eventTime !== undefined) updateData.event_time = data.eventTime;
    if (data.venue !== undefined) updateData.location_name = data.venue;
    if (data.venueAddress !== undefined) updateData.location_address = data.venueAddress;
    if (data.locationLat !== undefined) updateData.location_lat = data.locationLat;
    if (data.locationLng !== undefined) updateData.location_lng = data.locationLng;
    if (data.dressCode !== undefined) updateData.dress_code = data.dressCode;
    if (data.dedicationMessage !== undefined) updateData.dedication_message = data.dedicationMessage;
    if (data.youtubeMusicLink !== undefined) updateData.youtube_music_link = data.youtubeMusicLink;
    if (data.parentNames !== undefined) updateData.parent_names = data.parentNames;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('invitations')
      .update(updateData)
      .eq('id', invitationId);

    if (error) {
      console.error('Error actualizando invitación:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado actualizando invitación:', error);
    return false;
  }
}

// ==========================================
// Funciones para RSVP
// ==========================================
export async function createRSVPResponse(response: RSVPResponse): Promise<string | null> {
  const { data, error } = await supabase
    .from('rsvp_responses')
    .insert({
      invitation_id: response.invitationId,
      guest_name: response.guestName,
      guest_email: response.guestEmail,
      guest_phone: response.guestPhone,
      attending: response.attending,
      number_of_guests: response.numberOfGuests,
      dietary_restrictions: response.dietaryRestrictions,
      additional_notes: response.additionalNotes,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creando RSVP:', error);
    return null;
  }

  return data.id;
}

export async function getRSVPResponses(invitationId: string): Promise<RSVPResponse[]> {
  const { data, error } = await supabase
    .from('rsvp_responses')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(r => ({
    id: r.id,
    invitationId: r.invitation_id,
    guestName: r.guest_name,
    guestEmail: r.guest_email,
    guestPhone: r.guest_phone,
    attending: r.attending,
    numberOfGuests: r.number_of_guests,
    dietaryRestrictions: r.dietary_restrictions,
    additionalNotes: r.additional_notes,
    createdAt: new Date(r.created_at),
  }));
}

// ==========================================
// Funciones para Fotos de Invitados
// ==========================================
export async function uploadGuestPhoto(invitationId: string, file: File, guestName: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${invitationId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('guest-photos')
    .upload(fileName, file);

  if (error) {
    console.error('Error subiendo foto:', error);
    return null;
  }

  const { error: insertError } = await supabase
    .from('guest_photos')
    .insert({
      invitation_id: invitationId,
      guest_name: guestName,
      photo_url: `${supabaseUrl}/storage/v1/object/public/guest-photos/${fileName}`,
      photo_bucket_path: fileName,
      approved: false,
    });

  if (insertError) {
    console.error('Error registrando foto:', insertError);
    return null;
  }

  return fileName;
}

export async function getApprovedGuestPhotos(invitationId: string): Promise<GuestPhoto[]> {
  const { data, error } = await supabase
    .from('guest_photos')
    .select('*')
    .eq('invitation_id', invitationId)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(p => ({
    id: p.id,
    invitationId: p.invitation_id,
    guestName: p.guest_name,
    photoUrl: p.photo_url,
    photoBucketPath: p.photo_bucket_path,
    approved: p.approved,
    createdAt: new Date(p.created_at),
  }));
}

export async function getPendingGuestPhotos(invitationId: string): Promise<GuestPhoto[]> {
  const { data, error } = await supabase
    .from('guest_photos')
    .select('*')
    .eq('invitation_id', invitationId)
    .eq('approved', false)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(p => ({
    id: p.id,
    invitationId: p.invitation_id,
    guestName: p.guest_name,
    photoUrl: p.photo_url,
    photoBucketPath: p.photo_bucket_path,
    approved: p.approved,
    createdAt: new Date(p.created_at),
  }));
}

export async function approveGuestPhoto(photoId: string): Promise<boolean> {
  const { error } = await supabase
    .from('guest_photos')
    .update({ approved: true })
    .eq('id', photoId);

  return !error;
}

// ==========================================
// Funciones para Mensajes
// ==========================================
export async function createGuestMessage(message: GuestMessage): Promise<string | null> {
  const { data, error } = await supabase
    .from('guest_messages')
    .insert({
      invitation_id: message.invitationId,
      guest_name: message.guestName,
      guest_email: message.guestEmail,
      message: message.message,
      approved: false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creando mensaje:', error);
    return null;
  }

  return data.id;
}

export async function getApprovedGuestMessages(invitationId: string): Promise<GuestMessage[]> {
  const { data, error } = await supabase
    .from('guest_messages')
    .select('*')
    .eq('invitation_id', invitationId)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(m => ({
    id: m.id,
    invitationId: m.invitation_id,
    guestName: m.guest_name,
    guestEmail: m.guest_email,
    message: m.message,
    approved: m.approved,
    createdAt: new Date(m.created_at),
  }));
}

export async function getPendingGuestMessages(invitationId: string): Promise<GuestMessage[]> {
  const { data, error } = await supabase
    .from('guest_messages')
    .select('*')
    .eq('invitation_id', invitationId)
    .eq('approved', false)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(m => ({
    id: m.id,
    invitationId: m.invitation_id,
    guestName: m.guest_name,
    guestEmail: m.guest_email,
    message: m.message,
    approved: m.approved,
    createdAt: new Date(m.created_at),
  }));
}

export async function approveGuestMessage(messageId: string): Promise<boolean> {
  const { error } = await supabase
    .from('guest_messages')
    .update({ approved: true })
    .eq('id', messageId);

  return !error;
}

// ==========================================
// Autenticación Nativa de Supabase
// ==========================================
export async function loginAdmin(email: string, password: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('🚨 Error real de Supabase Auth:', error.message);
      return null;
    }

    return data.user?.id || null;
  } catch (error) {
    console.error('🚨 Error inesperado en login:', error);
    return null;
  }
}

export async function getAdminSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) return null;
    
    return {
      userId: data.session.user.id,
      email: data.session.user.email,
    };
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return null;
  }
}

export async function clearAdminSession() {
  try {
    await supabase.auth.signOut();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('invitationId'); 
    }
  } catch (error) {
    console.error('Error cerrando sesión:', error);
  }
}

// ==========================================
// Funciones para personalización del sobre
// ==========================================
export async function updateEnvelopeImages(
  invitationId: string,
  backImageUrl?: string,
  flapImageUrl?: string
): Promise<boolean> {
  try {
    const updates: Record<string, string> = {};
    if (backImageUrl) updates.envelope_back_image = backImageUrl;
    if (flapImageUrl) updates.envelope_flap_image = flapImageUrl;

    if (Object.keys(updates).length === 0) return true;

    const { error } = await supabase
      .from('invitations')
      .update(updates)
      .eq('id', invitationId);

    if (error) {
      console.error('[v0] Error actualizando imágenes del sobre:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[v0] Error en updateEnvelopeImages:', error);
    return false;
  }
}

export async function getEnvelopeImages(invitationId: string): Promise<{ back?: string; flap?: string } | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('envelope_back_image, envelope_flap_image')
      .eq('id', invitationId)
      .single();

    if (error) {
      console.error('[v0] Error obteniendo imágenes del sobre:', error);
      return null;
    }

    return {
      back: data?.envelope_back_image || undefined,
      flap: data?.envelope_flap_image || undefined,
    };
  } catch (error) {
    console.error('[v0] Error en getEnvelopeImages:', error);
    return null;
  }
}