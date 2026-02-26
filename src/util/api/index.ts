import { getTenantHeaders } from "../tenant.util";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const isFormData = body instanceof FormData;
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...getTenantHeaders(),
      },
      credentials: "include",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || "Request failed",
        data,
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>("GET", endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>("POST", endpoint, body),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>("PUT", endpoint, body),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>("PATCH", endpoint, body),
  delete: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};

export default api;
