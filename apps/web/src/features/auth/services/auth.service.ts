import { fetchApi } from "@/services/fetchApi";
import type {
  Auth,
  AuthenticatedResponse,
  AuthResponse,
  User,
  UserResponse,
} from "../types/auth.type";

/**
 * Servicios responsables únicamente de comunicarse con el mock de autenticación.
 * No guardan estado ni conocen Zustand; devuelven los datos que reciben de la API.
 */

/** Autentica las credenciales y obtiene el identificador del usuario. */
export const login = (auth: Auth): Promise<AuthResponse> =>
  fetchApi<AuthResponse, Auth>("/auth/login", {
    method: "POST",
    data: auth,
  });

/** Obtiene el perfil completo usando el id devuelto por el login. */
export const getUserById = async (userId: number): Promise<User> => {
  const userResponse = await fetchApi<UserResponse>(`/users/${userId}`);

  return {
    id: userId,
    fullName: userResponse.full_name,
    profilePhoto: userResponse.profile_photo,
    products: userResponse.products,
  };
};

/**
 * Orquesta el login y la consulta del perfil para entregar una sesión completa.
 * Esta función evita que los componentes tengan que coordinar ambas peticiones.
 */
export const authenticate = async (auth: Auth): Promise<AuthenticatedResponse> => {
  const authResponse = await login(auth);
  const user = await getUserById(authResponse.user.id);

  return {
    token: authResponse.token,
    expiresIn: authResponse.expiresIn,
    user,
  };
};
