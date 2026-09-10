import type { StateCreator } from "zustand";

import {
  calculateAccountBalanceAdjustment,
  createTransferVariants,
  mergeTransfers,
  normalizeTransferAmount,
} from "./transfer-list-store.helper";
import type { TransferListStore, TransferMutationSlice } from "./transfer-list-store.type";

/** Responsabilidad: aplicar atómicamente una transferencia a origen y destino. */
const createTransferMutationSlice: StateCreator<
  TransferListStore,
  [],
  [],
  TransferMutationSlice
> = (set) => ({
  addTransfer: (transfer, creditDestination) => {
    set((state) => {
      const normalizedTransfer = normalizeTransferAmount(transfer);
      const { debit, credit } = createTransferVariants(normalizedTransfer);
      const createdTransfersByAccount = {
        ...state.createdTransfersByAccount,
        [normalizedTransfer.origin]: mergeTransfers(
          [debit],
          state.createdTransfersByAccount[normalizedTransfer.origin] ?? [],
        ),
        ...(creditDestination
          ? {
              [normalizedTransfer.destination]: mergeTransfers(
                [credit],
                state.createdTransfersByAccount[normalizedTransfer.destination] ?? [],
              ),
            }
          : {}),
      };
      const balanceAdjustmentsByAccount = {
        ...state.balanceAdjustmentsByAccount,
        [normalizedTransfer.origin]: calculateAccountBalanceAdjustment(
          createdTransfersByAccount[normalizedTransfer.origin],
        ),
        ...(creditDestination
          ? {
              [normalizedTransfer.destination]: calculateAccountBalanceAdjustment(
                createdTransfersByAccount[normalizedTransfer.destination],
              ),
            }
          : {}),
      };
      const selectedTransfer =
        state.selectedAccountId === normalizedTransfer.origin
          ? debit
          : creditDestination && state.selectedAccountId === normalizedTransfer.destination
            ? credit
            : null;

      if (!selectedTransfer) {
        return { createdTransfersByAccount, balanceAdjustmentsByAccount };
      }

      const transfers = mergeTransfers([selectedTransfer], state.transfers);

      return {
        createdTransfersByAccount,
        balanceAdjustmentsByAccount,
        transfers,
        size: transfers.length,
        totalCount: transfers.length,
      };
    });
  },
});

export { createTransferMutationSlice };
