import { fetchApi } from "@/services/fetchApi";
import type { Account, AccountResponse } from "../types/account.type";

/** Obtiene una cuenta y transforma la respuesta del mock a nombres del frontend. */
export const getAccountById = async (accountId: string | number): Promise<Account> => {
  const response = await fetchApi<AccountResponse>(`/accounts/${accountId}`);

  return {
    alias: response.alias,
    accountNumber: response.account_number,
    balance: response.balance,
    currency: response.currency,
  };
};
