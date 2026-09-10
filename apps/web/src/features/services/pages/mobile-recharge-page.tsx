"use client";

import { ArrowLeft, Smartphone } from "lucide-react";
import Link from "next/link";

import useAuthStore from "@/store/authStore";
import MobileRechargeForm from "../components/MobileRechargeForm";

const MobileRechargePage = () => {
  const user = useAuthStore((state) => state.session?.user);
  const accountId = user?.products.find((product) => product.type === "Account")?.id;

  return (
    <div className="min-h-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a servicios
        </Link>

        <section>
          <div className="flex items-center gap-2 text-primary">
            <Smartphone className="size-5" aria-hidden="true" />
            <p className="text-sm font-medium">Servicios</p>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">Recargas celulares</h1>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Realiza una recarga demostrativa para un número Claro o Tigo desde tu cuenta.
          </p>
        </section>

        {accountId ? (
          <MobileRechargeForm accountId={accountId} />
        ) : (
          <section className="rounded-xl border border-error/30 bg-white p-6 text-sm text-error shadow-sm">
            No hay una cuenta bancaria disponible para realizar la recarga.
          </section>
        )}
      </div>
    </div>
  );
};

export default MobileRechargePage;
