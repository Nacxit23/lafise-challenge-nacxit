"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import logoLafise from "@/assets/images/auth/logo-LAFISE.svg";

import useAuthStore from "@/store/authStore";
import { MobileMenuButton } from "@/components/layout/DashboardNavigation";
import { Button } from "../ui/button";

interface HeaderProps {
  onOpenMenu?: () => void;
}

const Header = ({ onOpenMenu }: HeaderProps) => {
  const router = useRouter();
  const { user, lastLoginAt, clearAuth } = useAuthStore(
    useShallow((state) => ({
      user: state.session?.user,
      lastLoginAt: state.session?.lastLoginAt,
      clearAuth: state.clearAuth,
    })),
  );
  const displayName = user?.fullName ?? "Cliente LAFISE";
  const formattedLastLogin = lastLoginAt
    ? new Intl.DateTimeFormat("es-NI", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(lastLoginAt))
    : "No disponible";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    clearAuth();
    router.replace("/");
  };

  return (
    <header className="border-b border-primary-dark/30 bg-primary text-white shadow-sm">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {onOpenMenu && <MobileMenuButton onClick={onOpenMenu} />}
          <Link
            href="/"
            aria-label="Ir al inicio"
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Image
              src={logoLafise}
              alt="Logo de LAFISE"
              width={112}
              height={36}
              className="brightness-0 invert"
              priority
            />
          </Link>
          <span className="hidden border-l border-white/30 pl-4 text-sm font-medium sm:inline">
            Banca Digital
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-white/15 text-sm font-semibold text-white">
            {user?.profilePhoto ? (
              <Image
                src={user.profilePhoto}
                alt={`Foto de perfil de ${displayName}`}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              initials || "CL"
            )}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-white/75">Bienvenido</p>
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-white/75">Último ingreso: {formattedLastLogin}</p>
          </div>
          <Button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Salir</span>
            <span className="sr-only sm:hidden">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
