import type { Account } from "../types/account.type";

interface AccountDescriptionProps {
  account: Account;
}

const AccountDescription = ({ account }: AccountDescriptionProps) => {
  const formattedBalance = new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: account.currency,
  }).format(account.balance);

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg bg-surface p-4">
        <p className="text-xs text-text-secondary">Descripción</p>
        <p className="mt-1 font-medium text-text">{account.alias}</p>
      </div>
      <div className="rounded-lg bg-surface p-4">
        <p className="text-xs text-text-secondary">Número de cuenta</p>
        <p className="mt-1 font-medium text-text">{account.accountNumber}</p>
      </div>
      <div className="rounded-lg bg-surface p-4">
        <p className="text-xs text-text-secondary">Saldo disponible</p>
        <p className="mt-1 font-medium text-primary">{formattedBalance}</p>
      </div>
    </div>
  );
};

export default AccountDescription;
