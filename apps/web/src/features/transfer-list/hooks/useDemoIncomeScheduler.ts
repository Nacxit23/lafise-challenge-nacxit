"use client";

import { useEffect } from "react";

import useTransferListStore from "@/store/transferListStore";
import {
  createDemoIncomeTransfer,
  DEMO_INCOME_INTERVAL_MS,
} from "../../../helpers/demo-income.helper";

/** Programa los créditos ficticios mientras el dashboard autenticado está activo. */
const useDemoIncomeScheduler = (accountIds: readonly string[]) => {
  useEffect(() => {
    if (accountIds.length === 0) {
      return;
    }

    let timeoutId: number | undefined;

    const runScheduler = () => {
      const now = Date.now();
      const store = useTransferListStore.getState();

      accountIds.forEach((accountId) => {
        const lastIncomeAt = store.lastDemoIncomeAtByAccount[accountId];

        if (lastIncomeAt === undefined) {
          store.initializeDemoIncomeSchedule(accountId, now);
          return;
        }

        if (now - lastIncomeAt < DEMO_INCOME_INTERVAL_MS) {
          return;
        }

        const transfer = createDemoIncomeTransfer(accountId, new Date(now));

        store.addDemoIncome(transfer, now);
      });

      const updatedStore = useTransferListStore.getState();
      const nextDelay = accountIds.reduce((shortestDelay, accountId) => {
        const lastIncomeAt = updatedStore.lastDemoIncomeAtByAccount[accountId] ?? now;
        const remainingTime = DEMO_INCOME_INTERVAL_MS - (now - lastIncomeAt);

        return Math.min(shortestDelay, Math.max(remainingTime, 1_000));
      }, DEMO_INCOME_INTERVAL_MS);

      timeoutId = window.setTimeout(runScheduler, nextDelay);
    };

    runScheduler();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [accountIds]);
};

export default useDemoIncomeScheduler;
