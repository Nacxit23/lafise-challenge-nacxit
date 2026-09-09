"use client";

import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import useTransferListStore from "@/store/transferListStore";
import TransferListTable from "../components/transfer_list_table";

const TransferListPage = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { transfers, totalCount, isLoading, error, loadTransfers } = useTransferListStore(
    useShallow((state) => ({
      transfers: state.transfers,
      totalCount: state.totalCount,
      isLoading: state.isLoading,
      error: state.error,
      loadTransfers: state.loadTransfers,
    })),
  );

  useEffect(() => {
    if (accountId) {
      void loadTransfers(accountId);
    }
  }, [accountId, loadTransfers]);

  return (
    <div className="min-h-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a mis productos
        </Link>

        <section>
          <div className="flex items-center gap-2 text-primary">
            <ArrowRightLeft className="size-5" aria-hidden="true" />
            <p className="text-sm font-medium">Historial de cuenta</p>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">Movimientos</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Consulta las transferencias realizadas desde y hacia tu cuenta.
          </p>
        </section>

        {isLoading ? (
          <section className="rounded-xl border border-border bg-white p-6 text-sm text-text-secondary shadow-sm">
            Cargando movimientos de la cuenta...
          </section>
        ) : error ? (
          <section className="rounded-xl border border-error/30 bg-white p-6 text-sm text-error shadow-sm">
            {error}
          </section>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 shadow-sm sm:px-6">
              <p className="text-sm text-text-secondary">Movimientos encontrados</p>
              <span className="text-lg font-semibold text-primary">{totalCount}</span>
            </div>
            <TransferListTable accountId={accountId} transfers={transfers} />
          </>
        )}
      </div>
    </div>
  );
};

export default TransferListPage;
