import { z } from "zod";

const accountNumberSchema = z
  .string()
  .trim()
  .min(1, "El número de cuenta es requerido")
  .regex(/^\d+$/, "El número de cuenta solo puede contener números")
  .min(6, "El número de cuenta debe tener al menos 6 dígitos");

export const createTransferSchema = (originAccount: string) =>
  z
    .object({
      destination: accountNumberSchema,
      amount: z
        .number({ error: "Ingresa un monto válido" })
        .positive("El monto debe ser mayor que cero")
        .max(999_999_999, "El monto ingresado es demasiado alto"),
    })
    .refine((values) => values.destination !== originAccount, {
      message: "La cuenta destino debe ser diferente de la cuenta origen",
      path: ["destination"],
    });

export type CreateTransferFormValues = z.infer<ReturnType<typeof createTransferSchema>>;
