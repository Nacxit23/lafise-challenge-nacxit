import type { StateCreator } from "zustand";

import { mergeTransfers } from "./transfer-list-store.helper";
import type { DemoIncomeSlice, TransferListStore } from "./transfer-list-store.type";

/** Responsabilidad: conservar el temporizador y aplicar créditos exclusivos del demo web. */
const createDemoIncomeSlice: StateCreator<TransferListStore, [], [], DemoIncomeSlice> = (set) => ({
  initializeDemoIncomeSchedule: (accountId, startedAt) => {
    set((state) => {
      if (state.lastDemoIncomeAtByAccount[accountId] !== undefined) {
        return state;
      }

      return {
        lastDemoIncomeAtByAccount: {
          ...state.lastDemoIncomeAtByAccount,
          [accountId]: startedAt,
        },
      };
    });
  },
  addDemoIncome: (transfer, creditedAt) => {
    set((state) => {
      const creditTransfer = { ...transfer, transactionType: "Credit" };
      const createdTransfersByAccount = {
        ...state.createdTransfersByAccount,
        [transfer.destination]: mergeTransfers(
          [creditTransfer],
          state.createdTransfersByAccount[transfer.destination] ?? [],
        ),
      };
      const balanceAdjustmentsByAccount = {
        ...state.balanceAdjustmentsByAccount,
        [transfer.destination]:
          (state.balanceAdjustmentsByAccount[transfer.destination] ?? 0) + transfer.amount.value,
      };
      const lastDemoIncomeAtByAccount = {
        ...state.lastDemoIncomeAtByAccount,
        [transfer.destination]: creditedAt,
      };

      if (state.selectedAccountId !== transfer.destination) {
        return {
          createdTransfersByAccount,
          balanceAdjustmentsByAccount,
          lastDemoIncomeAtByAccount,
        };
      }

      const transfers = mergeTransfers([creditTransfer], state.transfers);

      return {
        createdTransfersByAccount,
        balanceAdjustmentsByAccount,
        lastDemoIncomeAtByAccount,
        transfers,
        size: transfers.length,
        totalCount: transfers.length,
      };
    });
  },
});

export { createDemoIncomeSlice };
