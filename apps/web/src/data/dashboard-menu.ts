import { CreditCard, WalletCards, type LucideIcon } from "lucide-react";

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
    label: "Servicios",
    description: "Accede a servicios demostrativos",
    href: "/pagar",
    icon: CreditCard,
  },
];
