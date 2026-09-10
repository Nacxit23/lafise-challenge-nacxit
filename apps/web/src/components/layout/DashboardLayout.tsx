"use client";

import { useState, type ReactNode } from "react";

import DashboardNavigation from "@/components/layout/DashboardNavigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
