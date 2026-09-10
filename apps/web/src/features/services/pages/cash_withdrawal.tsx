"use client";

import { ArrowLeft, Banknote } from "lucide-react";
import Link from "next/link";

import useAuthStore from "@/store/authStore";
import CashWithdrawalForm from "../components/CashWithdrawalForm";

const CashWithdrawalPage = () => {
  const user = useAuthStore((state) => state.session?.user);
  const accountId = user?.products.find((product) => product.type === "Account")?.id;

  return (
    <div className="min-h-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <Link
          href="/pagar"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a servicios
        </Link>

        <section>
          <div className="flex items-center gap-2 text-primary">
            <Banknote className="size-5" aria-hidden="true" />
            <p className="text-sm font-medium">Servicios</p>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">Retiro sin tarjeta</h1>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Genera un código para simular un retiro de efectivo usando el saldo de tu cuenta.
          </p>
        </section>

        {accountId ? (
          <CashWithdrawalForm accountId={accountId} />
        ) : (
          <section className="rounded-xl border border-error/30 bg-white p-6 text-sm text-error shadow-sm">
            No hay una cuenta bancaria disponible para realizar el retiro.
          </section>
        )}
      </div>
    </div>
  );
};

export default CashWithdrawalPage;
