"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import useAuthStore from "@/store/authStore";
import useAccountStore from "@/store/accountStore";
import useTransferListStore from "@/store/transferListStore";
import AccountActions from "./account_actions";
import AccountDescription from "./account_description";
import AccountHeader from "./account_header";

const AccountInfo = () => {
  const user = useAuthStore((state) => state.session?.user);
  const { account, isLoading, error, loadAccount } = useAccountStore(
    useShallow((state) => ({
      account: state.account,
      isLoading: state.isLoading,
      error: state.error,
      loadAccount: state.loadAccount,
    })),
  );

  const productNumber = user?.products.find((product) => product.type === "Account")?.id;
  const { baseBalance, balanceAdjustment, setBaseBalance } = useTransferListStore(
    useShallow((state) => ({
      baseBalance: productNumber ? state.baseBalancesByAccount[productNumber] : undefined,
      balanceAdjustment: productNumber
        ? (state.balanceAdjustmentsByAccount[productNumber] ?? 0)
        : 0,
      setBaseBalance: state.setBaseBalance,
    })),
  );

  useEffect(() => {
    if (productNumber) {
      void loadAccount(productNumber).then((loadedAccount) => {
        if (loadedAccount) {
          setBaseBalance(productNumber, loadedAccount.balance);
        }
      });
    }
  }, [productNumber, loadAccount, setBaseBalance]);

  const availableBalance =
    baseBalance === undefined ? null : Math.max(baseBalance + balanceAdjustment, 0);

  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <AccountHeader hasAccount={Boolean(account)} />
      {isLoading || (account && availableBalance === null) ? (
        <p className="mt-8 text-sm text-text-secondary">Cargando información de la cuenta...</p>
      ) : error ? (
        <p className="mt-8 text-sm text-error">{error}</p>
      ) : account ? (
        <>
          <AccountDescription
            account={{ ...account, balance: availableBalance ?? 0, currency: "NIO" }}
          />
          {productNumber && <AccountActions account={account} productNumber={productNumber} />}
        </>
      ) : (
        <p className="mt-8 text-sm text-text-secondary">
          No hay una cuenta bancaria asociada a este usuario.
        </p>
      )}
    </article>
  );
};

export default AccountInfo;
