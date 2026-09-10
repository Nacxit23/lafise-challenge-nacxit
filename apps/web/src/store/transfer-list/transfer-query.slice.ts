import type { StateCreator } from "zustand";

import { getAccountTransfers } from "@/features/transfer-list/services/transfer-list.service";
import { mergeTransfers } from "./transfer-list-store.helper";
import type { TransferListStore, TransferQuerySlice } from "./transfer-list-store.type";

/** Responsabilidad: consultar y preparar el historial de la cuenta activa. */
const createTransferQuerySlice: StateCreator<TransferListStore, [], [], TransferQuerySlice> = (
  set,
  get,
) => ({
  loadTransfers: async (accountId) => {
    const previousState = get();
    const cachedTransfers =
      previousState.selectedAccountId === accountId ? previousState.transfers : [];

    set({ isLoading: true, error: null, selectedAccountId: accountId });

    try {
      const transferList = await getAccountTransfers(accountId);

      // Evita que una respuesta lenta reemplace los datos de otra cuenta.
      if (get().selectedAccountId !== accountId) {
        return;
      }

      const createdTransfers = get().createdTransfersByAccount[accountId] ?? [];
      const transfers = mergeTransfers(createdTransfers, transferList.items);

      set({
        transfers,
        page: transferList.page,
        size: transfers.length,
        next: transferList.next,
        totalCount: transfers.length,
        isLoading: false,
      });
    } catch {
      if (get().selectedAccountId !== accountId) {
        return;
      }

      const createdTransfers = get().createdTransfersByAccount[accountId] ?? [];
      const transfers = mergeTransfers(createdTransfers, cachedTransfers);

      set({
        transfers,
        page: 0,
        size: transfers.length,
        next: 0,
        totalCount: transfers.length,
        isLoading: false,
        error: transfers.length > 0 ? null : "No fue posible cargar los movimientos de la cuenta.",
      });
    }
  },
});

export { createTransferQuerySlice };
