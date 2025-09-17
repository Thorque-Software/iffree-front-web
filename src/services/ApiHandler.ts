import { apiFetch } from "@/lib/fetcher"
import type { Shift, Reservation, Provider } from "@/types/domain"
import { getTodayFormatted } from "@/utils/utils"


type ShiftsResponse = {
  items: Shift[];
  pagination: {
    page: number;
    pageSize: number;
  };
  total: number;
}

type ReservationsResponse = {
  items: Reservation[];
  pagination: {
    page: number;
    pageSize: number;
  };
  total: number;
}
type ProvidersResponse = {
  items: Provider[];
  pagination: {
    page: number;
    pageSize: number;
  };
  total: number;
}

export const getShifts = async (parameters: { page: number; pageSize: number; search?: string }) => {
  const params = new URLSearchParams({
        page: String(parameters.page),
        pageSize: String(parameters.pageSize),
        ...(parameters.search ? { search: parameters.search } : {}),
        fromDate: getTodayFormatted()
      });
  const response = await apiFetch<ShiftsResponse>(`/shifts?${params.toString()}`, {
    method: 'GET',
  })
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch shifts')
    }
    return response.data
}

export const getReservations = async (parameters: { page: number; pageSize: number; search?: string }) => {
  const params = new URLSearchParams({
        page: String(parameters.page),
        pageSize: String(parameters.pageSize),
        ...(parameters.search ? { search: parameters.search } : {}),
      });
  const response = await apiFetch<ReservationsResponse>(`/reservations?${params.toString()}`, {
    method: 'GET',
  })
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch reservations')
    }
    return response.data
}

export const getProviders = async (parameters: { page: number; pageSize: number; search?: string }) => {
  const params = new URLSearchParams({
        page: String(parameters.page),
        pageSize: String(parameters.pageSize),
        ...(parameters.search ? { search: parameters.search } : {}),
        fromDate: getTodayFormatted()
      });
  const response = await apiFetch<ProvidersResponse>(`/providers?${params.toString()}`, {
    method: 'GET',
  })
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch providers')
    }
    return response.data
}