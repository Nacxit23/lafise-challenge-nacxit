"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TransferDetailDialog from "./transfer_detail_dialog";
import type { Transfer } from "../types/transfer.type";

interface TransferListTableProps {
  accountId: string;
  transfers: Transfer[];
}

const formatAmount = (amount: Transfer["amount"]) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(amount.value);

const formatDate = (date?: string) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("es-NI", { dateStyle: "short" }).format(parsedDate);
};

const TransferListTable = ({ accountId, transfers }: TransferListTableProps) => {
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);

  return (
    <>
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-text">Movimientos recientes</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Selecciona una transacción para consultar todos sus detalles.
          </p>
        </div>

        <Table>
          <TableCaption className="text-left">
            Transferencias registradas en la cuenta {accountId}.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Numero de transacción</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.length > 0 ? (
              transfers.map((transfer) => (
                <TableRow
                  key={transfer.transactionNumber}
                  className="cursor-pointer"
                  onClick={() => setSelectedTransfer(transfer)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedTransfer(transfer);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver detalles de la transacción ${transfer.transactionNumber}`}
                >
                  <TableCell className="font-medium text-primary">
                    {formatDate(transfer.transactionDate)}
                  </TableCell>
                  <TableCell>{transfer.transactionNumber}</TableCell>
                  <TableCell>{transfer.description}</TableCell>
                  <TableCell>{transfer.transactionType}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatAmount(transfer.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-text-secondary">
                  No se encontraron movimientos con los filtros seleccionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <TransferDetailDialog
        transfer={selectedTransfer}
        open={selectedTransfer !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransfer(null);
          }
        }}
        formatDate={formatDate}
      />
    </>
  );
};

export default TransferListTable;
