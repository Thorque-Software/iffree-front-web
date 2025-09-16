import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch, ApiResponse } from '@/lib/fetcher'

type FetchQueryOptions = {
  enabled?: boolean
  params?: Record<string, any>
}

export const useFetchQuery = <T>(
  key: string,
  url: string,
  { enabled = true, params }: FetchQueryOptions = {}
) => {
  const queryString = params
    ? '?' +
      Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : ''

  return useQuery<ApiResponse<T>>({
    queryKey: [key, url, params],
    queryFn: () => apiFetch<T>(url + queryString),
    enabled,
  })
}

export const usePostMutation = <T>(url: string, keyToInvalidate?: string) => {
  const qc = useQueryClient()
  return useMutation<ApiResponse<T>, Error, any>({
    mutationFn: (payload: any) =>
      apiFetch<T>(url, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      if (keyToInvalidate) {
        qc.invalidateQueries({ queryKey: [keyToInvalidate] })
      }
    },
  })
}
