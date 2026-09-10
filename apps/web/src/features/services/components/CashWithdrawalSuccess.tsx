"use client";

import { Check, Copy, ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CashWithdrawalSuccessProps {
  amount: number;
  code: string;
  accountId: string;
  onCreateAnother: () => void;
  onViewServices: () => void;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(value);

const CashWithdrawalSuccess = ({
  amount,
  code,
  accountId,
  onCreateAnother,
  onViewServices,
}: CashWithdrawalSuccessProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      toast.success("Código copiado");
    } catch {
      toast.error("No fue posible copiar el código");
    }
  };

  return (
    <section
      className="rounded-xl border border-border bg-white p-5 text-center shadow-sm sm:p-8"
      aria-live="polite"
    >
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-primary">
        <Check className="size-9" aria-hidden="true" />
      </div>

      <p className="mt-5 text-sm font-medium text-primary">Paso 3 de 3</p>
      <h2 className="mt-1 text-2xl font-semibold text-text">Retiro generado con éxito</h2>
      <p className="mt-2 text-sm text-text-secondary">
        Presenta este código para completar el retiro de efectivo.
      </p>

      <div className="mx-auto mt-6 max-w-md rounded-xl bg-primary/10 px-4 py-5">
        <p className="text-xs text-text-secondary">Código de retiro</p>
        <p className="mt-2 text-3xl font-bold tracking-[0.3em] text-primary">{code}</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => void handleCopy()}>
          {isCopied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          {isCopied ? "Código copiado" : "Copiar código"}
        </Button>
        <dl className="mt-5 grid gap-4 border-t border-primary/15 pt-4 text-left sm:grid-cols-2">
          <div>
            <dt className="text-xs text-text-secondary">Monto</dt>
            <dd className="mt-1 text-sm font-medium text-text">{formatAmount(amount)}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">Cuenta debitada</dt>
            <dd className="mt-1 break-all text-sm font-medium text-text">{accountId}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-left text-xs leading-5 text-text-secondary">
        <strong className="font-semibold text-primary-dark">Operación demostrativa:</strong> este
        código es una simulación para mostrar el flujo de retiro sin tarjeta. No es una autorización
        bancaria real.
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        <Button type="button" variant="outline" onClick={onCreateAnother}>
          <Plus className="size-4" aria-hidden="true" />
          Realizar otro retiro
        </Button>
        <Button
          type="button"
          onClick={onViewServices}
          className="bg-primary text-white hover:bg-primary-dark"
        >
          Ver servicios
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
};

export default CashWithdrawalSuccess;
