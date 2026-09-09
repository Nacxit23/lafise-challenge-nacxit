import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getAccountTransfers } from "@/features/transfer-list/services/transfer-list.service";
import type { Transfer, TransferList } from "@/features/transfer-list/types/transfer.type";

interface TransferListState {
  transfers: Transfer[];
  page: number;
  size: number;
  next: number;
  totalCount: number;
  createdTransfersByAccount: Record<string, Transfer[]>;
  balanceAdjustmentsByAccount: Record<string, number>;
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
  loadTransfers: (accountId: string) => Promise<void>;
  addTransfer: (transfer: Transfer) => void;
  clearTransfers: () => void;
}

const emptyTransferList: TransferList = {
  page: 0,
  size: 0,
  next: 0,
  totalCount: 0,
  items: [],
};

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

/** Store de movimientos que centraliza la consulta y el estado de la pantalla. */
const useTransferListStore = create<TransferListState>()(
  persist(
    (set, get) => ({
      transfers: emptyTransferList.items,
      page: emptyTransferList.page,
      size: emptyTransferList.size,
      next: emptyTransferList.next,
      totalCount: emptyTransferList.totalCount,
      createdTransfersByAccount: {},
      balanceAdjustmentsByAccount: {},
      selectedAccountId: null,
      isLoading: false,
      error: null,
      loadTransfers: async (accountId) => {
        set({ isLoading: true, error: null, selectedAccountId: accountId });

        try {
          const transferList = await getAccountTransfers(accountId);

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

          set({
            transfers: createdTransfers,
            page: 0,
            size: createdTransfers.length,
            next: 0,
            totalCount: createdTransfers.length,
            isLoading: false,
            error:
              createdTransfers.length > 0
                ? null
                : "No fue posible cargar los movimientos de la cuenta.",
          });
        }
      },
      addTransfer: (transfer) => {
        set((state) => {
          const debitTransfer: Transfer = { ...transfer, transactionType: "Debit" };
          const creditTransfer: Transfer = { ...transfer, transactionType: "Credit" };
          const originTransfers = mergeTransfers(
            [debitTransfer],
            state.createdTransfersByAccount[transfer.origin] ?? [],
          );
          const destinationTransfers = mergeTransfers(
            [creditTransfer],
            state.createdTransfersByAccount[transfer.destination] ?? [],
          );
          const createdTransfersByAccount = {
            ...state.createdTransfersByAccount,
            [transfer.origin]: originTransfers,
            [transfer.destination]: destinationTransfers,
          };
          const balanceAdjustmentsByAccount = {
            ...state.balanceAdjustmentsByAccount,
            [transfer.origin]:
              (state.balanceAdjustmentsByAccount[transfer.origin] ?? 0) - transfer.amount.value,
            [transfer.destination]:
              (state.balanceAdjustmentsByAccount[transfer.destination] ?? 0) +
              transfer.amount.value,
          };
          const selectedTransfer =
            state.selectedAccountId === transfer.origin
              ? debitTransfer
              : state.selectedAccountId === transfer.destination
                ? creditTransfer
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
      clearTransfers: () =>
        set({
          transfers: [],
          page: 0,
          size: 0,
          next: 0,
          totalCount: 0,
          createdTransfersByAccount: {},
          balanceAdjustmentsByAccount: {},
          selectedAccountId: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "lafise-transfer-list",
    },
  ),
);

export default useTransferListStore;
