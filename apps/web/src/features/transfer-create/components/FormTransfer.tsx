"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import useTransferListStore from "@/store/transferListStore";
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
  const addTransfer = useTransferListStore((state) => state.addTransfer);
  const form = useForm<CreateTransferFormValues>({
    resolver: zodResolver(createTransferSchema(originAccount)),
    defaultValues: {
      destination: "",
      amount: 1000,
    },
  });

  const handleSubmit = async (values: CreateTransferFormValues) => {
    try {
      const transfer = await createTransfer({
        origin: originAccount,
        destination: values.destination,
        amount: {
          currency: "NIO",
          value: values.amount,
        },
      });

      addTransfer(transfer);
      toast.success("Transacción realizada correctamente", {
        description: `Referencia ${transfer.transactionNumber}`,
      });
      router.push(`/account-transactions/${originAccount}`);
    } catch {
      toast.error("No fue posible realizar la transacción", {
        description: "Verifica los datos e inténtalo nuevamente.",
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5 rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
        noValidate
      >
        <div>
          <h2 className="text-lg font-semibold text-text">Datos de la transacción</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Ingresa la cuenta destino y el monto que deseas transferir.
          </p>
        </div>

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
                label="Monto"
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
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark"
          >
            <ArrowRightLeft className="size-4" aria-hidden="true" />
            {isSubmitting ? "Procesando..." : "Realizar transacción"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormTransfer;
