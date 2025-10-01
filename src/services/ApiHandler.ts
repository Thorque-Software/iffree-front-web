import { apiFetch } from "@/lib/fetcher"
import type { Shift, Reservation, Provider, ServiceDetail, City, ServiceType, Service} from "@/types/domain"
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

type ServiceDetailResponse = {
  items: ServiceDetail[];
  pagination: {
    page: number;
    pageSize: number;
  };
  total: number;
}
type ServiceTypeResponse = {
  items: ServiceType[];
  pagination: {
    page: number;
    pageSize: number;
  };
  total: number;
}

export const getShifts = async (parameters: { page: number; pageSize: number; search?: string; serviceId?: string }) => {
  const params = new URLSearchParams({
        page: String(parameters.page),
        pageSize: String(parameters.pageSize),
        ...(parameters.search ? { search: parameters.search } : {}),
        fromDate: getTodayFormatted(),
        ...(parameters.serviceId ? { serviceId: parameters.serviceId } : {}),
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

export const getServiceDetails = async (parameters: {
  page: number;
  pageSize: number;
  filters?: Record<string, any>; // 👈 cualquier filtro opcional
}) => {
  const params = new URLSearchParams({
    page: String(parameters.page),
    pageSize: String(parameters.pageSize),
  });

  if (parameters.filters) {
    Object.entries(parameters.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
  }

  const response = await apiFetch<ServiceDetailResponse>(`/services?${params.toString()}`, {
    method: 'GET',
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch service details');
  }

  return response.data;
};


export const getOneServiceDetail = async (serviceId: string) => {
  const response = await apiFetch<ServiceDetail>(`/services/${serviceId}`, {
    method: 'GET',
  })
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch service details')
    }
    return response.data
}

type CityResponse = {
  items: City[];
  pagination: {
    page: number;
    pageSize: number;
  };
  total: number;
}
export const getCities = async () => {
  const response = await apiFetch<CityResponse>('/cities', {
    method: 'GET',
  })
  if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch cities')
  }
  return response.data
}
export const getServiceTypes = async () => {
  const response = await apiFetch<ServiceTypeResponse>('/service-types', {
    method: 'GET',
  })
  if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch cities')
  }
  return response.data
}

export type ProviderData = {
  fullname: string;
  email: string;
  phoneNumber?: string;
  cuil: string;
  cityId: number;
  type: 'default' | 'boat';
  needConfirmation: boolean;
}

export const PostProvider = async (data: ProviderData) => {
  const response = await apiFetch<Provider>(`/providers`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create provider')
    }
    return response.data
}

export const PostService = async (data: Partial<Service>) => {
  const response = await apiFetch<ServiceDetail>(`/services`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create service')
    }
    return response.data
}

export const DeleteService = async (serviceId: number) => {
  const response = await apiFetch<null>(`/services/${serviceId}`, {
    method: 'DELETE',
  })
    if (!response.success) {
        throw new Error(response.error || 'Failed to delete service')
    }
    return true
}

export const PutService = async (serviceId: string, data: Partial<Service>) => {
  const response = await apiFetch<ServiceDetail>(`/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update service')
    }
    return response.data
}

export const uploadMedia = async (serviceId: string, files: FormData) => {
  const response = await apiFetch(`/services/${serviceId}/images`, {
    method: 'POST',
    body: files,
  }, {}, true);
  if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to upload media')
  }
  return response.data;
}

export const uploadOneMedia = async (serviceId: string, file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiFetch(`/services/${serviceId}/images/back`, {
    method: 'POST',
    body: formData,
  }, {}, true);
  if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to upload media')
  }
  return response.data;
}

export const deleteMedia = async (serviceId: string, mediaId: number) => {
  const response = await apiFetch(`/services/${serviceId}/images/${mediaId}`, {
    method: 'DELETE',
  });
  if (!response.success) {
      throw new Error(response.error || 'Failed to delete media')
  }
  return true;
}

export const reorderMedia = async (serviceId: string, mediaOrder: number[]) => {
  const response = await apiFetch(`/services/${serviceId}/images`, {
    method: 'PUT',
    body: JSON.stringify({ medias: mediaOrder }),
  });
  if (!response.success) {
      throw new Error(response.error || 'Failed to reorder media')
  }
  return true;
}