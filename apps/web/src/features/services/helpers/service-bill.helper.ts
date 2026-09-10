import { serviceBills, type BillableService, type ServiceBill } from "@/data/service-bills";

/**
 * Consulta la colección local de facturas ficticias del demo.
 * Para permitir cualquier número, los números no registrados reciben uno de
 * los montos demostrativos disponibles para el servicio seleccionado.
 */
const getServiceBill = (
  serviceType: BillableService,
  serviceNumber: string,
): ServiceBill | null => {
  const registeredBill = serviceBills.find(
    (bill) => bill.serviceType === serviceType && bill.serviceNumber === serviceNumber,
  );

  if (registeredBill) {
    return registeredBill;
  }

  const serviceOptions = serviceBills.filter((bill) => bill.serviceType === serviceType);

  if (serviceOptions.length === 0) {
    return null;
  }

  const optionIndex = [...serviceNumber].reduce(
    (hash, digit) => (hash * 10 + Number(digit)) % serviceOptions.length,
    0,
  );

  return { ...serviceOptions[optionIndex], serviceNumber };
};

export { getServiceBill };
