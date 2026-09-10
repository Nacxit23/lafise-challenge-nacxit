import { z } from "zod";

import { DEMO_AUTH_CREDENTIALS } from "@/data/demo-auth";

// Validación exclusiva para la simulación de inicio de sesión.
export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Ingrese el usuario")
    .refine(
      (username): boolean => username === DEMO_AUTH_CREDENTIALS.username,
      "Usuario incorrecto",
    ),
  password: z
    .string()
    .min(1, "Ingrese la contraseña")
    .refine(
      (password): boolean => password === DEMO_AUTH_CREDENTIALS.password,
      "Contraseña incorrecta",
    ),
});

export type LoginForm = z.infer<typeof loginSchema>;
