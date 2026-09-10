import { ArrowRight, ArrowRightLeft, Landmark } from "lucide-react";
import Link from "next/link";

import type { AccountProductView } from "../types/account-product-view.type";

interface ProductMobileListProps {
  product: AccountProductView | null;
}

const ProductMobileList = ({ product }: ProductMobileListProps) => {
  if (!product) {
    return (
      <div className="rounded-xl bg-surface px-4 py-10 text-center text-sm text-text-secondary md:hidden">
        La cuenta demostrativa no está asociada a este usuario.
      </div>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-2xl border border-primary/15 bg-white p-5 shadow-sm md:hidden">
      <span className="absolute -right-12 -top-14 size-36 rounded-full bg-primary/5" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Landmark className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Cuenta bancaria
            </p>
            <h3 className="mt-1 truncate font-semibold text-text">{product.description}</h3>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-primary-dark">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          Activa
        </span>
      </div>

      <dl className="relative mt-6 grid grid-cols-2 gap-4 border-b border-border pb-5">
        <div>
          <dt className="text-xs text-text-secondary">Número de producto</dt>
          <dd className="mt-1 font-semibold tracking-wide text-text">{product.accountId}</dd>
        </div>
        <div className="text-right">
          <dt className="text-xs text-text-secondary">Saldo disponible</dt>
          <dd className="mt-1 font-bold text-primary">{product.balanceLabel}</dd>
        </div>
      </dl>

      <div className="relative mt-4 grid grid-cols-2 gap-3">
        <Link
          href={`/account-transactions/${product.accountId}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-3 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Ver movimientos de la cuenta ${product.accountId}`}
        >
          Ver
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href={`/account-transactions/${product.accountId}/create?type=transfer`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`Transferir desde la cuenta ${product.accountId}`}
        >
          <ArrowRightLeft className="size-4" aria-hidden="true" />
          Transferir
        </Link>
      </div>
    </article>
  );
};

export default ProductMobileList;
