"use client";

import { ArrowRightLeft, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { Account } from "../types/account.type";
import TransferDialog from "./transfer_dialog";

interface AccountActionsProps {
  account: Account;
  onView?: (account: Account) => void;
  onTransfer?: (account: Account) => void;
}

const AccountActions = ({ account, onView }: AccountActionsProps) => {
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const handleView = () => {
    onView?.(account);

    if (!onView) {
      toast.info("El detalle de la cuenta estará disponible próximamente.");
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={handleView}
        className="border-primary text-primary hover:bg-primary/10"
      >
        <Eye className="size-4" aria-hidden="true" />
        Ver
      </Button>
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogTrigger asChild>
          <Button type="button" className="bg-primary text-white hover:bg-primary-dark">
            <ArrowRightLeft className="size-4" aria-hidden="true" />
            Transferir
          </Button>
        </DialogTrigger>
        <TransferDialog account={account} />
      </Dialog>
    </div>
  );
};

export default AccountActions;
