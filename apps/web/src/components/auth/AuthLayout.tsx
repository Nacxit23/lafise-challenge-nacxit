"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoginAuth from "@/features/auth/pages/login";
import useAuthStore from "@/store/authStore";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const initialRouteHandled = useRef(false);

  useEffect(() => {
    queueMicrotask(() => setCurrentTime(Date.now()));
  }, []);

  useEffect(() => {
    if (!hydrated || !session) {
      return;
    }

    const remainingTime = session.expiresAt - Date.now();

    if (remainingTime <= 0) {
      queueMicrotask(clearAuth);
      return;
    }

    const timeoutId = window.setTimeout(clearAuth, remainingTime);

    return () => window.clearTimeout(timeoutId);
  }, [clearAuth, hydrated, session]);

  const isAuthenticated =
    session !== null && currentTime !== null && session.expiresAt > currentTime;

  useEffect(() => {
    if (!hydrated || currentTime === null) {
      return;
    }

    if (!initialRouteHandled.current) {
      initialRouteHandled.current = true;

      if (pathname !== "/") {
        router.replace("/");
        return;
      }
    }

    if (!isAuthenticated && pathname !== "/") {
      router.replace("/");
    }
  }, [currentTime, hydrated, isAuthenticated, pathname, router]);

  if (!hydrated || currentTime === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  return isAuthenticated ? <DashboardLayout>{children}</DashboardLayout> : <LoginAuth />;
};

export default AuthLayout;
