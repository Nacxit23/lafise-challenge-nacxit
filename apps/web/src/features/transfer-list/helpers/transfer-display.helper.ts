import type { Transfer } from "../types/transfer.type";

const formatTransferAmount = (amount: Transfer["amount"]) =>
  new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(amount.value);

const formatTransferDate = (date?: string) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("es-NI", { dateStyle: "short" }).format(parsedDate);
};

const isDebitTransfer = (transfer: Transfer) => transfer.transactionType.toLowerCase() === "debit";

const getTransferTimestamp = (date?: string) => {
  if (!date) {
    return Number.POSITIVE_INFINITY;
  }

  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
};

const sortTransfersAscending = (transfers: Transfer[]) =>
  [...transfers].sort(
    (firstTransfer, secondTransfer) =>
      getTransferTimestamp(firstTransfer.transactionDate) -
      getTransferTimestamp(secondTransfer.transactionDate),
  );

export { formatTransferAmount, formatTransferDate, isDebitTransfer, sortTransfersAscending };
