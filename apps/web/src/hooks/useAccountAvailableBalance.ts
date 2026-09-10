import useTransferListStore from "@/store/transferListStore";

/**
 * Suscripción reactiva al saldo disponible de una cuenta.
 * Cualquier débito o crédito aplicado al store vuelve a calcular el resultado.
 */
const useAccountAvailableBalance = (accountId: string) =>
  useTransferListStore((state) => {
    const baseBalance = state.baseBalancesByAccount[accountId];

    if (baseBalance === undefined) {
      return null;
    }

    return Math.max(baseBalance + (state.balanceAdjustmentsByAccount[accountId] ?? 0), 0);
  });

export default useAccountAvailableBalance;
