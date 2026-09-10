type AmountFilterMode = "exact" | "range";

interface TransferFilterValues {
  month: string;
  transactionNumber: string;
  amountMode: AmountFilterMode;
  exactAmount?: number;
  minimumAmount?: number;
  maximumAmount?: number;
}

interface MonthOption {
  label: string;
  value: string;
}

export type { AmountFilterMode, MonthOption, TransferFilterValues };
