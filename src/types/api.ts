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
export type Role = 'admin' | 'provider' | 'finalUser' | 'providerBoat'


export type User = {
providerId?: string
role: Role
token: string
}

export type JwtPayload = {
id: number
providerId?: number
role: Role
exp: number
iat: number
}

export type AuthResponse = { 
success: boolean;
message: string;
token: string;
role: Role;
}