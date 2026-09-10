import { ArrowLeft, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-5 py-12">
    <div
      className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/15 to-transparent"
      aria-hidden="true"
    />
    <div
      className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
      aria-hidden="true"
    />

    <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-white px-6 py-10 text-center shadow-xl shadow-primary-dark/5 sm:px-12 sm:py-14">
      <Image
        src="/assets/images/auth/logo-LAFISE.svg"
        alt="LAFISE"
        width={138}
        height={46}
        className="mx-auto"
        priority
      />

      <div className="mx-auto mt-9 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <SearchX className="size-9" aria-hidden="true" />
      </div>

      <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
        Error 404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
        Esta página no está disponible
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-text-secondary sm:text-base">
        La dirección que ingresaste no existe, fue movida o ya no se encuentra disponible.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver al inicio
      </Link>
    </section>
  </main>
);

export default NotFound;
