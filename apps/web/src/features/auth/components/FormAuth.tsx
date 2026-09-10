import { Form, FormField } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";

import { loginSchema, type LoginForm } from "../schemas/auth.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import lafiseLogo from "@/assets/images/auth/logo-LAFISE.svg";
import useAuthStore from "@/store/authStore";

const FormAuth = () => {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    try {
      await signIn(values);

      router.replace("/");

      toast.success("Sesión iniciada correctamente");
    } catch {
      toast.error("No fue posible iniciar sesión", {
        description: "Verifica tu usuario y contraseña e inténtalo nuevamente.",
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-sm"
        noValidate
      >
        <div className="flex flex-col items-center gap-1">
          <Image className="my-5" src={lafiseLogo} alt="Logo de LAFISE" width={150} height={150} />
          <p className="mt-1 text-sm text-zinc-500">Ingresa tus credenciales para continuar.</p>
        </div>

        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormInput
              label="Usuario"
              placeholder="Usuario"
              type="text"
              autoComplete="username"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormInput
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...field}
            />
          )}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </Form>
  );
};

export default FormAuth;
