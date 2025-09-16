export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Si es login no agrego token
  const isLogin = url.includes('/login')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && !isLogin ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
      ...headers,
    },
  })

  let body: any = null
  try {
    body = await res.json()
  } catch {
    // si la API no devuelve JSON
  }

  if (!res.ok) {
    const errorMsg =
      body?.message || `API error: ${res.status} ${res.statusText}`
    throw new Error(errorMsg)
  }

  return {
    success: true,
    data: body as T,
  }
}
