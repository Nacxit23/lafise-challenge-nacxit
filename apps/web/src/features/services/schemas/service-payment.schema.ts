import { z } from "zod";

const servicePaymentSchema = z.object({
  serviceType: z.enum(["Electricidad", "Agua", "Telecomunicaciones"], {
    error: "Selecciona un tipo de servicio",
  }),
  serviceNumber: z
    .string()
    .trim()
    .min(1, "El número de servicio es requerido")
    .regex(/^\d+$/, "El número de servicio solo debe contener dígitos"),
});

type ServicePaymentFormValues = z.infer<typeof servicePaymentSchema>;

export { servicePaymentSchema };
export type { ServicePaymentFormValues };
