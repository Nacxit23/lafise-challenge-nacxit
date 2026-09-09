"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import FormTransfer from "../components/FormTransfer";

const CreateTransferPage = () => {
  const { accountId } = useParams<{ accountId: string }>();

  return (
    <div className="min-h-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <Link
          href={`/account-transactions/${accountId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a los movimientos
        </Link>

        <section>
          <div className="flex items-center gap-2 text-primary">
            <Send className="size-5" aria-hidden="true" />
            <p className="text-sm font-medium">Transferencias</p>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">Crear transacción</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Indica la cuenta destino y el monto de la transacción en córdobas.
          </p>
        </section>

        <FormTransfer originAccount={accountId} />
      </div>
    </div>
  );
};

export default CreateTransferPage;
