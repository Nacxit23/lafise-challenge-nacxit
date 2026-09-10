import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatTransferAmount, formatTransferDate } from "../helpers/transfer-display.helper";
import type { Transfer } from "../types/transfer.type";

interface TransferListTableProps {
  accountId: string;
  transfers: Transfer[];
  onSelectTransfer: (transfer: Transfer) => void;
}

const TransferListTable = ({ accountId, transfers, onSelectTransfer }: TransferListTableProps) => (
  <section className="hidden rounded-xl border border-border bg-white p-4 shadow-sm md:block sm:p-6">
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
          <TableHead>Número de transacción</TableHead>
          <TableHead>Descripción</TableHead>
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
              onClick={() => onSelectTransfer(transfer)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectTransfer(transfer);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalles de la transacción ${transfer.transactionNumber}`}
            >
              <TableCell className="font-medium text-primary">
                {formatTransferDate(transfer.transactionDate)}
              </TableCell>
              <TableCell>{transfer.transactionNumber}</TableCell>
              <TableCell>{transfer.description}</TableCell>
              <TableCell>{transfer.transactionType}</TableCell>
              <TableCell className="text-right font-medium">
                {formatTransferAmount(transfer.amount)}
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
);

export default TransferListTable;
