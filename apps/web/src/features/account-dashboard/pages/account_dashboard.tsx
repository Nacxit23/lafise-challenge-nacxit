"use client";

import { Eye } from "lucide-react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAuthStore from "@/store/authStore";
import AccountInfo from "@/features/account-dashboard/components/account_info";

const AccountDashboardPage = () => {
  const user = useAuthStore((state) => state.session?.user);
  const products = user?.products ?? [];

  return (
    <div className="min-h-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div id="productos" className="mx-auto w-full max-w-7xl space-y-8">
        <section>
          <p className="text-sm font-medium text-primary">Resumen de cuenta</p>
          <h1 className="mt-1 text-2xl font-semibold text-text sm:text-3xl">
            Bienvenido{user?.fullName ? `, ${user.fullName}` : ""}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Consulta tus productos financieros y administra tu banca digital.
          </p>
        </section>

        <AccountInfo />

        <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-text">Mis productos</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Productos asociados a tu perfil LAFISE.
            </p>
          </div>

          <Table>
            <TableCaption className="text-left">Listado de productos del cliente.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Número de producto</TableHead>
                <TableHead className="text-right">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={`${product.type}-${product.id}`}>
                    <TableCell className="font-medium">{product.type}</TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-primary-dark">
                        Activo
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {product.type === "Account" ? (
                        <Link
                          href={`/account-transactions/${product.id}`}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-primary px-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-label={`Ver transacciones de la cuenta ${product.id}`}
                        >
                          <Eye className="size-4" aria-hidden="true" />
                          Ver
                        </Link>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-text-secondary">
                    No hay productos asociados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
};

export default AccountDashboardPage;
