import type { Transfer } from "../features/transfer-list/types/transfer.type";

export const DEMO_INCOME_INTERVAL_MS = 25 * 60 * 1000;

const getRandomInteger = (minimum: number, maximum: number) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

const createRandomOriginAccount = (destinationAccount: string) => {
  let originAccount = String(getRandomInteger(100_000_000, 999_999_999));

  while (originAccount === destinationAccount) {
    originAccount = String(getRandomInteger(100_000_000, 999_999_999));
  }

  return originAccount;
};

/**
 * Genera un ingreso ficticio exclusivamente para demostrar en el frontend
 * cómo cada cuenta recibe activos. No representa una operación bancaria real
 * ni realiza peticiones al backend.
 */
export const createDemoIncomeTransfer = (
  destinationAccount: string,
  createdAt = new Date(),
): Transfer => ({
  transactionNumber: String(getRandomInteger(100_000, 999_999)),
  description: "Ingreso automático de demostración",
  bankDescription: "LAFISE Demo",
  transactionType: "Credit",
  amount: {
    currency: "NIO",
    value: getRandomInteger(1_000, 2_000),
  },
  origin: createRandomOriginAccount(destinationAccount),
  destination: destinationAccount,
  transactionDate: createdAt.toISOString(),
});
