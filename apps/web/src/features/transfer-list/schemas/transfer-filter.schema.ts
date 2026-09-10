import { z } from "zod";

const optionalPositiveAmount = z
  .number({ error: "Ingresa un monto válido" })
  .positive("El monto debe ser mayor que cero")
  .optional();

const transferFilterSchema = z
  .object({
    month: z
      .string()
      .refine((value) => value === "" || /^\d{4}-\d{2}$/.test(value), "Selecciona un mes válido"),
    transactionNumber: z.string().refine(
      (value) => {
        const transactionNumber = value.trim();

        return transactionNumber === "" || /^\d+$/.test(transactionNumber);
      },
      { message: "El número de transacción solo debe contener dígitos" },
    ),
    amountMode: z.enum(["exact", "range"]),
    exactAmount: optionalPositiveAmount,
    minimumAmount: optionalPositiveAmount,
    maximumAmount: optionalPositiveAmount,
  })
  .superRefine((values, context) => {
    if (values.amountMode !== "range") {
      return;
    }

    const hasMinimum = values.minimumAmount !== undefined;
    const hasMaximum = values.maximumAmount !== undefined;

    if (hasMinimum !== hasMaximum) {
      context.addIssue({
        code: "custom",
        path: [hasMinimum ? "maximumAmount" : "minimumAmount"],
        message: "Completa ambos límites del rango",
      });
      return;
    }

    if (
      values.minimumAmount !== undefined &&
      values.maximumAmount !== undefined &&
      values.minimumAmount > values.maximumAmount
    ) {
      context.addIssue({
        code: "custom",
        path: ["maximumAmount"],
        message: "El monto máximo debe ser mayor o igual al mínimo",
      });
    }
  });

export { transferFilterSchema };
