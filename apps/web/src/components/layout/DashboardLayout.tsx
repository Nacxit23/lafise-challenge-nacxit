import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
