import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getAccountById } from "@/features/account-dashboard/services/account.service";
import { getAccountTransfers } from "@/features/transfer-list/services/transfer-list.service";
import type { Transfer, TransferList } from "@/features/transfer-list/types/transfer.type";

interface TransferListState {
  transfers: Transfer[];
  page: number;
  size: number;
  next: number;
  totalCount: number;
  createdTransfersByAccount: Record<string, Transfer[]>;
  baseBalancesByAccount: Record<string, number>;
  balanceAdjustmentsByAccount: Record<string, number>;
  balanceLoadingByAccount: Record<string, boolean>;
  balanceErrorsByAccount: Record<string, string | null>;
  lastDemoIncomeAtByAccount: Record<string, number>;
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
  loadTransfers: (accountId: string) => Promise<void>;
  loadAccountBalance: (accountId: string) => Promise<void>;
  setBaseBalance: (accountId: string, balance: number) => void;
  getAvailableBalance: (accountId: string) => number | null;
  addTransfer: (transfer: Transfer, creditDestination: boolean) => void;
  initializeDemoIncomeSchedule: (accountId: string, startedAt: number) => void;
  addDemoIncome: (transfer: Transfer, creditedAt: number) => void;
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
      baseBalancesByAccount: {},
      balanceAdjustmentsByAccount: {},
      balanceLoadingByAccount: {},
      balanceErrorsByAccount: {},
      lastDemoIncomeAtByAccount: {},
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
      addTransfer: (transfer, creditDestination) => {
        set((state) => {
          const debitTransfer: Transfer = { ...transfer, transactionType: "Debit" };
          const creditTransfer: Transfer = { ...transfer, transactionType: "Credit" };
          const originTransfers = mergeTransfers(
            [debitTransfer],
            state.createdTransfersByAccount[transfer.origin] ?? [],
          );
          const createdTransfersByAccount = {
            ...state.createdTransfersByAccount,
            [transfer.origin]: originTransfers,
            ...(creditDestination
              ? {
                  [transfer.destination]: mergeTransfers(
                    [creditTransfer],
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
              ? debitTransfer
              : creditDestination && state.selectedAccountId === transfer.destination
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
          const destinationTransfer: Transfer = {
            ...transfer,
            transactionType: "Credit",
          };
          const destinationTransfers = mergeTransfers(
            [destinationTransfer],
            state.createdTransfersByAccount[transfer.destination] ?? [],
          );
          const createdTransfersByAccount = {
            ...state.createdTransfersByAccount,
            [transfer.destination]: destinationTransfers,
          };
          const balanceAdjustmentsByAccount = {
            ...state.balanceAdjustmentsByAccount,
            [transfer.destination]:
              (state.balanceAdjustmentsByAccount[transfer.destination] ?? 0) +
              transfer.amount.value,
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

          const transfers = mergeTransfers([destinationTransfer], state.transfers);

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
      clearTransfers: () =>
        set({
          transfers: [],
          page: 0,
          size: 0,
          next: 0,
          totalCount: 0,
          createdTransfersByAccount: {},
          baseBalancesByAccount: {},
          balanceAdjustmentsByAccount: {},
          balanceLoadingByAccount: {},
          balanceErrorsByAccount: {},
          lastDemoIncomeAtByAccount: {},
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
