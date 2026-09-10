import type {
  MonthOption,
  TransferFilterValues,
} from "@/features/transfer-list/types/transfer-filter.type";
import type { Transfer } from "@/features/transfer-list/types/transfer.type";

const formatMonthValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const createDefaultTransferFilters = (): TransferFilterValues => ({
  month: "",
  transactionNumber: "",
  amountMode: "exact",
  exactAmount: undefined,
  minimumAmount: undefined,
  maximumAmount: undefined,
});

const getRecentMonthOptions = (date = new Date(), count = 10): MonthOption[] => [
  { label: "Todos los meses", value: "" },
  ...Array.from({ length: count }, (_, index) => {
    const month = new Date(date.getFullYear(), date.getMonth() - index, 1);
    const label = new Intl.DateTimeFormat("es-NI", {
      month: "long",
      year: "numeric",
    }).format(month);

    return {
      label: capitalize(label),
      value: formatMonthValue(month),
    };
  }),
];

const clearAdvancedTransferFilters = (filters: TransferFilterValues): TransferFilterValues => ({
  ...createDefaultTransferFilters(),
  month: filters.month,
});

const filterTransfers = (transfers: Transfer[], filters: TransferFilterValues): Transfer[] => {
  const transactionNumber = filters.transactionNumber.trim();

  return transfers.filter((transfer) => {
    if (!transfer.transactionDate) {
      return false;
    }

    const transactionDate = new Date(transfer.transactionDate);

    if (
      Number.isNaN(transactionDate.getTime()) ||
      (filters.month !== "" && formatMonthValue(transactionDate) !== filters.month)
    ) {
      return false;
    }

    const advancedMatches: boolean[] = [];

    if (transactionNumber) {
      advancedMatches.push(transfer.transactionNumber.includes(transactionNumber));
    }

    if (filters.amountMode === "exact" && filters.exactAmount !== undefined) {
      advancedMatches.push(transfer.amount.value === filters.exactAmount);
    }

    if (
      filters.amountMode === "range" &&
      filters.minimumAmount !== undefined &&
      filters.maximumAmount !== undefined
    ) {
      advancedMatches.push(
        transfer.amount.value >= filters.minimumAmount &&
          transfer.amount.value <= filters.maximumAmount,
      );
    }

    return advancedMatches.length === 0 || advancedMatches.some(Boolean);
  });
};

export {
  clearAdvancedTransferFilters,
  createDefaultTransferFilters,
  filterTransfers,
  getRecentMonthOptions,
};
