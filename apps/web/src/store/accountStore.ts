import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getAccountById } from "@/features/account-dashboard/services/account.service";
import type { Account } from "@/features/account-dashboard/types/account.type";

interface AccountState {
  account: Account | null;
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
  loadAccount: (accountId: string) => Promise<void>;
  clearAccount: () => void;
}

/** Store persistido para conservar y compartir la cuenta activa del dashboard. */
const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      account: null,
      selectedAccountId: null,
      isLoading: false,
      error: null,
      loadAccount: async (accountId) => {
        set({ isLoading: true, error: null, selectedAccountId: accountId });

        try {
          const account = await getAccountById(accountId);
          set({ account, isLoading: false });
        } catch {
          set({
            account: null,
            isLoading: false,
            error: "No fue posible cargar la información de la cuenta.",
          });
        }
      },
      clearAccount: () =>
        set({ account: null, selectedAccountId: null, isLoading: false, error: null }),
    }),
    {
      name: "lafise-account",
    },
  ),
);

export default useAccountStore;
