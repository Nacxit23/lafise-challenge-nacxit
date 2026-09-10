import { z } from "zod";

const cashWithdrawalSchema = z.object({
  amount: z
    .number({ error: "Ingresa un monto válido" })
    .min(100, "El monto mínimo es de NIO 100")
    .refine((value) => value % 100 === 0, "El monto debe ser de NIO 100, 200, 300, etc.")
    .max(999_999_900, "El monto ingresado es demasiado alto"),
});

type CashWithdrawalFormValues = z.infer<typeof cashWithdrawalSchema>;

export { cashWithdrawalSchema };
export type { CashWithdrawalFormValues };
