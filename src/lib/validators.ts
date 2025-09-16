import { z } from 'zod'

export const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
})

export const reservationSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string(),
  participants: z.number().min(1),
})