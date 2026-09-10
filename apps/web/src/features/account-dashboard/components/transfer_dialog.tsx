"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { DollarSign, Globe2, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Account } from "../types/account.type";

interface TransferDialogProps {
  account: Account;
  productNumber: string;
}

const transferOptions: Array<{
  id: "transfer" | "other-banks";
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "transfer",
    label: "Transferencia",
    description: "A otra cuenta LAFISE",
    icon: DollarSign,
  },
  {
    id: "other-banks",
    label: "Otros bancos",
    description: "A una cuenta de otro banco",
    icon: Globe2,
  },
];

const TransferDialog = ({ account, productNumber }: TransferDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = (url: string) => {
    setSelectedOption(url);
    router.push(`/account-transactions/${productNumber}/create?type=${url}`);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Realizar transferencia</DialogTitle>
        <DialogDescription>
          Selecciona el tipo de transferencia para tu cuenta {account.accountNumber}.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 sm:grid-cols-2">
        {transferOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOption === option.id;

          return (
            <Button
              key={option.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              onClick={() => handleConfirm(option.id)}
              aria-pressed={isSelected}
              className="h-auto justify-start gap-3 whitespace-normal px-4 py-4 text-left"
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span>
                <span className="block font-medium">{option.label}</span>
                <span
                  className={`mt-1 block text-xs ${
                    isSelected ? "text-primary-foreground/75" : "text-text-secondary"
                  }`}
                >
                  {option.description}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </DialogContent>
  );
};

export default TransferDialog;
