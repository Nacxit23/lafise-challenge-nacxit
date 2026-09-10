import type { AxiosRequestConfig } from "axios";
import { api } from "@/services/api";

/**
 * Ejecuta una petición HTTP y devuelve únicamente el contenido de la
 * respuesta. Los errores de Axios se propagan para que cada servicio pueda
 * manejarlos según su necesidad.
 */
export async function fetchApi<TResponse, TRequest = unknown>(
  url: string,
  config: AxiosRequestConfig<TRequest> = {},
): Promise<TResponse> {
  const response = await api.request<TResponse>({
    ...config,
    url,
  });

  return response.data;
}
