"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { getRecentMonthOptions } from "@/helpers/transfer-filter.helper";
import { cn } from "@/lib/utils";
import { transferFilterSchema } from "../schemas/transfer-filter.schema";
import type { TransferFilterValues } from "../types/transfer-filter.type";

interface TransferFiltersProps {
  appliedFilters: TransferFilterValues;
  onMonthChange: (month: string) => void;
  onSearch: (filters: TransferFilterValues) => void;
  onClearAdvanced: () => void;
}

const selectClassName =
  "flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

const TransferFilters = ({
  appliedFilters,
  onMonthChange,
  onSearch,
  onClearAdvanced,
}: TransferFiltersProps) => {
  const [monthOptions] = useState(() => getRecentMonthOptions());
  const form = useForm<TransferFilterValues>({
    resolver: zodResolver(transferFilterSchema),
    defaultValues: appliedFilters,
  });
  const amountMode = useWatch({ control: form.control, name: "amountMode" });
  const selectedMonth = useWatch({ control: form.control, name: "month" });

  const handleSearch = (values: TransferFilterValues) => {
    onSearch({
      ...values,
      transactionNumber: values.transactionNumber.trim(),
    });
  };

  const handleClear = () => {
    const month = form.getValues("month");

    form.reset({
      month,
      transactionNumber: "",
      amountMode: "exact",
      exactAmount: undefined,
      minimumAmount: undefined,
      maximumAmount: undefined,
    });
    onClearAdvanced();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSearch)}
        className="rounded-xl border border-border bg-white px-4 shadow-sm sm:px-6"
        noValidate
      >
        <div className="grid gap-2 py-5 sm:max-w-sm">
          <label htmlFor="transaction-month" className="text-sm font-medium text-text">
            Buscar por mes
          </label>
          <select
            id="transaction-month"
            value={selectedMonth}
            onChange={(event) => {
              form.setValue("month", event.target.value);
              onMonthChange(event.target.value);
            }}
            className={selectClassName}
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <Accordion>
          <AccordionItem value="advanced-search">
            <AccordionTrigger type="button">Búsqueda avanzada</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-5 pt-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="transactionNumber"
                  render={({ field }) => (
                    <FormInput
                      label="Número de transacción"
                      placeholder="Ej. 123456"
                      inputMode="numeric"
                      autoComplete="off"
                      {...field}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filtro por monto</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className={cn(selectClassName, "aria-invalid:border-error")}
                          onChange={(event) => {
                            field.onChange(event);
                            form.clearErrors(["exactAmount", "minimumAmount", "maximumAmount"]);

                            if (event.target.value === "exact") {
                              form.setValue("minimumAmount", undefined);
                              form.setValue("maximumAmount", undefined);
                            } else {
                              form.setValue("exactAmount", undefined);
                            }
                          }}
                        >
                          <option value="exact">Monto exacto</option>
                          <option value="range">Entre dos montos</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {amountMode === "exact" ? (
                  <FormField
                    control={form.control}
                    name="exactAmount"
                    render={({ field }) => (
                      <FormInput
                        label="Monto exacto"
                        suffix="NIO"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="1000"
                        value={field.value ?? ""}
                        onBlur={field.onBlur}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === "" ? undefined : event.target.valueAsNumber,
                          )
                        }
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="minimumAmount"
                      render={({ field }) => (
                        <FormInput
                          label="Monto mínimo"
                          suffix="NIO"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="500"
                          value={field.value ?? ""}
                          onBlur={field.onBlur}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === "" ? undefined : event.target.valueAsNumber,
                            )
                          }
                          name={field.name}
                          ref={field.ref}
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maximumAmount"
                      render={({ field }) => (
                        <FormInput
                          label="Monto máximo"
                          suffix="NIO"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="2000"
                          value={field.value ?? ""}
                          onBlur={field.onBlur}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === "" ? undefined : event.target.valueAsNumber,
                            )
                          }
                          name={field.name}
                          ref={field.ref}
                        />
                      )}
                    />
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs text-text-secondary">
                El número y el monto se combinan como alternativas dentro del mes seleccionado.
              </p>

              <div className="mt-5 flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={handleClear}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Limpiar
                </Button>
                <Button type="submit" className="bg-primary text-white hover:bg-primary-dark">
                  <Search className="size-4" aria-hidden="true" />
                  Buscar
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
};

export default TransferFilters;
