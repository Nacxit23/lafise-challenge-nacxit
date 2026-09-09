import { Headphones, LayoutGrid } from "lucide-react";

export default function ServiciosPage() {
  return (
    <div className="min-h-full bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section>
          <p className="text-sm font-medium text-primary">Opciones LAFISE</p>
          <h1 className="mt-1 text-2xl font-semibold text-text sm:text-3xl">Servicios</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Encuentra y administra los servicios disponibles para ti.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LayoutGrid className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-text">Mis servicios</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              La gestión de servicios estará disponible próximamente.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex size-11 items-center justify-center rounded-lg bg-success/15 text-primary-dark">
              <Headphones className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-text">¿Necesitas ayuda?</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Pronto podrás contactar soporte desde este espacio.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
