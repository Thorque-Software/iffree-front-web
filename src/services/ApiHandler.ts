import { apiFetch } from "@/lib/fetcher"
import type { Shift } from "@/types/domain"
import { getTodayFormatted } from "@/utils/utils"


type ShiftsResponse = {
  items: Shift[];
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