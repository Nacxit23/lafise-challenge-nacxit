"use client";

import { Landmark } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import type { UserProduct } from "@/features/auth/types/auth.type";
import useAccountAvailableBalance from "@/hooks/useAccountAvailableBalance";
import useAccountStore from "@/store/accountStore";
import useTransferListStore from "@/store/transferListStore";
import type { AccountProductView } from "../types/account-product-view.type";
import AccountProductTable from "./account_product_table";
import ProductMobileList from "./product_mobile_list";

interface AccountProductsSummaryProps {
  product: UserProduct | null;
  userName: string;
}

const formatBalance = (balance: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(balance);

const AccountProductsSummary = ({ product, userName }: AccountProductsSummaryProps) => {
  const { account, selectedAccountId, isLoading, error, loadAccount } = useAccountStore(
    useShallow((state) => ({
      account: state.account,
      selectedAccountId: state.selectedAccountId,
      isLoading: state.isLoading,
      error: state.error,
      loadAccount: state.loadAccount,
    })),
  );
  const accountId = product?.id;
  const setBaseBalance = useTransferListStore((state) => state.setBaseBalance);
  const availableBalance = useAccountAvailableBalance(accountId ?? "");

  useEffect(() => {
    if (!accountId) {
      return;
    }

    void loadAccount(accountId).then((loadedAccount) => {
      if (loadedAccount) {
        setBaseBalance(accountId, loadedAccount.balance);
      }
    });
  }, [accountId, loadAccount, setBaseBalance]);

  const currentAccount = selectedAccountId === accountId ? account : null;
  const balanceLabel = isLoading
    ? "Consultando..."
    : error && availableBalance === null
      ? "No disponible"
      : availableBalance === null
        ? "—"
        : formatBalance(availableBalance);
  const accountProduct: AccountProductView | null = accountId
    ? {
        accountId,
        description: currentAccount?.alias ?? "Cuenta bancaria",
        balanceLabel,
      }
    : null;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <Landmark className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-text">Cuentas bancarias</h2>
              <p className="mt-1 text-xs uppercase text-text-secondary">{userName}</p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {accountProduct ? "1 cuenta" : "Sin cuentas"}
          </span>
        </header>

        <ProductMobileList product={accountProduct} />
        <AccountProductTable product={accountProduct} />
      </section>

      <section className="flex flex-col gap-2 rounded-xl border border-border bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-text">Total cuentas bancarias</p>
        <p className="text-lg font-bold text-primary">
          {accountProduct?.balanceLabel ?? formatBalance(0)}
        </p>
      </section>
    </div>
  );
};

export default AccountProductsSummary;
