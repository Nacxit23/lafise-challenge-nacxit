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
    suffix?: React.ReactNode;
  };

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, inputClassName, label, suffix, variant, ...props }, ref) => (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="relative">
        <FormControl>
          <input
            ref={ref}
            className={cn(formInputVariants({ variant }), suffix && "pr-16", inputClassName)}
            {...props}
          />
        </FormControl>
        {suffix && (
          <span className="pointer-events-none absolute inset-y-2 right-3 flex items-center border-l border-border pl-3 text-xs font-semibold text-text-secondary">
            {suffix}
          </span>
        )}
      </div>
      <FormMessage />
    </FormItem>
  ),
);
FormInput.displayName = "FormInput";

export { FormInput, FormInput as FormIInput, formInputVariants };
