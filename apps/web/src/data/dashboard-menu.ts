import { CreditCard, LayoutGrid, WalletCards, type LucideIcon } from "lucide-react";

export interface DashboardMenuItem {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardMenuItems: DashboardMenuItem[] = [
  {
    label: "Mi producto",
    description: "Consulta tus cuentas y productos",
    href: "/",
    icon: WalletCards,
  },
  {
    label: "Pagar",
    description: "Realiza tus pagos de forma segura",
    href: "/pagar",
    icon: CreditCard,
  },
  {
    label: "Servicios",
    description: "Administra tus servicios favoritos",
    href: "/servicios",
    icon: LayoutGrid,
  },
];
