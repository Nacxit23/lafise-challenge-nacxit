"use client";

import { ArrowRight, Landmark, WalletCards } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import type { UserProduct } from "@/features/auth/types/auth.type";
import useTransferListStore from "@/store/transferListStore";

interface ProductMobileListProps {
  products: UserProduct[];
}

const formatBalance = (balance: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(balance);

const ProductMobileList = ({ products }: ProductMobileListProps) => {
  const accountIds = useMemo(
    () => products.filter((product) => product.type === "Account").map((product) => product.id),
    [products],
  );
  const { baseBalances, balanceAdjustments, balanceLoading, balanceErrors, loadAccountBalance } =
    useTransferListStore(
      useShallow((state) => ({
        baseBalances: state.baseBalancesByAccount,
        balanceAdjustments: state.balanceAdjustmentsByAccount,
        balanceLoading: state.balanceLoadingByAccount,
        balanceErrors: state.balanceErrorsByAccount,
        loadAccountBalance: state.loadAccountBalance,
      })),
    );

  useEffect(() => {
    const store = useTransferListStore.getState();

    accountIds.forEach((accountId) => {
      if (
        store.baseBalancesByAccount[accountId] === undefined &&
        !store.balanceLoadingByAccount[accountId]
      ) {
        void loadAccountBalance(accountId);
      }
    });
  }, [accountIds, loadAccountBalance]);

  if (products.length === 0) {
    return (
      <div className="rounded-xl bg-surface px-4 py-10 text-center text-sm text-text-secondary md:hidden">
        No hay productos asociados.
      </div>
    );
  }

  return (
    <div className="space-y-4 md:hidden">
      {products.map((product) => {
        const isAccount = product.type === "Account";
        const baseBalance = baseBalances[product.id];
        const availableBalance =
          baseBalance === undefined
            ? null
            : Math.max(baseBalance + (balanceAdjustments[product.id] ?? 0), 0);

        return (
          <article
            key={`${product.type}-${product.id}`}
            className="relative overflow-hidden rounded-2xl border border-primary/15 bg-white p-5 shadow-sm"
          >
            <span className="absolute -right-12 -top-14 size-36 rounded-full bg-primary/5" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {isAccount ? (
                    <Landmark className="size-5" aria-hidden="true" />
                  ) : (
                    <WalletCards className="size-5" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    {isAccount ? "Cuenta bancaria" : product.type}
                  </p>
                  <h3 className="mt-1 truncate font-semibold text-text">
                    {isAccount ? "Cuenta de ahorro" : "Producto financiero"}
                  </h3>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-primary-dark">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                Activo
              </span>
            </div>

            <div className="relative mt-6 grid grid-cols-[1fr_auto] items-end gap-4 border-b border-border pb-5">
              <div className="min-w-0">
                <p className="text-xs text-text-secondary">Número de producto</p>
                <p className="mt-1 truncate font-semibold tracking-wide text-text">{product.id}</p>
              </div>
              {isAccount && (
                <div className="text-right">
                  <p className="text-xs text-text-secondary">Saldo disponible</p>
                  <p className="mt-1 font-bold text-primary">
                    {balanceLoading[product.id]
                      ? "Consultando..."
                      : balanceErrors[product.id]
                        ? "No disponible"
                        : availableBalance === null
                          ? "—"
                          : formatBalance(availableBalance)}
                  </p>
                </div>
              )}
            </div>

            {isAccount && (
              <Link
                href={`/account-transactions/${product.id}`}
                className="relative mt-4 flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`Ver movimientos de la cuenta ${product.id}`}
              >
                Ver movimientos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default ProductMobileList;
