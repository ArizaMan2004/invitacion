import { InvitationData } from './types';

export const DEFAULT_INVITATION_DATA: InvitationData = {
  // Identidad de los Morochos
  quinceaneraName: "Jesús & Jessenia",
  parentNames: "Con la bendición de nuestros padres",
  
  // Configuración del Bosque Encantado
  eventDate: "2026-07-11",
  eventTime: "20:00",
  venue: "Refugio Ranch Coro",
  venueAddress: "Coro, Estado Falcón",
  
  // Ubicación GPS (Código Embed de Google Maps)
  mapIframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3921.23456789!2d-69.6789!3d11.4123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDI0JzQ0LjMiTiA2OcKwNDAnNDQuMCJX!5e0!3m2!1ses!2sve!4v1234567890",
  
  // Mensajes en plural
  dedicationMessage: "Los invitamos a celebrar nuestra gran noche mágica en el bosque encantado. ¡Su presencia es nuestro mejor regalo!",
  dressCode: "Formal - Tonos Tierra y Verde Musgo",
  
  // --- ESTÉTICA DEL BOSQUE ---
  themeMode: "dark",
  backgroundColor: "#121f12",  // Verde bosque profundo
  cardColor: "#1d331d",        // Verde pino
  textColor: "#e8efe8",        // Hueso
  accentColor: "#6b8e23",      // Verde musgo
  
  youtubeMusicLink: "",

  // --- IMÁGENES LOCALES (Carpeta /public) ---
  heroImage: "/placeholder-hero.jpg", 
  galleryImages: [
    "/gallery-1.jpg",
    "/gallery-2.jpg",
    "/gallery-3.jpg"
  ]
};