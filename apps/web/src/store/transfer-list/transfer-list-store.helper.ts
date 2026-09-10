import type { Transfer } from "@/features/transfer-list/types/transfer.type";

/**
 * Combina dos colecciones conservando la prioridad de la primera.
 * El número de transacción funciona como identidad para evitar duplicar un
 * movimiento local cuando luego también aparece en la respuesta remota.
 */
const mergeTransfers = (preferred: Transfer[], fallback: Transfer[]) => {
  const transactionNumbers = new Set<string>();

  return [...preferred, ...fallback].filter((transfer) => {
    if (transactionNumbers.has(transfer.transactionNumber)) {
      return false;
    }

    transactionNumbers.add(transfer.transactionNumber);
    return true;
  });
};

/** Genera las dos perspectivas bancarias de una misma transferencia. */
const createTransferVariants = (transfer: Transfer) => ({
  debit: { ...transfer, transactionType: "Debit" } satisfies Transfer,
  credit: { ...transfer, transactionType: "Credit" } satisfies Transfer,
});

export { createTransferVariants, mergeTransfers };
