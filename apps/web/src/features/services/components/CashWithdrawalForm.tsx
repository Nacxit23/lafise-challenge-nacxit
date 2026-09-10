"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import ConfirmTransfer from "@/features/transfer-create/components/ConfirmTransfer";
import { createTransfer } from "@/features/transfer-create/services/create-transfer.service";
import type { Transfer } from "@/features/transfer-list/types/transfer.type";
import useTransferListStore from "@/store/transferListStore";
import { generateCashWithdrawalCode } from "../helpers/cash-withdrawal.helper";
import {
  cashWithdrawalSchema,
  type CashWithdrawalFormValues,
} from "../schemas/cash-withdrawal.schema";
import CashWithdrawalSuccess from "./CashWithdrawalSuccess";

const DEMO_WITHDRAWAL_DESTINATION = "RETIRO_SIN_TARJETA";

interface CashWithdrawalFormProps {
  accountId: string;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(value);

const CashWithdrawalForm = ({ accountId }: CashWithdrawalFormProps) => {
  const router = useRouter();
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [withdrawalCode, setWithdrawalCode] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const {
    baseBalance,
    balanceAdjustment,
    isBalanceLoading,
    balanceError,
    loadAccountBalance,
    addTransfer,
  } = useTransferListStore(
    useShallow((state) => ({
      baseBalance: state.baseBalancesByAccount[accountId],
      balanceAdjustment: state.balanceAdjustmentsByAccount[accountId] ?? 0,
      isBalanceLoading: state.balanceLoadingByAccount[accountId] ?? false,
      balanceError: state.balanceErrorsByAccount[accountId],
      loadAccountBalance: state.loadAccountBalance,
      addTransfer: state.addTransfer,
    })),
  );
  const form = useForm<CashWithdrawalFormValues>({
    resolver: zodResolver(cashWithdrawalSchema),
    defaultValues: { amount: 100 },
  });
  const availableBalance =
    baseBalance === undefined ? null : Math.max(baseBalance + balanceAdjustment, 0);

  useEffect(() => {
    void loadAccountBalance(accountId);
  }, [accountId, loadAccountBalance]);

  const validateFunds = async (amount: number) => {
    let latestBalance = useTransferListStore.getState().getAvailableBalance(accountId);

    if (latestBalance === null) {
      await useTransferListStore.getState().loadAccountBalance(accountId);
      latestBalance = useTransferListStore.getState().getAvailableBalance(accountId);
    }

    if (latestBalance === null) {
      toast.error("No fue posible consultar el saldo");
      return null;
    }

    latestBalance = Math.max(latestBalance, 0);

    if (latestBalance <= 0 || amount > latestBalance) {
      form.setError("amount", {
        type: "manual",
        message: "No puede realizar la transacción por saldo insuficiente",
      });
      toast.error("No puede realizar la transacción por saldo insuficiente", {
        description: `Saldo disponible: ${formatAmount(latestBalance)}.`,
      });
      return null;
    }

    form.clearErrors("amount");
    return latestBalance;
  };

  const handleReview = async (values: CashWithdrawalFormValues) => {
    if ((await validateFunds(values.amount)) !== null) {
      setPendingAmount(values.amount);
    }
  };

  const handleConfirm = async () => {
    if (pendingAmount === null || isConfirming) {
      return;
    }

    setIsConfirming(true);
    const latestBalance = await validateFunds(pendingAmount);

    if (latestBalance === null) {
      setPendingAmount(null);
      setIsConfirming(false);
      return;
    }

    try {
      // DEMO: se usa el mismo POST de transacciones para registrar el débito
      // local del retiro; no existe integración con un cajero real.
      const transfer = await createTransfer({
        origin: accountId,
        destination: DEMO_WITHDRAWAL_DESTINATION,
        amount: { currency: "NIO", value: pendingAmount },
      });
      const code = generateCashWithdrawalCode();
      const withdrawalTransfer: Transfer = {
        ...transfer,
        description: "Retiro sin tarjeta",
        bankDescription: "LAFISE Demo",
        transactionType: "Debit",
        origin: accountId,
        destination: DEMO_WITHDRAWAL_DESTINATION,
        amount: { currency: "NIO", value: pendingAmount },
        transactionNumber: code,
        transactionDate: transfer.transactionDate ?? new Date().toISOString(),
      };

      addTransfer(withdrawalTransfer, false);
      setWithdrawalCode(code);
      setPendingAmount(null);
      toast.success("Retiro generado correctamente");
    } catch {
      toast.error("No fue posible generar el retiro", {
        description: "Verifica los datos e inténtalo nuevamente.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCreateAnother = () => {
    form.reset({ amount: 100 });
    setWithdrawalCode(null);
    setPendingAmount(null);
  };

  if (withdrawalCode) {
    return (
      <CashWithdrawalSuccess
        amount={form.getValues("amount")}
        code={withdrawalCode}
        accountId={accountId}
        onCreateAnother={handleCreateAnother}
        onViewServices={() => router.push("/pagar")}
      />
    );
  }

  if (pendingAmount !== null && availableBalance !== null) {
    return (
      <ConfirmTransfer
        amount={pendingAmount}
        originLabel="Cuenta origen"
        originValue={accountId}
        destinationLabel="Servicio"
        destinationValue="Retiro sin tarjeta"
        availableBalance={availableBalance}
        title="Confirmar retiro sin tarjeta"
        description="Revisa el monto y confirma para generar tu código de retiro."
        amountLabel="Monto del retiro"
        confirmLabel="Generar código"
        isSubmitting={isConfirming}
        onBack={() => setPendingAmount(null)}
        onConfirm={() => void handleConfirm()}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleReview)}
        className="space-y-5 rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
        noValidate
      >
        <div>
          <p className="text-sm font-medium text-primary">Paso 1 de 3</p>
          <h2 className="mt-1 text-lg font-semibold text-text">Crear retiro sin tarjeta</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Indica el monto que deseas retirar. Solo se permiten múltiplos de NIO 100.
          </p>
        </div>

        <div
          className="flex items-center justify-between gap-4 rounded-xl bg-primary/10 px-4 py-3"
          aria-live="polite"
        >
          <div>
            <p className="text-xs text-text-secondary">Saldo disponible</p>
            <p className="mt-0.5 font-semibold text-primary">
              {isBalanceLoading && availableBalance === null
                ? "Consultando..."
                : availableBalance === null
                  ? "No disponible"
                  : formatAmount(availableBalance)}
            </p>
          </div>
          <span className="text-xs font-medium text-primary">NIO</span>
        </div>

        {balanceError && availableBalance === null && (
          <p className="text-sm text-error">{balanceError}</p>
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormInput
              label="Monto del retiro (NIO)"
              suffix="NIO"
              type="number"
              min="100"
              step="100"
              placeholder="C$ 100"
              value={Number.isNaN(field.value) ? "" : field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.valueAsNumber)}
              name={field.name}
              ref={field.ref}
            />
          )}
        />

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/pagar")}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isBalanceLoading || availableBalance === null}
            className="bg-primary text-white hover:bg-primary-dark"
          >
            <ArrowRightLeft className="size-4" aria-hidden="true" />
            {form.formState.isSubmitting ? "Validando..." : "Continuar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CashWithdrawalForm;
