import type { Transfer } from "@/features/transfer-list/types/transfer.type";

const LEGACY_DEMO_INCOME_DESCRIPTION = "Ingreso automático de demostración";

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

/** Mantiene el monto como magnitud positiva; el tipo define su signo contable. */
const normalizeTransferAmount = (transfer: Transfer): Transfer => ({
  ...transfer,
  amount: {
    ...transfer.amount,
    value: Math.abs(transfer.amount.value),
  },
});

/** Calcula el ajuste desde los movimientos para evitar que lista y saldo diverjan. */
const calculateAccountBalanceAdjustment = (transfers: Transfer[]) =>
  transfers.reduce((adjustment, transfer) => {
    const amount = Math.abs(transfer.amount.value);

    if (!Number.isFinite(amount)) {
      return adjustment;
    }

    const transactionType = transfer.transactionType.toLowerCase();

    if (transactionType === "debit") {
      return adjustment - amount;
    }

    if (transactionType === "credit") {
      return adjustment + amount;
    }

    return adjustment;
  }, 0);

const calculateBalanceAdjustmentsByAccount = (
  createdTransfersByAccount: Record<string, Transfer[]>,
) =>
  Object.fromEntries(
    Object.entries(createdTransfersByAccount).map(([accountId, transfers]) => [
      accountId,
      calculateAccountBalanceAdjustment(transfers),
    ]),
  );

/** Elimina créditos automáticos creados por versiones anteriores de la demo. */
const removeLegacyDemoIncomeFromTransferList = (transfers: Transfer[]) =>
  transfers
    .filter((transfer) => transfer.description !== LEGACY_DEMO_INCOME_DESCRIPTION)
    .map(normalizeTransferAmount);

const removeLegacyDemoIncomeTransfers = (createdTransfersByAccount: Record<string, Transfer[]>) =>
  Object.fromEntries(
    Object.entries(createdTransfersByAccount).map(([accountId, transfers]) => [
      accountId,
      removeLegacyDemoIncomeFromTransferList(transfers),
    ]),
  );

export {
  calculateAccountBalanceAdjustment,
  calculateBalanceAdjustmentsByAccount,
  createTransferVariants,
  mergeTransfers,
  normalizeTransferAmount,
  removeLegacyDemoIncomeFromTransferList,
  removeLegacyDemoIncomeTransfers,
};
