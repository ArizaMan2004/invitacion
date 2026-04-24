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
  
  // Ubicación GPS Limpia
  mapIframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.327855663718!2d-69.6766487!3d11.4055556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e859d047394c8b7%3A0xc3f58a36b53940c3!2sRefugio%20Ranch!5e0!3m2!1ses!2sve!4v1714078000000!5m2!1ses!2sve",
  
  // Mensajes en plural
  dedicationMessage: "Los invitamos a celebrar nuestra gran noche mágica en el bosque encantado. ¡Su presencia es nuestro mejor regalo!",
  dressCode: "Formal - Tonos Tierra y Verde Musgo",
  
  // --- ESTÉTICA PREDETERMINADA DEL BOSQUE ---
  themeMode: "dark",           // Modo oscuro para ambiente de bosque nocturno
  backgroundColor: "#121f12",  // Verde bosque profundo
  cardColor: "#1d331d",        // Verde pino para tarjetas
  textColor: "#e8efe8",        // Texto blanco hueso/verdoso
  accentColor: "#6b8e23",      // Verde musgo para botones y detalles
  
  youtubeMusicLink: "",
  heroImage: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200", // Imagen de bosque
  galleryImages: []
};