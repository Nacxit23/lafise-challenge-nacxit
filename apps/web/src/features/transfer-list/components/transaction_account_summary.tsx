"use client";

import { ArrowRightLeft, Lightbulb, Smartphone, UserRound, WalletCards } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import logoLafise from "@/assets/images/auth/logo-LAFISE.svg";
import useAccountAvailableBalance from "@/hooks/useAccountAvailableBalance";
import useAccountStore from "@/store/accountStore";
import useAuthStore from "@/store/authStore";
import useTransferListStore from "@/store/transferListStore";

interface TransactionAccountSummaryProps {
  accountId: string;
}

const formatBalance = (balance: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(balance);

const maskAccountNumber = (accountNumber: number) => {
  const lastDigits = accountNumber.toString().slice(-4);

  return `•••• •••• ${lastDigits}`;
};

const accountActions = [
  {
    label: "Transferir",
    href: (accountId: string) => `/account-transactions/${accountId}/create`,
    icon: ArrowRightLeft,
  },
  {
    label: "Pagar servicios",
    href: () => "/service-payments",
    icon: Lightbulb,
  },
  {
    label: "Recargar celular",
    href: () => "/mobile-recharges",
    icon: Smartphone,
  },
];

const TransactionAccountSummary = ({ accountId }: TransactionAccountSummaryProps) => {
  const user = useAuthStore((state) => state.session?.user);
  const { account, selectedAccountId, isLoading, error, loadAccount } = useAccountStore(
    useShallow((state) => ({
      account: state.account,
      selectedAccountId: state.selectedAccountId,
      isLoading: state.isLoading,
      error: state.error,
      loadAccount: state.loadAccount,
    })),
  );
  const setBaseBalance = useTransferListStore((state) => state.setBaseBalance);
  const availableBalance = useAccountAvailableBalance(accountId);

  useEffect(() => {
    void loadAccount(accountId).then((loadedAccount) => {
      if (loadedAccount) {
        setBaseBalance(accountId, loadedAccount.balance);
      }
    });
  }, [accountId, loadAccount, setBaseBalance]);

  const currentAccount = selectedAccountId === accountId ? account : null;
  if (isLoading || (currentAccount && availableBalance === null)) {
    return (
      <section className="rounded-xl border border-border bg-white p-5 text-sm text-text-secondary shadow-sm sm:p-6">
        Cargando información de la cuenta...
      </section>
    );
  }

  if (error || !currentAccount) {
    return (
      <section className="rounded-xl border border-error/30 bg-white p-5 text-sm text-error shadow-sm sm:p-6">
        {error ?? "No fue posible consultar la información de la cuenta."}
      </section>
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(18rem,23rem)_1fr]">
      <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="relative aspect-[1.65/1] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-accent p-5 text-white shadow-lg">
          <span className="absolute -left-12 top-14 size-44 rotate-45 rounded-3xl border-[28px] border-white/10" />
          <span className="absolute -bottom-20 -right-12 size-52 rounded-full border-[34px] border-white/10" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Cuenta bancaria</p>
                <p className="mt-1 text-sm font-semibold">{currentAccount.alias}</p>
              </div>
              <Image
                src={logoLafise}
                alt="LAFISE"
                width={92}
                height={30}
                className="h-auto brightness-0 invert"
              />
            </div>

            <div>
              <p className="text-xs text-white/70">Número de cuenta</p>
              <p className="mt-1 text-base font-semibold tracking-wider sm:text-lg">
                {maskAccountNumber(currentAccount.accountNumber)}
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5">
          <div>
            <dt className="text-xs text-text-secondary">Saldo retenido</dt>
            <dd className="mt-1 font-semibold text-text">{formatBalance(0)}</dd>
          </div>
          <div className="text-right">
            <dt className="text-xs text-text-secondary">Saldo disponible</dt>
            <dd className="mt-1 text-lg font-bold text-primary">
              {formatBalance(availableBalance ?? 0)}
            </dd>
          </div>
        </dl>
      </article>

      <div className="flex min-w-0 flex-col gap-4">
        <article className="flex-1 rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <WalletCards className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
                  Historial de cuenta
                </p>
                <h1 className="mt-1 text-xl font-semibold text-text sm:text-2xl">
                  Cuenta bancaria
                </h1>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1.5 text-xs font-semibold text-primary-dark">
              <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
              Cuenta activa
            </span>
          </div>

          <dl className="grid gap-x-8 gap-y-5 pt-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-text-secondary">Usuario</dt>
              <dd className="mt-1 flex items-center gap-2 font-semibold text-text">
                <UserRound className="size-4 text-primary" aria-hidden="true" />
                <span className="truncate">{user?.fullName ?? "Cliente LAFISE"}</span>
              </dd>
              <p className="mt-1 text-xs text-text-secondary">Cliente #{user?.id ?? "--"}</p>
            </div>
            <div>
              <dt className="text-xs text-text-secondary">Producto</dt>
              <dd className="mt-1 font-semibold text-text">{currentAccount.alias}</dd>
              <p className="mt-1 text-xs text-text-secondary">Moneda NIO</p>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-text-secondary">Número de cuenta</dt>
              <dd className="mt-1 break-all text-lg font-semibold tracking-wide text-text">
                {currentAccount.accountNumber}
              </dd>
            </div>
          </dl>
        </article>

        <nav className="grid gap-3 sm:grid-cols-3" aria-label="Operaciones de la cuenta">
          {accountActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href(accountId)}
              className="flex min-h-20 items-center gap-3 rounded-xl border border-border bg-white px-5 py-4 font-medium text-text shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default TransactionAccountSummary;
