export type ApiResponse<T> = {
ok: boolean
data?: T
error?: string | null
meta?: PaginationMeta
}


export type PaginationMeta = {
page: number
perPage: number
total: number
totalPages: number
}


export type Credentials = { email: string; password: string }
export type Role = 'admin' | 'provider' | 'customer' | 'boat_provider'


export type User = {
id: string
name: string
email: string
role: Role
}


export type AuthResponse = { token: string; user: User }