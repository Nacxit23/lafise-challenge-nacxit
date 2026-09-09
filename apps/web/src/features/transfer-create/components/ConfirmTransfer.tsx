"use client";

import { ArrowLeft, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CreateTransferFormValues } from "../schemas/create-transfer.schema";

interface ConfirmTransferProps {
  originAccount: string;
  values: CreateTransferFormValues;
  availableBalance: number;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(value);

const ConfirmTransfer = ({
  originAccount,
  values,
  availableBalance,
  isSubmitting,
  onBack,
  onConfirm,
}: ConfirmTransferProps) => (
  <section className="space-y-6 rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
    <div>
      <p className="text-sm font-medium text-primary">Paso 2 de 3</p>
      <h2 className="mt-1 text-xl font-semibold text-text">Confirmar envío</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Revisa cuidadosamente los datos antes de realizar la transacción.
      </p>
    </div>

    <div className="rounded-xl bg-primary/10 px-4 py-5 text-center">
      <p className="text-xs text-text-secondary">Monto a transferir</p>
      <p className="mt-1 text-2xl font-semibold text-primary">{formatAmount(values.amount)}</p>
      <p className="mt-1 text-xs font-medium text-primary-dark">NIO</p>
    </div>

    <dl className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg bg-surface p-4">
        <dt className="text-xs text-text-secondary">Cuenta origen</dt>
        <dd className="mt-1 break-all font-medium text-text">{originAccount}</dd>
      </div>
      <div className="rounded-lg bg-surface p-4">
        <dt className="text-xs text-text-secondary">Cuenta destino</dt>
        <dd className="mt-1 break-all font-medium text-text">{values.destination}</dd>
      </div>
      <div className="rounded-lg bg-surface p-4 sm:col-span-2">
        <dt className="text-xs text-text-secondary">Saldo disponible después del envío</dt>
        <dd className="mt-1 font-medium text-primary">
          {formatAmount(Math.max(availableBalance - values.amount, 0))}
        </dd>
      </div>
    </dl>

    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" disabled={isSubmitting} onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Editar datos
      </Button>
      <Button
        type="button"
        disabled={isSubmitting}
        onClick={onConfirm}
        className="bg-primary text-white hover:bg-primary-dark"
      >
        <Send className="size-4" aria-hidden="true" />
        {isSubmitting ? "Enviando..." : "Confirmar envío"}
      </Button>
    </div>
  </section>
);

export default ConfirmTransfer;
