import { apiFetch } from "@/lib/fetcher";
import type {
  Shift,
  Reservation,
  Provider,
  ServiceDetail,
  City,
  ServiceType,
  Service,
} from "@/types/domain";
import { addOneDay, getTodayFormatted } from "@/utils/utils";

// ---------- Tipos Genéricos ----------
type PaginatedResponse<T> = {
  items: T[];
  pagination: { page: number; pageSize: number };
  total: number;
};

// ---------- Utilidad para GET con Query ----------
const buildParams = (params: Record<string, any>) =>
  new URLSearchParams(
    Object.entries(params).reduce((acc, [k, v]) => {
      if (v !== undefined && v !== null && v !== "") acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

const fetchList = async <T>(
  url: string,
  params?: Record<string, any>
): Promise<PaginatedResponse<T>> => {
  const query = params ? `?${buildParams(params)}` : "";
  const response = await apiFetch<PaginatedResponse<T>>(`${url}${query}`, {
    method: "GET",
  });
  if (!response.success || !response.data)
    throw new Error(response.error || `Failed to fetch ${url}`);
  return response.data;
};

const fetchOne = async <T>(url: string): Promise<T> => {
  const response = await apiFetch<T>(url, { method: "GET" });
  if (!response.success || !response.data)
    throw new Error(response.error || `Failed to fetch ${url}`);
  return response.data;
};

// ---------- Shifts / Reservations / Providers / Services ----------
export type ShiftsPost = {
  serviceId: number;
  start: string;
  end?: string;
  capacity: number;
  status: number;
};


export const getShifts = (params: {
  page: number;
  pageSize: number;
  search?: string;
  serviceId?: string;
}) =>
  fetchList<Shift>("/shifts", {
    ...params,
    fromDate: getTodayFormatted(),
  });

export const getShiftsProvider = (providerId: string, params: {
  page: number;
  pageSize: number;
}) =>
  fetchList<Shift>(`/providers/${providerId}/shifts`, {
    ...params,
    fromDate: getTodayFormatted(),
  });

  export const getOneShiftProvider = (providerId: string, shiftId: string) =>
  fetchOne<Shift>(`/providers/${providerId}/shifts/${shiftId}`);

export const getShiftsServicesByDate = (providerId: string, date: string ,serviceId?: number, dateTo?: string) =>
  fetchList<Shift>(`/providers/${providerId}/shifts`, {
    fromDate: date,
    toDate: dateTo || addOneDay(date),
    page: 1,
    pageSize: 100,
    serviceId,
  });

export const getReservations = (params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, any>;
}) => {
  const { filters, ...rest } = params;
  return fetchList<Reservation>("/reservations", { ...rest, ...filters });
}

export const getReservationProviderById = (providerId: string, id: string) =>
  fetchOne<Reservation>(`/providers/${providerId}/reservations/${id}`);

export const getReservationsProvider = (providerId: string, params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, any>;
}) => {
  const { filters, ...rest } = params;
  return fetchList<Reservation>(`/providers/${providerId}/reservations`, { ...rest, ...filters });
}

export const getProviders = (params: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, any>;
}) => {
  const { filters, ...rest } = params;
  return fetchList<Provider>("/providers", { ...rest, ...filters });
};
export const getServiceDetails = (params: {
  page: number;
  pageSize: number;
  filters?: Record<string, any>;
}) => {
  const { filters, ...rest } = params;
  return fetchList<ServiceDetail>("/services", { ...rest, ...filters });
};
export const getOneServiceDetail = (id: string) =>
  fetchOne<ServiceDetail>(`/services/${id}`);

export const getOneServiceDetailProvider = (providerId: string, serviceId: string) =>
  fetchOne<ServiceDetail>(`/providers/${providerId}/services/${serviceId}`);

export const getProviderServices = (providerId: string,params: {
  page: number;
  pageSize: number;
  filters?: Record<string, any>;
}) => {
  const { filters, ...rest } = params;
  return fetchList<ServiceDetail>(`/providers/${providerId}/services`, { ...rest, ...filters });
};
export const getOneProvider = (providerId: string) =>
  fetchOne<Provider>(`/providers/${providerId}`);

// ---------- Cities / Service Types ----------
export const getCities = () => fetchList<City>("/cities",{ page: 1, pageSize: 100 });
export const getServiceTypes = () => fetchList<ServiceType>("/service-types");

