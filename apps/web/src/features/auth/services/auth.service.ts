import { fetchApi } from "@/services/fetchApi";
import type { Auth, AuthResponse } from "../types/auth.type";

// auth simulada apartir del mock se usa correo y password simulada

export const login = (auth: Auth): Promise<AuthResponse> =>
  fetchApi<AuthResponse, Auth>("/auth/login", {
    method: "POST",
    data: auth,
  });
