import { z } from "zod";

const mobileRechargeSchema = z.object({
  company: z.enum(["Claro", "Tigo"], { error: "Selecciona una empresa" }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "El número telefónico es requerido")
    .regex(/^\d{8}$/, "Ingresa un número telefónico de 8 dígitos"),
  amount: z
    .number({ error: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor que cero")
    .max(999_999_999, "El monto ingresado es demasiado alto"),
});

type MobileRechargeFormValues = z.infer<typeof mobileRechargeSchema>;

export { mobileRechargeSchema };
export type { MobileRechargeFormValues };
