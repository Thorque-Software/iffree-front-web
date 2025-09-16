export interface City {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Tipo para cada proveedor
export interface Provider {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string | null;
  cuil: string;
  cityId: number;
  userId: number;
  needConfirmation: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  city: City;
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

// Tipo para el turno (shift)
export interface Shift {
  id: number;
  serviceId: number;
  start: string;
  end: string;
  maxCapacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  availablePlaces: number;
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

// Tipo para cada reserva o item
export interface Reservation {
  id: number;
  shiftId: number;
  finalUserId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  shift: Shift;
  finalUser: FinalUser;
}