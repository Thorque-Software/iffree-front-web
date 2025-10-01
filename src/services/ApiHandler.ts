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
import { getTodayFormatted } from "@/utils/utils";

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

export const getReservations = (params: {
  page: number;
  pageSize: number;
  search?: string;
}) => fetchList<Reservation>("/reservations", params);

export const getProviders = (params: {
  page: number;
  pageSize: number;
  search?: string;
}) =>
  fetchList<Provider>("/providers", {
    ...params,
    fromDate: getTodayFormatted(),
  });

export const getServiceDetails = (params: {
  page: number;
  pageSize: number;
  filters?: Record<string, any>;
}) => fetchList<ServiceDetail>("/services", { ...params, ...params.filters });

export const getOneServiceDetail = (id: string) =>
  fetchOne<ServiceDetail>(`/services/${id}`);

// ---------- Cities / Service Types ----------
export const getCities = () => fetchList<City>("/cities");
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

export const DeleteService = (id: number) => del(`/services/${id}`);

export const PutService = (id: string, data: Partial<Service>) =>
  put<ServiceDetail>(`/services/${id}`, data);

// ---------- Media ----------
export const uploadMedia = async (serviceId: string, files: FormData) => {
  const response = await apiFetch(`/services/${serviceId}/images`, {
    method: "POST",
    body: files,
  }, {}, true);
  if (!response.success || !response.data)
    throw new Error(response.error || "Failed to upload media");
  return response.data;
};

export const uploadOneMedia = async (serviceId: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return uploadMedia(`${serviceId}/images/back`, formData);
};

export const deleteMedia = (serviceId: string, mediaId: number) =>
  del(`/services/${serviceId}/images/${mediaId}`);

export const reorderMedia = (serviceId: string, mediaOrder: number[]) =>
  put(`/services/${serviceId}/images`, { medias: mediaOrder });
