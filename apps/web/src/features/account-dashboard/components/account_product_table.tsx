import { ArrowRightLeft, Eye } from "lucide-react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AccountProductView } from "../types/account-product-view.type";

interface AccountProductTableProps {
  product: AccountProductView | null;
}

const AccountProductTable = ({ product }: AccountProductTableProps) => (
  <div className="hidden md:block">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descripción</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
          <TableHead className="text-center">Ver</TableHead>
          <TableHead className="text-center">Transferir</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {product ? (
          <TableRow>
            <TableCell className="font-medium uppercase">NI - {product.description}</TableCell>
            <TableCell>
              <span className="font-medium">{product.accountId}</span>
              <span className="ml-2 rounded border border-border px-1.5 py-0.5 text-[10px] text-text-secondary">
                NIO
              </span>
            </TableCell>
            <TableCell className="text-right font-semibold text-primary">
              {product.balanceLabel}
            </TableCell>
            <TableCell className="text-center">
              <Link
                href={`/account-transactions/${product.accountId}`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Ver movimientos de la cuenta ${product.accountId}`}
              >
                <Eye className="size-4" aria-hidden="true" />
              </Link>
            </TableCell>
            <TableCell className="text-center">
              <Link
                href={`/account-transactions/${product.accountId}/create?type=transfer`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Transferir desde la cuenta ${product.accountId}`}
              >
                <ArrowRightLeft className="size-4" aria-hidden="true" />
              </Link>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-text-secondary">
              La cuenta demostrativa no está asociada a este usuario.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export default AccountProductTable;
