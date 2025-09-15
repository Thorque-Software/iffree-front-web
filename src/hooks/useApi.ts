import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/fetcher'

type FetchQueryOptions = {
  enabled?: boolean
  params?: Record<string, any> // para query params dinámicos
}

export const useFetchQuery = <T>(
  key: string,
  url: string,
  { enabled = true, params }: FetchQueryOptions = {}
) => {
  // Construir query string si hay params
  const queryString = params
    ? '?' +
      Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : ''

  return useQuery<T>({
    queryKey: [key, url, params], // incluir params en el key para refetch correcto
    queryFn: () => apiFetch<T>(url + queryString),
    enabled,
  })
}

export const usePostMutation = <T>(url: string, keyToInvalidate?: string) => {
  const qc = useQueryClient()
  return useMutation<T, Error, any>({
    mutationFn: (payload: any) =>
      apiFetch<T>(url, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      if (keyToInvalidate) {
        qc.invalidateQueries({ queryKey: [keyToInvalidate] })
      }
    },
  })
}
