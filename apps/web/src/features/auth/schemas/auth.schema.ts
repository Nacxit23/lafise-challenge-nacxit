import { z } from "zod";

//validation para la simulacion de login
export const loginSchema = z.object({
  email: z.email("Ingrese un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginForm = z.infer<typeof loginSchema>;
