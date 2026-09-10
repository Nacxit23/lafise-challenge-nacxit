import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAccountBalanceSlice } from "./transfer-list/account-balance.slice";
import { createDemoIncomeSlice } from "./transfer-list/demo-income.slice";
import { createInitialTransferListState } from "./transfer-list/transfer-list-store.state";
import type { TransferListStore } from "./transfer-list/transfer-list-store.type";
import { createTransferMutationSlice } from "./transfer-list/transfer-mutation.slice";
import { createTransferQuerySlice } from "./transfer-list/transfer-query.slice";

/**
 * Fachada pública del estado de transacciones.
 *
 * La implementación se divide por responsabilidades dentro de `store/transfer-list`.
 * Consulta su README para conocer el modelo de saldo y las reglas de persistencia.
 */
const useTransferListStore = create<TransferListStore>()(
  persist(
    (set, get, store) => ({
      ...createInitialTransferListState(),
      ...createTransferQuerySlice(set, get, store),
      ...createAccountBalanceSlice(set, get, store),
      ...createTransferMutationSlice(set, get, store),
      ...createDemoIncomeSlice(set, get, store),
      clearTransfers: () => set(createInitialTransferListState()),
    }),
    {
      name: "lafise-transfer-list",
    },
  ),
);

export default useTransferListStore;
