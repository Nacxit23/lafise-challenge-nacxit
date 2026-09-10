import axios from "axios";

export const api = axios.create({
  // El navegador consume una ruta del mismo dominio. Next.js reenvía la
  // solicitud al mock y evita que CORS dependa del proveedor del backend.
  baseURL: "/api/backend",
  headers: {
    "Content-Type": "application/json",
  },
});
