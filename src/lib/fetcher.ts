export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  headers?: Record<string, string>
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ''}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...headers,
    },
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json() as Promise<T>
}
