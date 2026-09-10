"use client";

import {
  clearAdvancedTransferFilters,
  createDefaultTransferFilters,
  filterTransfers,
} from "@/helpers/transfer-filter.helper";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import TransactionAccountSummary from "../components/transaction_account_summary";
import TransferFilters from "../components/transfer_filters";
import TransferListResponsive from "../components/transfer_list_responsive";
import type { TransferFilterValues } from "../types/transfer-filter.type";
import useTransferListStore from "@/store/transferListStore";

const TransferListPage = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { transfers, isLoading, error, loadTransfers } = useTransferListStore(
    useShallow((state) => ({
      transfers: state.transfers,
      isLoading: state.isLoading,
      error: state.error,
      loadTransfers: state.loadTransfers,
    })),
  );
  const [filters, setFilters] = useState<TransferFilterValues>(createDefaultTransferFilters);
  const filteredTransfers = useMemo(
    () => filterTransfers(transfers, filters),
    [filters, transfers],
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
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a mis productos
        </Link>

        <TransactionAccountSummary accountId={accountId} />

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
            <TransferFilters
              appliedFilters={filters}
              onMonthChange={(month) => setFilters((current) => ({ ...current, month }))}
              onSearch={setFilters}
              onClearAdvanced={() => setFilters((current) => clearAdvancedTransferFilters(current))}
            />
            <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 shadow-sm sm:px-6">
              <p className="text-sm text-text-secondary">Movimientos encontrados</p>
              <span className="text-lg font-semibold text-primary">{filteredTransfers.length}</span>
            </div>
            <TransferListResponsive accountId={accountId} transfers={filteredTransfers} />
          </>
        )}
      </div>
    </div>
  );
};

export default TransferListPage;
