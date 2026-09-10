import { fetchApi } from "@/services/fetchApi";
import type { Transfer } from "@/features/transfer-list/types/transfer.type";
import type { CreateTransferRequest, CreateTransferResponse } from "../types/create-transfer.type";

/** Crea una transacción y transforma la respuesta del mock al modelo de la aplicación. */
export const createTransfer = async (payload: CreateTransferRequest): Promise<Transfer> => {
  const response = await fetchApi<CreateTransferResponse, CreateTransferRequest>("/transactions", {
    method: "POST",
    data: payload,
  });

  return {
    transactionNumber: response.transaction_number,
    description: response.description,
    bankDescription: response.bank_description,
    transactionType: response.transaction_type,
    // El payload identifica los datos reales del flujo. El mock puede devolver
    // valores de respaldo que no deben utilizarse como claves del store.
    amount: payload.amount,
    origin: payload.origin,
    destination: payload.destination,
    transactionDate: response.transaction_date ?? new Date().toISOString(),
  };
};