// ---------- CRUD Provider / Services ----------
export type ProviderData = {
  fullname: string;
  email: string;
  phoneNumber?: string;
  cuil: string;
  cityId: number;
  type: "default" | "boat";
  needConfirmation: boolean;
};

const post = async <T>(url: string, body: any) => {
  const response = await apiFetch<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.success || !response.data)
    throw new Error(response.error || `Failed to create ${url}`);
  return response.data;
};

const put = async <T>(url: string, body: any) => {
  const response = await apiFetch<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!response.success || !response.data)
    throw new Error(response.error || `Failed to update ${url}`);
  return response.data;
};

const del = async (url: string) => {
  const response = await apiFetch<null>(url, { method: "DELETE" });
  if (!response.success)
    throw new Error(response.error || `Failed to delete ${url}`);
  return true;
};

export const PostProvider = (data: ProviderData) =>
  post<Provider>("/providers", data);

export const PostService = (data: Partial<Service>) =>
  post<ServiceDetail>("/services", data);

export const PostProviderService = (providerId: string, data: Partial<Service>) =>
  post<ServiceDetail>(`/providers/${providerId}/services`, data);

export const PostProviderReservation = (providerId: string, data: Partial<Reservation>) =>
  post<Reservation>(`/providers/${providerId}/reservations`, data);

export const PostProviderShift = (providerId: string, data: ShiftsPost[]) =>
  post<Shift>(`/providers/${providerId}/shifts`, data);

export const PutProviderReservationStatus = (providerId:string, id: string, status: string) =>
  put<Provider>(`/providers/${providerId}/reservations/${id}`, { status });

export const PutProviderReservationToConfirm = (providerId:string, id: string, status: "confirm" | "decline") =>
  put<Provider>(`/providers/${providerId}/reservations/${id}/${status}`, {});

export const PutProvider = (id: string, data: Partial<ProviderData>) =>
  put<Provider>(`/providers/${id}`, data);

export const DeleteService = (id: number) => del(`/services/${id}`);

export const DeleteProviderReservation = (providerId: string, id: string) =>
  del(`/providers/${providerId}/reservations/${id}`);

export const DeleteProviderShift = (providerId: string, shiftId: string) =>
  del(`/providers/${providerId}/shifts/${shiftId}`);

export const DeleteServiceProviders = (providerId: string, serviceId: number) => 
  del(`/providers/${providerId}/services/${serviceId}`);

export const PutService = (id: string, data: Partial<Service>) =>
  put<ServiceDetail>(`/services/${id}`, data);

export const PutServiceProvider = (providerId: string, serviceId: string, data: Partial<Service>) =>
  put<ServiceDetail>(`/providers/${providerId}/services/${serviceId}`, data);

// ---------- Media ----------
export const handleMedia = async (route: string, files: FormData) => {
  const response = await apiFetch(route, {
    method: "POST",
    body: files,
  }, {}, true);
  if (!response.success || !response.data)
    throw new Error(response.error || "Failed to upload media");
  return response.data;
};

export const uploadMedia = async (serviceId: string, files: FormData) => {
  return handleMedia(`/services/${serviceId}/images`, files);
};

export const uploadProviderProfileImage = async (providerId: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file, file.name);
  return handleMedia(`/providers/${providerId}/images`, formData);
}

export const signOneMedia = async (media: { id: number; path: string }) => {
  return post<{ mediaSign: { id: number; url: string } []}>('/medias', { medias: [{ id: media.id, path: media.path }] });
}

export const uploadOneMedia = async (serviceId: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file, file.name);
  return handleMedia(`/services/${serviceId}/images/back`, formData);
};

export const deleteMedia = (serviceId: string, mediaId: number) =>
  del(`/services/${serviceId}/images/${mediaId}`);

export const reorderMedia = (serviceId: string, mediaOrder: number[]) =>
  put(`/services/${serviceId}/images`, { medias: mediaOrder });


// ---------- Geocoding Utilities ----------

export const findPlaces = async (query: string) => {
  return fetchOne<{text:string; placeId:string;}[]>(`/google-maps/get-places?input=${query}`);
};

export const placesDetails = async (placeId:string) => {
  return fetchOne<{latitude:number; longitude:number;}>(`/google-maps/get-details/${placeId}`);
};
