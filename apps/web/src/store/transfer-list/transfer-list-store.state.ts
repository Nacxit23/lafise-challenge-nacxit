import type { TransferListData } from "./transfer-list-store.type";

/** Crea un estado nuevo para evitar compartir referencias después de limpiar el store. */
const createInitialTransferListState = (): TransferListData => ({
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
});

export { createInitialTransferListState };
