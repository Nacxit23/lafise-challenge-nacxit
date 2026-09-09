import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const formInputVariants = cva(
  "flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500 focus:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type FormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> &
  VariantProps<typeof formInputVariants> & {
    label?: React.ReactNode;
    className?: string;
    inputClassName?: string;
  };

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, inputClassName, label, variant, ...props }, ref) => (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <input
          ref={ref}
          className={cn(formInputVariants({ variant }), inputClassName)}
          {...props}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  ),
);
FormInput.displayName = "FormInput";

export { FormInput, FormInput as FormIInput, formInputVariants };
