import { Banknote, CreditCard, ReceiptText, Smartphone } from "lucide-react";
import Link from "next/link";

export default function PagarPage() {
  return (
    <div className="min-h-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section>
          <p className="text-sm font-medium text-primary">Servicios</p>
          <h1 className="mt-1 text-2xl font-semibold text-text sm:text-3xl">Servicios</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Accede a servicios de banca digital de forma rápida y segura.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-text">Pagos</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Encuentra aquí los servicios disponibles para tu banca digital.
            </p>
          </article>
          <Link
            href="/retiro-sin-tarjeta"
            className="rounded-xl border border-border bg-white p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Banknote className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-text">Retiro sin tarjeta</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Genera un código para simular un retiro en un cajero automático.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-primary">
              Iniciar retiro
            </span>
          </Link>
          <Link
            href="/recargas-celulares"
            className="rounded-xl border border-border bg-white p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Smartphone className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-text">Recargas celulares</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Recarga números Claro o Tigo usando el saldo de tu cuenta.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-primary">
              Iniciar recarga
            </span>
          </Link>
          <Link
            href="/pago-servicios"
            className="rounded-xl border border-border bg-white p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ReceiptText className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-text">Pago de servicios</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Consulta y paga Electricidad, Agua o Telecomunicaciones.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-primary">
              Consultar servicio
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}
