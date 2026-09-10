import Image from "next/image";

const Loading = () => (
  <main
    className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-6"
    aria-busy="true"
    aria-live="polite"
  >
    <div
      className="absolute -left-24 top-16 size-72 rounded-full bg-white/10 blur-3xl"
      aria-hidden="true"
    />
    <div
      className="absolute -bottom-24 -right-16 size-80 rounded-full bg-accent/30 blur-3xl"
      aria-hidden="true"
    />

    <section className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-2xl shadow-primary-dark/30 backdrop-blur">
      <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-primary/10">
        <Image
          src="/assets/images/auth/logo-LAFISE.svg"
          alt="LAFISE"
          width={132}
          height={44}
          priority
        />
      </div>

      <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
        <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-primary" />
      </div>

      <h1 className="mt-5 text-xl font-semibold tracking-tight text-primary-dark">
        Preparando tu banca digital
      </h1>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Estamos cargando tu información de forma segura.
      </p>

      <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-primary/10" aria-hidden="true">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
    </section>
  </main>
);

export default Loading;
