"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import useAuthStore from "@/store/authStore";
import useAccountStore from "@/store/accountStore";
import type { Account } from "../types/account.type";
import AccountActions from "./account_actions";
import AccountDescription from "./account_description";
import AccountHeader from "./account_header";

interface AccountInfoProps {
  onView?: (account: Account) => void;
  onTransfer?: (account: Account) => void;
}

const AccountInfo = ({ onView, onTransfer }: AccountInfoProps) => {
  const user = useAuthStore((state) => state.session?.user);
  const { account, isLoading, error, loadAccount } = useAccountStore(
    useShallow((state) => ({
      account: state.account,
      isLoading: state.isLoading,
      error: state.error,
      loadAccount: state.loadAccount,
    })),
  );

  const accountId = user?.products.find((product) => product.type === "Account")?.id;

  useEffect(() => {
    if (accountId) {
      void loadAccount(accountId);
    }
  }, [accountId, loadAccount]);

  const displayName = user?.fullName ?? "Cliente LAFISE";

  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <AccountHeader displayName={displayName} hasAccount={Boolean(account)} />
      {isLoading ? (
        <p className="mt-8 text-sm text-text-secondary">Cargando información de la cuenta...</p>
      ) : error ? (
        <p className="mt-8 text-sm text-error">{error}</p>
      ) : account ? (
        <>
          <AccountDescription account={account} />
          <AccountActions account={account} onView={onView} onTransfer={onTransfer} />
        </>
      ) : (
        <p className="mt-8 text-sm text-text-secondary">
          No hay una cuenta bancaria asociada a este usuario.
        </p>
      )}
    </article>
  );
};

export default AccountInfo;
