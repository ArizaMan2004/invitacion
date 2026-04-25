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
      parentNames: data.parent_names,
      heroImage: data.hero_image_url,
      eventDate: data.event_date,
      eventTime: data.event_time,
      venue: data.location_name,
      venueAddress: data.location_address,
      mapIframeSrc: data.map_iframe_src || '', 
      locationLat: data.location_lat,
      locationLng: data.location_lng,
      galleryImages: [], 
      dressCode: data.dress_code,
      dedicationMessage: data.dedication_message,
      youtubeMusicLink: data.youtube_music_link,
      
      themeMode: data.theme_mode,
      cardColor: data.card_color,
      textColor: data.text_color,
      accentColor: data.accent_color,
      backgroundColor: data.background_color,
      
      maxGalleryPhotos: 12,
      discoMode: false,
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
    const { data: response, error } = await supabase
      .from('invitations')
      .insert({
        quinceañera_name: data.quinceaneraName || 'Hermanos',
        parent_names: data.parentNames || '',
        hero_image_url: data.heroImage || '',
        event_date: data.eventDate || '',
        event_time: data.event_time || '',
        location_name: data.venue || '',
        location_address: data.venueAddress || '',
        map_iframe_src: data.mapIframeSrc || '',
        location_lat: data.locationLat || 0,
        location_lng: data.locationLng || 0,
        dress_code: data.dressCode || '',
        dedication_message: data.dedicationMessage || '',
        youtube_music_link: data.youtubeMusicLink || '',
        
        theme_mode: data.themeMode || 'dark',
        card_color: data.cardColor || '#1d331d',
        text_color: data.textColor || '#e8efe8',
        accent_color: data.accent_color || '#6b8e23',
        background_color: data.backgroundColor || '#121f12',
      })
      .select('id')
      .single();

    if (error) {
      console.error('🚨 Error de Supabase al crear:', error.message, error.details);
      return null;
    }

    return response.id;
  } catch (err) {
    console.error('🚨 Error inesperado en createInvitation:', err);
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
    if (data.locationLat !== undefined) updateData.location_lat = data.locationLat;
    if (data.locationLng !== undefined) updateData.location_lng = data.locationLng;
    if (data.dressCode !== undefined) updateData.dress_code = data.dressCode;
    if (data.dedicationMessage !== undefined) updateData.dedication_message = data.dedicationMessage;
    if (data.youtubeMusicLink !== undefined) updateData.youtube_music_link = data.youtubeMusicLink;
    
    if (data.themeMode !== undefined) updateData.theme_mode = data.themeMode;
    if (data.cardColor !== undefined) updateData.card_color = data.cardColor;
    if (data.textColor !== undefined) updateData.text_color = data.textColor;
    if (data.accentColor !== undefined) updateData.accent_color = data.accentColor;
    if (data.backgroundColor !== undefined) updateData.background_color = data.backgroundColor;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('invitations')
      .update(updateData)
      .eq('id', invitationId);

    if (error) {
      console.error('🚨 Error de Supabase al actualizar:', error.message, error.details);
      return false;
    }

    return true;
  } catch (error) {
    console.error('🚨 Error inesperado en updateInvitation:', error);
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
    console.error('🚨 Error de Supabase en createRSVPResponse:', error.message, error.details);
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

export async function uploadGuestPhotos(invitationId: string, files: FileList, guestName: string): Promise<boolean> {
  try {
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${invitationId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // 1. Subir al Storage (Bucket: fotos-evento)
      const { error: uploadError } = await supabase.storage
        .from('fotos-evento')
        .upload(fileName, file);

      if (uploadError) {
        console.error('🚨 Error de Storage:', uploadError.message);
        throw uploadError;
      }

      // 2. Registrar en la tabla de la base de datos
      const { error: insertError } = await supabase
        .from('guest_photos')
        .insert({
          invitation_id: invitationId,
          guest_name: guestName,
          photo_url: `${supabaseUrl}/storage/v1/object/public/fotos-evento/${fileName}`,
          photo_bucket_path: fileName,
          approved: true,
        });

      if (insertError) {
        console.error('🚨 Error de DB al registrar foto:', insertError.message);
        throw insertError;
      }
    });

    await Promise.all(uploadPromises);
    return true;
  } catch (error: any) {
    console.error('🚨 Error detallado en uploadGuestPhotos:', error.message || error);
    return false;
  }
}

export async function uploadGuestPhoto(invitationId: string, file: File, guestName: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${invitationId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('fotos-evento')
      .upload(fileName, file);

    if (uploadError) {
      console.error('🚨 Error de Storage (Singular):', uploadError.message);
      return null;
    }

    const { error: insertError } = await supabase
      .from('guest_photos')
      .insert({
        invitation_id: invitationId,
        guest_name: guestName,
        photo_url: `${supabaseUrl}/storage/v1/object/public/fotos-evento/${fileName}`,
        photo_bucket_path: fileName,
        approved: false,
      });

    if (insertError) {
      console.error('🚨 Error de DB al insertar foto única:', insertError.message);
      return null;
    }
    
    return fileName;
  } catch (err: any) {
    console.error('🚨 Error inesperado en uploadGuestPhoto:', err.message || err);
    return null;
  }
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
    console.error('🚨 Error creando mensaje:', error.message, error.details);
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
// Autenticación y Sesión
// ==========================================

export async function loginAdmin(email: string, password: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return null;
    return data.user?.id || null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;
    return { userId: data.session.user.id, email: data.session.user.email };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  try {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') localStorage.removeItem('invitationId');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

// ==========================================
// Sobres e Imágenes
// ==========================================

export async function updateEnvelopeImages(invitationId: string, backImageUrl?: string, flapImageUrl?: string): Promise<boolean> {
  try {
    const updates: any = {};
    if (backImageUrl) updates.envelope_back_image = backImageUrl;
    if (flapImageUrl) updates.envelope_flap_image = flapImageUrl;

    const { error } = await supabase.from('invitations').update(updates).eq('id', invitationId);
    return !error;
  } catch {
    return false;
  }
}

export async function getEnvelopeImages(invitationId: string) {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('envelope_back_image, envelope_flap_image')
      .eq('id', invitationId)
      .single();
    if (error) return null;
    return { back: data.envelope_back_image, flap: data.envelope_flap_image };
  } catch {
    return null;
  }
}