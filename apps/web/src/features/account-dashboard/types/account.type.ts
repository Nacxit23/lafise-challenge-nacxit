interface AccountResponse {
  alias: string;
  account_number: number;
  balance: number;
  currency: string;
}

interface Account {
  alias: string;
  accountNumber: number;
  balance: number;
  currency: string;
}

export type { Account, AccountResponse };
