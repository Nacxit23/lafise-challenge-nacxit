"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeft, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import type { Transfer } from "@/features/transfer-list/types/transfer.type";
import useAuthStore from "@/store/authStore";
import useTransferListStore from "@/store/transferListStore";
import ConfirmTransfer from "./ConfirmTransfer";
import TransferSuccess from "./TransferSuccess";
import {
  createTransferSchema,
  type CreateTransferFormValues,
} from "../schemas/create-transfer.schema";
import { createTransfer } from "../services/create-transfer.service";

interface FormTransferProps {
  originAccount: string;
}

const FormTransfer = ({ originAccount }: FormTransferProps) => {
  const router = useRouter();
  const [pendingValues, setPendingValues] = useState<CreateTransferFormValues | null>(null);
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
      baseBalance: state.baseBalancesByAccount[originAccount],
      balanceAdjustment: state.balanceAdjustmentsByAccount[originAccount] ?? 0,
      isBalanceLoading: state.balanceLoadingByAccount[originAccount] ?? false,
      balanceError: state.balanceErrorsByAccount[originAccount],
      loadAccountBalance: state.loadAccountBalance,
      addTransfer: state.addTransfer,
    })),
  );
  const form = useForm<CreateTransferFormValues>({
    resolver: zodResolver(createTransferSchema(originAccount)),
    defaultValues: {
      destination: "",
      amount: 1000,
    },
  });
  const availableBalance =
    baseBalance === undefined ? null : Math.max(baseBalance + balanceAdjustment, 0);

  useEffect(() => {
    void loadAccountBalance(originAccount);
  }, [loadAccountBalance, originAccount]);

  const formatBalance = (value: number) =>
    new Intl.NumberFormat("es-NI", {
      style: "currency",
      currency: "NIO",
    }).format(value);

  const validateAvailableFunds = async (amount: number) => {
    let latestBalance = useTransferListStore.getState().getAvailableBalance(originAccount);

    if (latestBalance === null) {
      await useTransferListStore.getState().loadAccountBalance(originAccount);
      latestBalance = useTransferListStore.getState().getAvailableBalance(originAccount);
    }

    if (latestBalance === null) {
      toast.error("No fue posible consultar el saldo", {
        description: "Inténtalo nuevamente antes de realizar la transacción.",
      });
      return null;
    }

    latestBalance = Math.max(latestBalance, 0);

    if (latestBalance <= 0 || amount > latestBalance) {
      const message = `Saldo disponible: ${formatBalance(latestBalance)}.`;

      form.setError("amount", { type: "manual", message: "El monto supera el saldo disponible" });
      toast.error("No puede realizar la transacción por saldo insuficiente", {
        description: message,
      });
      return null;
    }

    form.clearErrors("amount");

    return latestBalance;
  };

  const handleReview = async (values: CreateTransferFormValues) => {
    const latestBalance = await validateAvailableFunds(values.amount);

    if (latestBalance !== null) {
      setPendingValues(values);
    }
  };

  const handleConfirm = async () => {
    if (!pendingValues || isConfirming) {
      return;
    }

    setIsConfirming(true);

    const latestBalance = await validateAvailableFunds(pendingValues.amount);

    if (latestBalance === null) {
      setPendingValues(null);
      setIsConfirming(false);
      return;
    }

    try {
      const transfer = await createTransfer({
        origin: originAccount,
        destination: pendingValues.destination,
        amount: {
          currency: "NIO",
          value: pendingValues.amount,
        },
      });

      const destinationIsAccountProduct =
        useAuthStore
          .getState()
          .session?.user.products.some(
            (product) => product.type === "Account" && product.id === transfer.destination,
          ) ?? false;

      addTransfer(transfer, destinationIsAccountProduct);
      toast.success("Transacción realizada correctamente", {
        description: `Referencia ${transfer.transactionNumber}`,
      });
      setCompletedTransfer(transfer);
      setPendingValues(null);
    } catch {
      toast.error("No fue posible realizar la transacción", {
        description: "Verifica los datos e inténtalo nuevamente.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCreateAnother = () => {
    form.reset({ destination: "", amount: 1000 });
    setCompletedTransfer(null);
    setPendingValues(null);
  };

  const isSubmitting = form.formState.isSubmitting;

  if (completedTransfer) {
    return (
      <TransferSuccess
        transfer={completedTransfer}
        onCreateAnother={handleCreateAnother}
        onViewTransfers={() => router.push(`/account-transactions/${originAccount}`)}
      />
    );
  }

  if (pendingValues && availableBalance !== null) {
    return (
      <ConfirmTransfer
        amount={pendingValues.amount}
        originLabel="Cuenta origen"
        originValue={originAccount}
        destinationLabel="Cuenta destino"
        destinationValue={pendingValues.destination}
        availableBalance={availableBalance}
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
          <h2 className="text-lg font-semibold text-text">Datos de la transacción</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Ingresa la cuenta destino y el monto que deseas transferir.
          </p>
        </div>

        <div
          className="flex items-center justify-between gap-4 rounded-xl bg-primary/10 px-4 py-3"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 text-primary-dark">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
              <WalletCards className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs text-text-secondary">Saldo disponible</p>
              <p className="mt-0.5 font-semibold">
                {isBalanceLoading && availableBalance === null
                  ? "Consultando..."
                  : availableBalance === null
                    ? "No disponible"
                    : formatBalance(availableBalance)}
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-primary">NIO</span>
        </div>

        {balanceError && availableBalance === null && (
          <p className="text-sm text-error">{balanceError}</p>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormInput
                label="Cuenta destino"
                placeholder="130492890"
                inputMode="numeric"
                autoComplete="off"
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormInput
                label="Monto que desea transferir"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="1000"
                value={Number.isNaN(field.value) ? "" : field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.valueAsNumber)}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isBalanceLoading || availableBalance === null}
            className="bg-primary hover:bg-primary-dark"
          >
            <ArrowRightLeft className="size-4" aria-hidden="true" />
            {isSubmitting ? "Validando..." : "Continuar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormTransfer;
