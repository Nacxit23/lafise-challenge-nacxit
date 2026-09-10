"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import ConfirmTransfer from "@/features/transfer-create/components/ConfirmTransfer";
import TransferSuccess from "@/features/transfer-create/components/TransferSuccess";
import { createTransfer } from "@/features/transfer-create/services/create-transfer.service";
import type { Transfer } from "@/features/transfer-list/types/transfer.type";
import useTransferListStore from "@/store/transferListStore";
import { getServiceBill } from "../helpers/service-bill.helper";
import {
  servicePaymentSchema,
  type ServicePaymentFormValues,
} from "../schemas/service-payment.schema";
import type { ServiceBill } from "@/data/service-bills";

interface ServicePaymentFormProps {
  accountId: string;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(value);

const selectClassName =
  "flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const ServicePaymentForm = ({ accountId }: ServicePaymentFormProps) => {
  const router = useRouter();
  const [pendingBill, setPendingBill] = useState<ServiceBill | null>(null);
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
  const form = useForm<ServicePaymentFormValues>({
    resolver: zodResolver(servicePaymentSchema),
    defaultValues: { serviceType: "Electricidad", serviceNumber: "" },
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
      toast.error("No puede realizar la transacción por saldo insuficiente", {
        description: `Saldo disponible: ${formatAmount(latestBalance)}.`,
      });
      return null;
    }

    return latestBalance;
  };

  const handleReview = async (values: ServicePaymentFormValues) => {
    const bill = getServiceBill(values.serviceType, values.serviceNumber.trim());

    if (!bill) {
      toast.error("Servicio no encontrado", {
        description: "Verifica el tipo y número usando uno de los datos demostrativos disponibles.",
      });
      return;
    }

    setPendingBill(bill);
  };

  const handleConfirm = async () => {
    if (!pendingBill || isConfirming) {
      return;
    }

    setIsConfirming(true);
    const latestBalance = await validateFunds(pendingBill.amount);

    if (latestBalance === null) {
      setPendingBill(null);
      setIsConfirming(false);
      return;
    }

    try {
      // DEMO: el POST reutiliza el flujo de transacciones para registrar el débito.
      // El monto proviene de la factura local y no de una empresa de servicios real.
      const transfer = await createTransfer({
        origin: accountId,
        destination: pendingBill.serviceNumber,
        amount: { currency: "NIO", value: pendingBill.amount },
      });
      const paymentTransfer: Transfer = {
        ...transfer,
        description: `Pago de ${pendingBill.serviceType}`,
        bankDescription: "LAFISE Demo",
        transactionType: "Debit",
        origin: accountId,
        destination: pendingBill.serviceNumber,
        amount: { currency: "NIO", value: pendingBill.amount },
        transactionDate: transfer.transactionDate ?? new Date().toISOString(),
      };

      addTransfer(paymentTransfer, false);
      setCompletedTransfer(paymentTransfer);
      setPendingBill(null);
      toast.success("Pago realizado correctamente");
    } catch {
      toast.error("No fue posible realizar el pago", {
        description: "Verifica los datos e inténtalo nuevamente.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCreateAnother = () => {
    form.reset({ serviceType: "Electricidad", serviceNumber: "" });
    setCompletedTransfer(null);
    setPendingBill(null);
  };

  if (completedTransfer) {
    return (
      <TransferSuccess
        transfer={completedTransfer}
        title="Pago realizado con éxito"
        description="El pago fue procesado y el débito quedó registrado correctamente."
        amountLabel="Costo del servicio"
        destinationLabel="Número de servicio"
        extraLabel="Servicio"
        extraValue={completedTransfer.description.replace("Pago de ", "")}
        onCreateAnother={handleCreateAnother}
        onViewTransfers={() => router.push(`/account-transactions/${accountId}`)}
      />
    );
  }

  if (pendingBill && availableBalance !== null) {
    return (
      <ConfirmTransfer
        amount={pendingBill.amount}
        originLabel="Cuenta origen"
        originValue={accountId}
        destinationLabel="Número de servicio"
        destinationValue={pendingBill.serviceNumber}
        availableBalance={availableBalance}
        title={`Confirmar pago de ${pendingBill.serviceType}`}
        description="Confirma el costo consultado para realizar el pago del servicio."
        amountLabel="Costo del servicio"
        confirmLabel="Confirmar pago"
        isSubmitting={isConfirming}
        onBack={() => setPendingBill(null)}
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
          <h2 className="mt-1 text-lg font-semibold text-text">Consultar servicio</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Selecciona el servicio e ingresa el número para consultar el costo pendiente.
          </p>
        </div>

        {balanceError && availableBalance === null && (
          <p className="text-sm text-error">{balanceError}</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de servicio</FormLabel>
                <FormControl>
                  <select {...field} className={selectClassName}>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Agua">Agua</option>
                    <option value="Telecomunicaciones">Telecomunicaciones</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceNumber"
            render={({ field }) => (
              <FormInput
                label="Número de servicio(DEMO)"
                placeholder="1004509876"
                inputMode="numeric"
                autoComplete="off"
                {...field}
              />
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/services")}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isBalanceLoading || availableBalance === null}
            className="bg-primary text-white hover:bg-primary-dark"
          >
            <FileText className="size-4" aria-hidden="true" />
            {form.formState.isSubmitting ? "Consultando..." : "Consultar costo"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServicePaymentForm;
