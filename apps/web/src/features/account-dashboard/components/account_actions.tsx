"use client";

import { ArrowRightLeft } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { Account } from "../types/account.type";
import TransferDialog from "./transfer_dialog";

interface AccountActionsProps {
  account: Account;
  productNumber: string;
}

const AccountActions = ({ account, productNumber }: AccountActionsProps) => {
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogTrigger asChild>
          <Button type="button" className="bg-primary text-white hover:bg-primary-dark">
            <ArrowRightLeft className="size-4" aria-hidden="true" />
            Transferir
          </Button>
        </DialogTrigger>
        <TransferDialog account={account} productNumber={productNumber} />
      </Dialog>
    </div>
  );
};

export default AccountActions;
