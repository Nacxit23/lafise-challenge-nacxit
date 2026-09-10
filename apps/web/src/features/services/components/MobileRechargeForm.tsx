"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import ConfirmTransfer from "@/features/transfer-create/components/ConfirmTransfer";
import { createTransfer } from "@/features/transfer-create/services/create-transfer.service";
import TransferSuccess from "@/features/transfer-create/components/TransferSuccess";
import type { Transfer } from "@/features/transfer-list/types/transfer.type";
import useTransferListStore from "@/store/transferListStore";
import {
  mobileRechargeSchema,
  type MobileRechargeFormValues,
} from "../schemas/mobile-recharge.schema";

interface MobileRechargeFormProps {
  accountId: string;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(value);

const selectClassName =
  "flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const MobileRechargeForm = ({ accountId }: MobileRechargeFormProps) => {
  const router = useRouter();
  const [pendingValues, setPendingValues] = useState<MobileRechargeFormValues | null>(null);
  const [completedTransfer, setCompletedTransfer] = useState<Transfer | null>(null);
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
  const form = useForm<MobileRechargeFormValues>({
    resolver: zodResolver(mobileRechargeSchema),
    defaultValues: { company: "Claro", phoneNumber: "", amount: 100 },
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

  const handleReview = async (values: MobileRechargeFormValues) => {
    if ((await validateFunds(values.amount)) !== null) {
      setPendingValues(values);
    }
  };

  const handleConfirm = async () => {
    if (!pendingValues || isConfirming) {
      return;
    }

    setIsConfirming(true);
    const latestBalance = await validateFunds(pendingValues.amount);

    if (latestBalance === null) {
      setPendingValues(null);
      setIsConfirming(false);
      return;
    }

    try {
      // DEMO: el POST reutiliza el flujo de transacciones para registrar el débito.
      // No se realiza una recarga real ni se conecta con Claro o Tigo.
      const transfer = await createTransfer({
        origin: accountId,
        destination: pendingValues.phoneNumber,
        amount: { currency: "NIO", value: pendingValues.amount },
      });
      const rechargeTransfer: Transfer = {
        ...transfer,
        description: `Recarga celular ${pendingValues.company}`,
        bankDescription: "LAFISE Demo",
        transactionType: "Debit",
        origin: accountId,
        destination: pendingValues.phoneNumber,
        amount: { currency: "NIO", value: pendingValues.amount },
        transactionDate: transfer.transactionDate ?? new Date().toISOString(),
      };

      addTransfer(rechargeTransfer, false);
      setCompletedTransfer(rechargeTransfer);
      setPendingValues(null);
      toast.success("Recarga realizada correctamente");
    } catch {
      toast.error("No fue posible realizar la recarga", {
        description: "Verifica los datos e inténtalo nuevamente.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCreateAnother = () => {
    form.reset({ company: "Claro", phoneNumber: "", amount: 100 });
    setCompletedTransfer(null);
    setPendingValues(null);
  };

  if (completedTransfer) {
    return (
      <TransferSuccess
        transfer={completedTransfer}
        title="Recarga realizada con éxito"
        description="La recarga fue procesada y el débito quedó registrado correctamente."
        amountLabel="Monto recargado"
        destinationLabel="Número recargado"
        extraLabel="Empresa"
        extraValue={completedTransfer.description.replace("Recarga celular ", "")}
        onCreateAnother={handleCreateAnother}
        onViewTransfers={() => router.push(`/account-transactions/${accountId}`)}
      />
    );
  }

  if (pendingValues && availableBalance !== null) {
    return (
      <ConfirmTransfer
        amount={pendingValues.amount}
        originLabel="Cuenta origen"
        originValue={accountId}
        destinationLabel="Número telefónico"
        destinationValue={pendingValues.phoneNumber}
        availableBalance={availableBalance}
        title="Confirmar recarga celular"
        description={`Confirma la recarga ${pendingValues.company} al número indicado.`}
        amountLabel="Monto de la recarga"
        confirmLabel="Confirmar recarga"
        isSubmitting={isConfirming}
        onBack={() => setPendingValues(null)}
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
          <h2 className="mt-1 text-lg font-semibold text-text">Crear recarga celular</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Selecciona la empresa, ingresa el número y define el monto de la recarga.
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

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de empresa</FormLabel>
                <FormControl>
                  <select {...field} className={selectClassName}>
                    <option value="Claro">Claro</option>
                    <option value="Tigo">Tigo</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormInput
                label="Número telefónico"
                placeholder="88888888"
                inputMode="numeric"
                autoComplete="tel"
                {...field}
              />
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormInput
              label="Monto de la recarga (NIO)"
              suffix="NIO"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="C$100"
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
            <Smartphone className="size-4" aria-hidden="true" />
            {form.formState.isSubmitting ? "Validando..." : "Continuar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MobileRechargeForm;
