"use client";

import { ArrowRight, CircleCheckBig, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Transfer } from "@/features/transfer-list/types/transfer.type";

interface TransferSuccessProps {
  transfer: Transfer;
  onCreateAnother: () => void;
  onViewTransfers: () => void;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(value);

const TransferSuccess = ({ transfer, onCreateAnother, onViewTransfers }: TransferSuccessProps) => (
  <section
    className="rounded-xl border border-border bg-white p-5 text-center shadow-sm sm:p-8"
    aria-live="polite"
  >
    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-primary">
      <CircleCheckBig className="size-9" aria-hidden="true" />
    </div>

    <p className="mt-5 text-sm font-medium text-primary">Paso 3 de 3</p>
    <h2 className="mt-1 text-2xl font-semibold text-text">Envío realizado con éxito</h2>
    <p className="mt-2 text-sm text-text-secondary">
      La transacción fue procesada y registrada correctamente.
    </p>

    <div className="mx-auto mt-6 max-w-md rounded-xl bg-primary/10 px-4 py-5">
      <p className="text-xs text-text-secondary">Monto enviado</p>
      <p className="mt-1 text-2xl font-semibold text-primary">
        {formatAmount(transfer.amount.value)}
      </p>
      <dl className="mt-5 grid gap-4 border-t border-primary/15 pt-4 text-left sm:grid-cols-2">
        <div>
          <dt className="text-xs text-text-secondary">Cuenta destino</dt>
          <dd className="mt-1 break-all text-sm font-medium text-text">{transfer.destination}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Referencia</dt>
          <dd className="mt-1 break-all text-sm font-medium text-text">
            {transfer.transactionNumber}
          </dd>
        </div>
      </dl>
    </div>

    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
      <Button type="button" variant="outline" onClick={onCreateAnother}>
        <Plus className="size-4" aria-hidden="true" />
        Realizar otra
      </Button>
      <Button
        type="button"
        onClick={onViewTransfers}
        className="bg-primary text-white hover:bg-primary-dark"
      >
        Ver movimientos
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  </section>
);

export default TransferSuccess;
