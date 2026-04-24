-- Tabla para información de la invitación
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

-- Tabla para respuestas RSVP
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

-- Tabla para fotos de invitados
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

-- Tabla para mensajes y dedicatorias
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

-- Tabla para fotos de la galería
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_bucket_path TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para admin credentials
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_rsvp_invitation ON rsvp_responses(invitation_id);
CREATE INDEX IF NOT EXISTS idx_photos_invitation ON guest_photos(invitation_id);
CREATE INDEX IF NOT EXISTS idx_messages_invitation ON guest_messages(invitation_id);
CREATE INDEX IF NOT EXISTS idx_gallery_invitation ON gallery_photos(invitation_id);
CREATE INDEX IF NOT EXISTS idx_admin_invitation ON admin_users(invitation_id);

-- Crear políticas RLS (Row Level Security)
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para invitations: todos pueden ver, solo admin puede editar
CREATE POLICY "Invitations are viewable by all" ON invitations
  FOR SELECT USING (true);

CREATE POLICY "Invitations are editable by admin only" ON invitations
  FOR UPDATE USING (false);

-- Políticas para RSVP: todos pueden insertar y ver, solo admin puede actualizar
CREATE POLICY "RSVP responses are viewable by all" ON rsvp_responses
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create RSVP response" ON rsvp_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can update RSVP" ON rsvp_responses
  FOR UPDATE USING (false);

-- Políticas para fotos: todos pueden insertar y ver, solo aprobadas se muestran públicamente
CREATE POLICY "Guest photos are viewable by all" ON guest_photos
  FOR SELECT USING (approved = true);

CREATE POLICY "Anyone can upload guest photos" ON guest_photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can approve photos" ON guest_photos
  FOR UPDATE USING (false);

-- Políticas para mensajes: solo aprobados se muestran
CREATE POLICY "Guest messages are viewable by all" ON guest_messages
  FOR SELECT USING (approved = true);

CREATE POLICY "Anyone can create guest message" ON guest_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can approve messages" ON guest_messages
  FOR UPDATE USING (false);

-- Políticas para galería: todos pueden ver
CREATE POLICY "Gallery photos are viewable by all" ON gallery_photos
  FOR SELECT USING (true);

CREATE POLICY "Only admin can manage gallery" ON gallery_photos
  FOR INSERT USING (false)
  FOR UPDATE USING (false)
  FOR DELETE USING (false);
