export interface InvitationData {
  id?: string;
  twinName1: string;
  twinName2: string;
  parentNames?: string;
  heroImage: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  venueAddress?: string;
  mapIframeSrc: string;
  locationLat?: number;
  locationLng?: number;
  galleryImages: string[];
  maxGalleryPhotos: number;
  dressCode: string;
  dedicationMessage: string;
  specialMessage?: string;
  envelopeBackImage?: string;
  envelopeFlapImage?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  discoMode: boolean;
  guestName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RSVPResponse {
  id?: string;
  invitationId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  attending: boolean;
  numberOfGuests: number;
  dietaryRestrictions?: string;
  additionalNotes?: string;
  createdAt?: Date;
}

export interface GuestPhoto {
  id?: string;
  invitationId: string;
  guestName: string;
  photoUrl: string;
  photoBucketPath: string;
  approved: boolean;
  createdAt?: Date;
}

export interface GuestMessage {
  id?: string;
  invitationId: string;
  guestName: string;
  guestEmail?: string;
  message: string;
  approved: boolean;
  createdAt?: Date;
}
