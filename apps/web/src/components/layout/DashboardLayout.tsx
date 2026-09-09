"use client";

import { useMemo, useState, type ReactNode } from "react";

import DashboardNavigation from "@/components/layout/DashboardNavigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import useDemoIncomeScheduler from "@/features/transfer-list/hooks/useDemoIncomeScheduler";
import useAuthStore from "@/store/authStore";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const products = useAuthStore((state) => state.session?.user.products);
  const accountIds = useMemo(
    () =>
      products?.filter((product) => product.type === "Account").map((product) => product.id) ?? [],
    [products],
  );

  useDemoIncomeScheduler(accountIds);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />
      <div className="flex flex-1">
        <DashboardNavigation
          isMobileOpen={isMobileMenuOpen}
          onMobileOpenChange={setIsMobileMenuOpen}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
