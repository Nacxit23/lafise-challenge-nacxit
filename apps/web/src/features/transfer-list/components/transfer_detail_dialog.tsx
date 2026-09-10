"use client";

import { ArrowDownLeft, ArrowUpRight, Building2, CalendarDays, Hash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatTransferAmount, isDebitTransfer } from "../helpers/transfer-display.helper";
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

  const isDebit = isDebitTransfer(transfer);
  const MovementIcon = isDebit ? ArrowUpRight : ArrowDownLeft;
  const movementLabel = isDebit ? "Débito" : "Crédito";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100%-3rem)] [&>button]:right-5 [&>button]:top-5 [&>button]:text-white">
        <DialogHeader className="shrink-0 space-y-0 bg-gradient-to-br from-primary-dark to-primary p-5 pr-14 text-left text-white sm:p-6 sm:pr-16">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 sm:size-12">
              <MovementIcon className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl text-white sm:text-2xl">
                Detalle de la transacción
              </DialogTitle>
              <DialogDescription className="mt-1 text-white/75">
                Consulta la información completa de este movimiento.
              </DialogDescription>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-white/20 pt-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                {movementLabel}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">
                {isDebit ? "−" : "+"}
                {formatTransferAmount(transfer.amount)}
              </p>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
              {transfer.amount.currency}
            </span>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="space-y-5">
            <section aria-labelledby="movement-information-title">
              <h3
                id="movement-information-title"
                className="text-sm font-semibold text-text sm:text-base"
              >
                Información del movimiento
              </h3>

              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface p-4 sm:col-span-2">
                  <dt className="text-xs font-medium text-text-secondary">Descripción</dt>
                  <dd className="mt-1 break-words font-semibold text-text">
                    {transfer.description || "Sin descripción"}
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-white p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                    <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                    Fecha
                  </dt>
                  <dd className="mt-2 font-semibold text-text">
                    {formatDate(transfer.transactionDate)}
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-white p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                    <Hash className="size-4 text-primary" aria-hidden="true" />
                    Número de transacción
                  </dt>
                  <dd className="mt-2 break-all font-semibold tabular-nums text-text">
                    {transfer.transactionNumber}
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-white p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                    <Building2 className="size-4 text-primary" aria-hidden="true" />
                    Banco
                  </dt>
                  <dd className="mt-2 break-words font-semibold text-text">
                    {transfer.bankDescription || "No especificado"}
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-white p-4">
                  <dt className="text-xs font-medium text-text-secondary">Tipo de transacción</dt>
                  <dd className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        isDebit ? "bg-error/15 text-error" : "bg-success/15 text-primary-dark"
                      }`}
                    >
                      {transfer.transactionType || movementLabel}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="account-information-title">
              <h3
                id="account-information-title"
                className="text-sm font-semibold text-text sm:text-base"
              >
                Cuentas relacionadas
              </h3>

              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <dt className="text-xs font-medium text-text-secondary">Cuenta origen</dt>
                  <dd className="mt-2 break-all font-semibold tabular-nums text-text">
                    {transfer.origin || "No especificada"}
                  </dd>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <dt className="text-xs font-medium text-text-secondary">Cuenta destino</dt>
                  <dd className="mt-2 break-all font-semibold tabular-nums text-text">
                    {transfer.destination || "No especificada"}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDetailDialog;
