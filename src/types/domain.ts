export type Provider = {
  id: string
  name: string
  userId: string
  contactEmail?: string
  phone?: string
}

export type Service = {
  id: string
  title: string
  description?: string
  providerId: string
  priceCents: number
  currency: string
  active: boolean
}

export type Reservation = {
  id: string
  serviceId: string
  userId: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  participants: number
  date: string
}