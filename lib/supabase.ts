import { createClient } from '@supabase/supabase-js';
import { RSVPResponse, GuestPhoto, GuestMessage, InvitationData } from './types';

// Tipado para los resultados de la trivia
export interface TriviaResult {
  id: string;
  invitation_id: string;
  guest_name: string;
  twin_selected: string;
  score: number;
  total_questions: number;
  created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 1. Funciones para Invitaciones
// ==========================================

export async function getInvitation(invitationId: string): Promise<InvitationData | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (error || !data) return null;

    // Mapeo exhaustivo de Snake Case (DB) a Camel Case (Frontend)
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
    const { data: response, error } = await supabase
      .from('invitations')
      .insert({
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
        disco_mode: data.discoMode
      })
      .select('id')
      .single();

    if (error) throw error;
    return response.id;
  } catch (err) {
    console.error('Error al crear invitación:', err);
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

    const { error } = await supabase.from('invitations').update(updateData).eq('id', invitationId);
    return !error;
  } catch (error) {
    console.error('Error al actualizar:', error);
    return false;
  }
}

// ==========================================
// 2. Funciones para RSVP (Confirmaciones)
// ==========================================

export async function createRSVPResponse(response: RSVPResponse): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('rsvp_responses')
      .insert({
        invitation_id: response.invitationId,
        guest_name: response.guestName,
        guest_email: response.guestEmail,
        guest_phone: response.guestPhone,
        attending: response.attending,
        adult_count: response.numberOfGuests, // Mapeado según esquema de DB
        dietary_restrictions: response.dietaryRestrictions,
        additional_notes: response.additionalNotes,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error al crear RSVP:', error);
    return null;
  }
}

export async function getRSVPResponses(invitationId: string): Promise<RSVPResponse[]> {
  try {
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
      numberOfGuests: r.adult_count, // Adaptado
      childCount: r.child_count || 0, // Incluyendo campo para gemelos si aplica
      dietaryRestrictions: r.dietary_restrictions,
      additionalNotes: r.additional_notes,
      createdAt: new Date(r.created_at),
    }));
  } catch (error) {
    console.error('Error al obtener RSVPs:', error);
    return [];
  }
}

// ==========================================
// 3. Funciones para Fotos y Storage
// ==========================================

export async function uploadGuestPhotos(invitationId: string, files: FileList, guestName: string): Promise<boolean> {
  try {
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${invitationId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('fotos-evento').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('guest_photos').insert({
        invitation_id: invitationId,
        guest_name: guestName,
        photo_url: `${supabaseUrl}/storage/v1/object/public/fotos-evento/${fileName}`,
        photo_bucket_path: fileName,
        approved: false, 
      });
      if (insertError) throw insertError;
    });

    await Promise.all(uploadPromises);
    return true;
  } catch (error) {
    console.error('Error en uploadGuestPhotos:', error);
    return false;
  }
}

export async function getApprovedGuestPhotos(invitationId: string): Promise<GuestPhoto[]> {
  try {
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
  } catch (error) {
    return [];
  }
}

export async function getPendingGuestPhotos(invitationId: string): Promise<GuestPhoto[]> {
  try {
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
  } catch (error) {
    return [];
  }
}

export async function approveGuestPhoto(photoId: string): Promise<boolean> {
  const { error } = await supabase.from('guest_photos').update({ approved: true }).eq('id', photoId);
  return !error;
}

// ==========================================
// 4. Funciones para Mensajes y Dedicatorias
// ==========================================

export async function createGuestMessage(message: GuestMessage): Promise<string | null> {
  try {
    const { data, error } = await supabase.from('guest_messages').insert({
      invitation_id: message.invitationId,
      guest_name: message.guestName,
      guest_email: message.guestEmail,
      message: message.message,
      approved: false,
    }).select('id').single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    return null;
  }
}

export async function getApprovedGuestMessages(invitationId: string): Promise<GuestMessage[]> {
  try {
    const { data, error } = await supabase.from('guest_messages')
      .select('*').eq('invitation_id', invitationId).eq('approved', true)
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
  } catch (error) {
    return [];
  }
}

export async function getPendingGuestMessages(invitationId: string): Promise<GuestMessage[]> {
  try {
    const { data, error } = await supabase.from('guest_messages')
      .select('*').eq('invitation_id', invitationId).eq('approved', false)
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
  } catch (error) {
    return [];
  }
}

export async function approveGuestMessage(messageId: string): Promise<boolean> {
  const { error } = await supabase.from('guest_messages').update({ approved: true }).eq('id', messageId);
  return !error;
}

// ==========================================
// 5. Funciones para Trivia (Gemelos)
// ==========================================

export async function getTriviaResults(invitationId: string): Promise<TriviaResult[]> {
  try {
    const { data, error } = await supabase
      .from('trivia_results')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('score', { ascending: false });

    if (error || !data) return [];
    return data as TriviaResult[];
  } catch (error) {
    console.error('Error al obtener trivia:', error);
    return [];
  }
}

// ==========================================
// 6. Funciones para Sobres y Visuales
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

    if (error) return { back: null, flap: null };
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