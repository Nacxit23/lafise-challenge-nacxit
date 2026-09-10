import { fetchApi } from "@/services/fetchApi";
import type {
  Transfer,
  TransferList,
  TransferListResponse,
  TransferResponse,
} from "../types/transfer.type";

const mapTransfer = (transfer: TransferResponse): Transfer => ({
  transactionNumber: transfer.transaction_number,
  description: transfer.description,
  bankDescription: transfer.bank_description,
  transactionType: transfer.transaction_type,
  amount: transfer.amount,
  origin: transfer.origin,
  destination: transfer.destination,
  transactionDate: transfer.transaction_date,
});

/** Obtiene y normaliza los movimientos de una cuenta desde el mock bancario. */
export const getAccountTransfers = async (accountId: string | number): Promise<TransferList> => {
  const response = await fetchApi<TransferListResponse>(`/accounts/${accountId}/transactions`);

  return {
    page: response.page,
    size: response.size,
    next: response.next,
    totalCount: response.total_count,
    items: response.items.map(mapTransfer),
  };
};
