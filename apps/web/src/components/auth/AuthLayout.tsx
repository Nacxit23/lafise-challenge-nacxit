"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import LoginAuth from "@/features/auth/pages/login";
import useAuthStore from "@/store/authStore";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

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

  if (!hydrated || currentTime === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  const isAuthenticated = session !== null && session.expiresAt > currentTime;

  return isAuthenticated ? <>{children}</> : <LoginAuth />;
};

export default AuthLayout;
