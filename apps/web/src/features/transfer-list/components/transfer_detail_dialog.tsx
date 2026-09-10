"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Transfer } from "../types/transfer.type";

interface TransferDetailDialogProps {
  transfer: Transfer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatDate: (date?: string) => string;
}

const TransferDetailDialog = ({
  transfer,
  open,
  onOpenChange,
  formatDate,
}: TransferDetailDialogProps) => {
  if (!transfer) {
    return null;
  }

  const details = [
    ["transaction_date", formatDate(transfer.transactionDate)],
    ["transaction_number", transfer.transactionNumber],
    ["description", transfer.description],
    ["bank_description", transfer.bankDescription],
    ["transaction_type", transfer.transactionType],
    ["amount.value", transfer.amount.value.toString()],
    ["amount.currency", transfer.amount.currency],
    ["origin", transfer.origin],
    ["destination", transfer.destination],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle de la transacción</DialogTitle>
          <DialogDescription>
            Información completa de la referencia {transfer.transactionNumber}.
          </DialogDescription>
        </DialogHeader>

        <dl className="grid gap-3 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-surface p-3">
              <dt className="text-xs text-text-secondary">{label}</dt>
              <dd className="mt-1 break-words text-sm font-medium text-text">{value}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDetailDialog;
