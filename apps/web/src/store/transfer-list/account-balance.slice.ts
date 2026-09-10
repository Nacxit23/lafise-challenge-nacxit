import type { StateCreator } from "zustand";

import { getAccountById } from "@/features/account-dashboard/services/account.service";
import type { AccountBalanceSlice, TransferListStore } from "./transfer-list-store.type";

/** Responsabilidad: consultar el saldo base y calcular el saldo disponible. */
const createAccountBalanceSlice: StateCreator<TransferListStore, [], [], AccountBalanceSlice> = (
  set,
  get,
) => ({
  loadAccountBalance: async (accountId) => {
    set((state) => ({
      balanceLoadingByAccount: {
        ...state.balanceLoadingByAccount,
        [accountId]: true,
      },
      balanceErrorsByAccount: {
        ...state.balanceErrorsByAccount,
        [accountId]: null,
      },
    }));

    try {
      const account = await getAccountById(accountId);

      set((state) => ({
        baseBalancesByAccount: {
          ...state.baseBalancesByAccount,
          [accountId]: account.balance,
        },
        balanceLoadingByAccount: {
          ...state.balanceLoadingByAccount,
          [accountId]: false,
        },
      }));
    } catch {
      set((state) => ({
        balanceLoadingByAccount: {
          ...state.balanceLoadingByAccount,
          [accountId]: false,
        },
        balanceErrorsByAccount: {
          ...state.balanceErrorsByAccount,
          [accountId]: "No fue posible consultar el saldo de la cuenta.",
        },
      }));
    }
  },
  setBaseBalance: (accountId, balance) => {
    set((state) => ({
      baseBalancesByAccount: {
        ...state.baseBalancesByAccount,
        [accountId]: balance,
      },
      balanceErrorsByAccount: {
        ...state.balanceErrorsByAccount,
        [accountId]: null,
      },
    }));
  },
  getAvailableBalance: (accountId) => {
    const state = get();
    const baseBalance = state.baseBalancesByAccount[accountId];

    if (baseBalance === undefined) {
      return null;
    }

    return baseBalance + (state.balanceAdjustmentsByAccount[accountId] ?? 0);
  },
});

export { createAccountBalanceSlice };
