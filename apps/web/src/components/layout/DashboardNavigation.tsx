"use client";

import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { dashboardMenuItems, type DashboardMenuItem } from "@/data/dashboard-menu";
import { cn } from "@/lib/utils";

interface DashboardNavigationProps {
  isMobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

const isMenuItemActive = (item: DashboardMenuItem, pathname: string) =>
  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

const MenuItems = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className="space-y-2">
      {dashboardMenuItems.map((item) => {
        const Icon = item.icon;
        const isActive = isMenuItemActive(item, pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:bg-primary/10 hover:text-primary-dark",
            )}
          >
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-surface text-primary group-hover:bg-primary/15",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span
                className={cn(
                  "mt-0.5 block truncate text-xs",
                  isActive ? "text-white/75" : "text-text-secondary",
                )}
              >
                {item.description}
              </span>
            </span>
            <ChevronRight
              className={cn(
                "size-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                isActive ? "text-white/80" : "text-text-secondary/70",
              )}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </nav>
  );
};

const NavigationHeader = ({ onClose }: { onClose?: () => void }) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">LAFISE</p>
      <h2 className="mt-2 text-lg font-semibold text-text">Menú principal</h2>
      <p className="mt-1 text-xs leading-5 text-text-secondary">
        Gestiona tu banca digital desde un solo lugar.
      </p>
    </div>
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Cerrar menú"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
    )}
  </div>
);

const DashboardNavigation = ({ isMobileOpen, onMobileOpenChange }: DashboardNavigationProps) => {
  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onMobileOpenChange(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen, onMobileOpenChange]);

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-border bg-white lg:block">
        <div className="sticky top-0 flex min-h-[calc(100vh-4rem)] flex-col p-5">
          <NavigationHeader />
          <div className="mt-8">
            <MenuItems />
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          <button
            type="button"
            className="absolute inset-0 bg-primary-dark/35 backdrop-blur-[2px]"
            onClick={() => onMobileOpenChange(false)}
            aria-label="Cerrar menú"
          />
          <aside className="relative flex h-full w-[min(20rem,calc(100%-2.5rem))] flex-col bg-white p-5 shadow-2xl">
            <NavigationHeader onClose={() => onMobileOpenChange(false)} />
            <div className="mt-8">
              <MenuItems onNavigate={() => onMobileOpenChange(false)} />
            </div>
            <div className="mt-auto rounded-xl bg-primary-dark p-4 text-white">
              <p className="text-sm font-semibold">Tu banca, siempre contigo</p>
              <p className="mt-1 text-xs leading-5 text-white/70">
                Navega de forma simple y segura.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export const MobileMenuButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
    aria-label="Abrir menú"
  >
    <Menu className="size-5" aria-hidden="true" />
  </button>
);

export default DashboardNavigation;
