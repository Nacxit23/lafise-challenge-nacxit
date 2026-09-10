import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import {
  formatTransferAmount,
  formatTransferDate,
  isDebitTransfer,
  sortTransfersByMostRecent,
} from "../helpers/transfer-display.helper";
import type { Transfer } from "../types/transfer.type";

interface TransferMobileListProps {
  accountId: string;
  transfers: Transfer[];
  onSelectTransfer: (transfer: Transfer) => void;
}

const TransferMobileList = ({
  accountId,
  transfers,
  onSelectTransfer,
}: TransferMobileListProps) => {
  const sortedTransfers = sortTransfersByMostRecent(transfers);

  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm md:hidden">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text">Movimientos recientes</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Cuenta {accountId}. Toca un movimiento para ver sus detalles.
        </p>
      </div>

      {sortedTransfers.length > 0 ? (
        <div
          className="max-h-[36rem] space-y-3 overflow-y-auto overscroll-contain pb-1 pr-1"
          aria-label={`Transferencias registradas en la cuenta ${accountId}`}
        >
          {sortedTransfers.map((transfer, index) => {
            const isDebit = isDebitTransfer(transfer);
            const Icon = isDebit ? ArrowUpRight : ArrowDownLeft;

            return (
              <button
                key={`${transfer.transactionNumber}-${transfer.transactionDate ?? index}`}
                type="button"
                onClick={() => onSelectTransfer(transfer)}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left shadow-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Ver detalles de la transacción ${transfer.transactionNumber}`}
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                    isDebit ? "bg-error/15 text-error" : "bg-success/15 text-primary"
                  }`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-text">
                    {transfer.description}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-text-secondary">
                    {transfer.bankDescription || "Banco"}
                  </span>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {formatTransferDate(transfer.transactionDate)} · #{transfer.transactionNumber}
                  </span>
                </span>

                <span
                  className={`shrink-0 text-right text-sm font-semibold ${
                    isDebit ? "text-error" : "text-primary"
                  }`}
                >
                  {isDebit ? "−" : "+"}
                  {formatTransferAmount(transfer.amount)}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-surface px-4 py-10 text-center text-sm text-text-secondary">
          No se encontraron movimientos con los filtros seleccionados.
        </div>
      )}
    </section>
  );
};

export default TransferMobileList;
