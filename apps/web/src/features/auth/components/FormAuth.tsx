import { Form, FormField } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";

import { login } from "@/features/auth/services/auth.service";
import { loginSchema, type LoginForm } from "../schemas/auth.schema";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import lafiseLogo from "@/assets/images/auth/logo-LAFISE.svg";
import useAuthStore from "@/store/authStore";
import { getExpiresAt } from "@/helpers/expireDate";

const FormAuth = () => {
  const setSession = useAuthStore((state) => state.setSession);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    try {
      const response = await login(values);

      setSession({
        token: response.token,
        user: response.user,
        expiresAt: getExpiresAt(response.expiresIn),
      });

      toast.success("Sesión iniciada correctamente");
    } catch {
      toast.error("No fue posible iniciar sesión", {
        description: "Verifica tu correo y contraseña e inténtalo nuevamente.",
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
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormInput
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              type="email"
              autoComplete="email"
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
          className="rounded-md bg-black px-4 py-2 text-white transition-opacity 
          disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </Form>
  );
};

export default FormAuth;
