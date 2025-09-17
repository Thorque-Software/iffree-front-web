export interface City {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Provider {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string | null;
  cuil: string;
  cityId: number;
  userId: number;
  needConfirmation: boolean;
  type: 'default' | 'boat';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  city: City;
  mediaId?: number | null;
  media?: unknown | null; // ver
}

export interface Service {
  id: number;
  serviceTypeId: number;
  providerId: number;
  name: string;
  description: string;
  forAdultsOnly: boolean;
  suggestedMaxCapacity: number;
  locationLat: number;
  locationLong: number;
  price: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

type ShiftStatus = 'enabled' | 'suspended' | 'payed';

// Tipo para el turno (shift)
export interface Shift {
  id: number;
  serviceId: number;
  start: string;
  end: string;
  maxCapacity: number;
  status: ShiftStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  availablePlaces: number;
  service?: Service;
}

// Tipo para el usuario final
export interface FinalUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
  countryId: number;
  userId: number;
  dateOfBirth: string;
  docTypeId: number;
  docNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

type ReservationStatus = 'to_confirm' | 'to_pay' | 'payed' | 'paying';

// Tipo para cada reserva o item
export interface Reservation {
  id: number;
  shiftId: number;
  finalUserId: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  shift: Shift;
  finalUser: FinalUser;
}