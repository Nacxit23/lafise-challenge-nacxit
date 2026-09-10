"use client";

import AccountProductsSummary from "@/features/account-dashboard/components/account_products_summary";
import { DEMO_ACCOUNT_ID } from "@/data/demo-account";
import useAuthStore from "@/store/authStore";

const AccountDashboardPage = () => {
  const user = useAuthStore((state) => state.session?.user);
  const demoAccount =
    user?.products.find(
      (product) => product.type === "Account" && product.id === DEMO_ACCOUNT_ID,
    ) ?? null;

  return (
    <div className="min-h-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div id="productos" className="mx-auto w-full max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text sm:text-3xl">Resumen de productos</h1>
            <p className="mt-3 max-w-3xl text-sm text-text-secondary">
              En esta sección se muestran los productos disponibles en la banca digital.
            </p>
          </div>
          <span className="w-fit rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary shadow-sm">
            Totales en NIO
          </span>
        </header>

        <AccountProductsSummary
          product={demoAccount}
          userName={user?.fullName ?? "Cliente LAFISE"}
        />
      </div>
    </div>
  );
};

export default AccountDashboardPage;
