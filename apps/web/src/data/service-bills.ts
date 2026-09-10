type BillableService = "Electricidad" | "Agua" | "Telecomunicaciones";

interface ServiceBill {
  serviceType: BillableService;
  serviceNumber: string;
  amount: number;
}

/**
 * Datos ficticios para consultar pagos de servicios en el demo web.
 * Estos números y montos no representan facturas reales ni consultan proveedores externos.
 */
const serviceBills: ServiceBill[] = [
  { serviceType: "Electricidad", serviceNumber: "1004509876", amount: 850 },
  { serviceType: "Electricidad", serviceNumber: "1007823415", amount: 1_250 },
  { serviceType: "Agua", serviceNumber: "2003187642", amount: 430 },
  { serviceType: "Agua", serviceNumber: "2009654128", amount: 675 },
  { serviceType: "Telecomunicaciones", serviceNumber: "3001245789", amount: 1_099 },
  { serviceType: "Telecomunicaciones", serviceNumber: "3008562147", amount: 1_499 },
];

export type { BillableService, ServiceBill };
export { serviceBills };
