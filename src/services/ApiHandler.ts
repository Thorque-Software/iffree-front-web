import { apiFetch } from "@/lib/fetcher"
import type { Shift } from "@/types/domain"
import { getTodayFormatted } from "@/utils/utils"


type ShiftsResponse = {
  items: Shift[];
  pagination: {
    page: number;
    items: number;
    totalItems: number;
    totalPages: number;
  };
  success: boolean;
  error?: string;
    
}

export const getShifts = async () => {
  const formattedDate = getTodayFormatted()
  const response = await apiFetch<ShiftsResponse>(`/shifts?fromDate=${formattedDate}`, {
    method: 'GET',
  })
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch shifts')
    }
    return response.data
}