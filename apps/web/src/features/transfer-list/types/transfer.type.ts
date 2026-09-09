interface TransactionAmountResponse {
  currency: string;
  value: number;
}

interface TransferResponse {
  transaction_number: string;
  description: string;
  bank_description: string;
  transaction_type: string;
  amount: TransactionAmountResponse;
  origin: string;
  destination: string;
  transaction_date?: string;
}

interface TransferListResponse {
  page: number;
  size: number;
  next: number;
  total_count: number;
  items: TransferResponse[];
}

interface TransactionAmount {
  currency: string;
  value: number;
}

interface Transfer {
  transactionNumber: string;
  description: string;
  bankDescription: string;
  transactionType: string;
  amount: TransactionAmount;
  origin: string;
  destination: string;
  transactionDate?: string;
}

interface TransferList {
  page: number;
  size: number;
  next: number;
  totalCount: number;
  items: Transfer[];
}

export type {
  TransactionAmount,
  TransactionAmountResponse,
  Transfer,
  TransferList,
  TransferListResponse,
  TransferResponse,
};
