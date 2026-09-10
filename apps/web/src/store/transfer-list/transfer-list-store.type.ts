import type { Transfer } from "@/features/transfer-list/types/transfer.type";

/** Datos y operaciones públicas expuestas por `useTransferListStore`. */
interface TransferListStore {
  /** Movimientos visibles de la cuenta seleccionada. */
  transfers: Transfer[];
  /** Metadatos recibidos del endpoint de movimientos. */
  page: number;
  size: number;
  next: number;
  totalCount: number;
  /** Movimientos creados en el demo, agrupados por número de cuenta. */
  createdTransfersByAccount: Record<string, Transfer[]>;
  /** Saldo remoto más reciente de cada cuenta. */
  baseBalancesByAccount: Record<string, number>;
  /** Suma de débitos y créditos locales aplicada encima del saldo remoto. */
  balanceAdjustmentsByAccount: Record<string, number>;
  /** Estado independiente de consulta de saldo para cada cuenta. */
  balanceLoadingByAccount: Record<string, boolean>;
  /** Error independiente de consulta de saldo para cada cuenta. */
  balanceErrorsByAccount: Record<string, string | null>;
  /** Cuenta cuyo historial se encuentra actualmente en pantalla. */
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;

  /** Consulta y combina movimientos remotos y locales de una cuenta. */
  loadTransfers: (accountId: string) => Promise<void>;
  /** Consulta el saldo remoto y lo registra como saldo base. */
  loadAccountBalance: (accountId: string) => Promise<void>;
  /** Registra un saldo base que ya fue obtenido por otro feature. */
  setBaseBalance: (accountId: string, balance: number) => void;
  /** Retorna `saldo base + ajuste local`, o `null` si falta el saldo base. */
  getAvailableBalance: (accountId: string) => number | null;
  /** Registra el débito de origen y, cuando aplica, el crédito de destino. */
  addTransfer: (transfer: Transfer, creditDestination: boolean) => void;
  /** Restablece completamente movimientos, saldos y temporizadores. */
  clearTransfers: () => void;
}

type TransferListData = Pick<
  TransferListStore,
  | "transfers"
  | "page"
  | "size"
  | "next"
  | "totalCount"
  | "createdTransfersByAccount"
  | "baseBalancesByAccount"
  | "balanceAdjustmentsByAccount"
  | "balanceLoadingByAccount"
  | "balanceErrorsByAccount"
  | "selectedAccountId"
  | "isLoading"
  | "error"
>;

type TransferQuerySlice = Pick<TransferListStore, "loadTransfers">;
type AccountBalanceSlice = Pick<
  TransferListStore,
  "loadAccountBalance" | "setBaseBalance" | "getAvailableBalance"
>;
type TransferMutationSlice = Pick<TransferListStore, "addTransfer">;

export type {
  AccountBalanceSlice,
  TransferListData,
  TransferListStore,
  TransferMutationSlice,
  TransferQuerySlice,
};
