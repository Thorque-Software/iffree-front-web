
export interface City {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type ProfitResponse = {
  subtotals: { serviceId: number, totalProfit: number }[];
  total: number;
};

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
  city?: City;
  mediaId?: number | null;
  media?: Media | null; // ver
}

export interface Service {
  id: number;
  serviceTypeId: number;
  providerId: number;
  name: string;
  description: string;
  forAdultsOnly: boolean;
  suggestedMaxCapacity: number;
  location: string;
  locationLat: number;
  locationLong: number;
  price: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  provider?: Provider;
  serviceType?: ServiceType;
}

export type ServiceToPost = Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type ServiceType = {
  id: number;
  name: string;
  mediaId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type Media = {
  id: number;
  path: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type MediaService = {
  id: number;
  serviceId: number;
  mediaId: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  media: Media;
};

export type MediaBoats = {
    id: number;
    boatId: number;
    mediaId: number;
    order: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    media: Media;
};

export interface ServiceDetail extends Service {
  avgScore: number | null;
  provider: Provider;
  serviceType: ServiceType;
  mediaService: MediaService[];
}

type ShiftStatus = 'enabled' | 'suspended' | 'payed';

// Tipo para el turno (shift)
export interface Shift {
  id: number;
  serviceId: number;
  serviceName?: string;
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
export type FinalUser = {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  countryId: number;
  userId?: number;
  dateOfBirth: string;
  docTypeId: number;
  docNumber: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  reservationId?: number;
}


export type ReservationStatus = 'to_confirm' | 'to_pay' | 'payed' | 'paying' | 'cancelled';

// Tipo para cada reserva o item
export interface Reservation {
  id: number;
  shiftId: number;
  finalUserId: number;
  finalPrice?: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  shift: Shift;
  finalUser: FinalUser;
  attendees: FinalUser[];
}

export interface Boat {
  id: number;
  dockId: number;
  boatTypeId: number;
  name: string;
  enginePower: number;
  capacity: number;
  licenseType: "basic" | "professional" | "special";
  eslora: number;
  manga: number;
  puntal: number;
  tankCapacity: number;
  autonomy: number;
  price: number;
  providerId: number;
  status: "active" | "inactive" | "maintenance";
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  provider: Partial<Provider>;
  boatType: boatType;
  dock: Dock;
  mediaBoats: MediaBoats[];
}

export type boatType = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Dock {
  id: number;
  name: string;
  locationLat: number;
  locationLong: number;
  boya?: boolean;
}

export interface ReservationBoat {
  id: number;
  mediaLicense: number | null;
  invoice: number | null;
  boatId: number;
  dockId: number;
  finalUserId: number;
  start: string;
  end: string;
  finalPrice: number;
  status: ReservationStatus;
  paymentId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  boat: Boat;
  dock: Dock;
  finalUser: FinalUser;
}
