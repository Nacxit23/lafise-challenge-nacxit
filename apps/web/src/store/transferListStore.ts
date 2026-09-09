import { create } from "zustand";

import { getAccountTransfers } from "@/features/transfer-list/services/transfer-list.service";
import type { Transfer, TransferList } from "@/features/transfer-list/types/transfer.type";

interface TransferListState {
  transfers: Transfer[];
  page: number;
  size: number;
  next: number;
  totalCount: number;
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
  loadTransfers: (accountId: string) => Promise<void>;
  clearTransfers: () => void;
}

const emptyTransferList: TransferList = {
  page: 0,
  size: 0,
  next: 0,
  totalCount: 0,
  items: [],
};

/** Store de movimientos que centraliza la consulta y el estado de la pantalla. */
const useTransferListStore = create<TransferListState>((set) => ({
  transfers: emptyTransferList.items,
  page: emptyTransferList.page,
  size: emptyTransferList.size,
  next: emptyTransferList.next,
  totalCount: emptyTransferList.totalCount,
  selectedAccountId: null,
  isLoading: false,
  error: null,
  loadTransfers: async (accountId) => {
    set({ isLoading: true, error: null, selectedAccountId: accountId });

    try {
      const transferList = await getAccountTransfers(accountId);

      set({
        transfers: transferList.items,
        page: transferList.page,
        size: transferList.size,
        next: transferList.next,
        totalCount: transferList.totalCount,
        isLoading: false,
      });
    } catch {
      set({
        transfers: [],
        page: 0,
        size: 0,
        next: 0,
        totalCount: 0,
        isLoading: false,
        error: "No fue posible cargar los movimientos de la cuenta.",
      });
    }
  },
  clearTransfers: () =>
    set({
      transfers: [],
      page: 0,
      size: 0,
      next: 0,
      totalCount: 0,
      selectedAccountId: null,
      isLoading: false,
      error: null,
    }),
}));

export default useTransferListStore;
