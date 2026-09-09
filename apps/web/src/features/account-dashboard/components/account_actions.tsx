"use client";

import { ArrowRightLeft, Eye } from "lucide-react";
import { toast } from "sonner";

import type { Account } from "../types/account.type";

interface AccountActionsProps {
  account: Account;
  onView?: (account: Account) => void;
  onTransfer?: (account: Account) => void;
}

const AccountActions = ({ account, onView, onTransfer }: AccountActionsProps) => {
  const handleView = () => {
    onView?.(account);

    if (!onView) {
      toast.info("El detalle de la cuenta estará disponible próximamente.");
    }
  };

  const handleTransfer = () => {
    onTransfer?.(account);

    if (!onTransfer) {
      toast.info("La transferencia estará disponible próximamente.");
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={handleView}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Eye className="size-4" aria-hidden="true" />
        Ver
      </button>
      <button
        type="button"
        onClick={handleTransfer}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowRightLeft className="size-4" aria-hidden="true" />
        Transferir
      </button>
    </div>
  );
};

export default AccountActions;
