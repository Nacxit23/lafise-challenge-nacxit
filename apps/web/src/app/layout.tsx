import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import AuthLayout from "@/components/auth/AuthLayout";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LAFISE Digital Banking",
  description: "Aplicación de banca digital para la prueba técnica",
  icons: {
    icon: "/assets/images/lafise_logo.ico",
    shortcut: "/assets/images/lafise_logo.ico",
    apple: "/assets/images/lafise_logo.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <AuthLayout>{children}</AuthLayout>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
