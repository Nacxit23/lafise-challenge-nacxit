import { WalletCards } from "lucide-react";

interface AccountHeaderProps {
  hasAccount: boolean;
}

const AccountHeader = ({ hasAccount }: AccountHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <WalletCards className="size-5" aria-hidden="true" />
          <p className="text-sm font-medium">Cuentas bancarias</p>
        </div>
      </div>
      {hasAccount && (
        <span className="inline-flex w-fit rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-primary-dark">
          Cuenta activa
        </span>
      )}
    </div>
  );
};

export default AccountHeader;
