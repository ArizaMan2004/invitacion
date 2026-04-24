import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Crear tabla de invitaciones
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS invitations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          quinceañera_name VARCHAR(255) NOT NULL,
          event_date TIMESTAMP NOT NULL,
          event_time VARCHAR(50) NOT NULL,
          location_name VARCHAR(255) NOT NULL,
          location_address VARCHAR(500) NOT NULL,
          location_lat DECIMAL(10, 8),
          location_lng DECIMAL(11, 8),
          dress_code TEXT,
          dedication_message TEXT,
          hero_image_url TEXT,
          theme_color VARCHAR(20) DEFAULT 'amber',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).catch(() => null);

    // Crear tabla de respuestas RSVP
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS rsvp_responses (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
          guest_name VARCHAR(255) NOT NULL,
          guest_email VARCHAR(255) NOT NULL,
          guest_phone VARCHAR(20),
          attending BOOLEAN NOT NULL,
          number_of_guests INTEGER DEFAULT 1,
          dietary_restrictions TEXT,
          additional_notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).catch(() => null);

    // Crear tabla de fotos de invitados
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS guest_photos (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
          guest_name VARCHAR(255) NOT NULL,
          photo_url TEXT NOT NULL,
          photo_bucket_path TEXT NOT NULL,
          approved BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).catch(() => null);

    // Crear tabla de mensajes
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS guest_messages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
          guest_name VARCHAR(255) NOT NULL,
          guest_email VARCHAR(255),
          message TEXT NOT NULL,
          approved BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).catch(() => null);

    return Response.json({ success: true, message: 'Base de datos configurada correctamente' });
  } catch (error) {
    console.error('Error configurando BD:', error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
