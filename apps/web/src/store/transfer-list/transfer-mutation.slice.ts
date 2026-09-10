import type { StateCreator } from "zustand";

import { createTransferVariants, mergeTransfers } from "./transfer-list-store.helper";
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
      const { debit, credit } = createTransferVariants(transfer);
      const createdTransfersByAccount = {
        ...state.createdTransfersByAccount,
        [transfer.origin]: mergeTransfers(
          [debit],
          state.createdTransfersByAccount[transfer.origin] ?? [],
        ),
        ...(creditDestination
          ? {
              [transfer.destination]: mergeTransfers(
                [credit],
                state.createdTransfersByAccount[transfer.destination] ?? [],
              ),
            }
          : {}),
      };
      const balanceAdjustmentsByAccount = {
        ...state.balanceAdjustmentsByAccount,
        [transfer.origin]:
          (state.balanceAdjustmentsByAccount[transfer.origin] ?? 0) - transfer.amount.value,
        ...(creditDestination
          ? {
              [transfer.destination]:
                (state.balanceAdjustmentsByAccount[transfer.destination] ?? 0) +
                transfer.amount.value,
            }
          : {}),
      };
      const selectedTransfer =
        state.selectedAccountId === transfer.origin
          ? debit
          : creditDestination && state.selectedAccountId === transfer.destination
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
