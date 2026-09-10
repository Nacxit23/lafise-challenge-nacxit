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

  const dateParts = new Intl.DateTimeFormat("es-NI", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(parsedDate);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    dateParts.find((part) => part.type === type)?.value ?? "";
  const dayPeriod = getPart("dayPeriod").replace(/\u00a0/g, " ");

  return `${getPart("day")} de ${getPart("month")} de ${getPart("year")}, ${getPart("hour")}:${getPart("minute")} ${dayPeriod}`;
};

const isDebitTransfer = (transfer: Transfer) => transfer.transactionType.toLowerCase() === "debit";

const getTransferTimestamp = (date?: string) => {
  if (!date) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

const sortTransfersByMostRecent = (transfers: Transfer[]) =>
  [...transfers].sort(
    (firstTransfer, secondTransfer) =>
      getTransferTimestamp(secondTransfer.transactionDate) -
      getTransferTimestamp(firstTransfer.transactionDate),
  );

export { formatTransferAmount, formatTransferDate, isDebitTransfer, sortTransfersByMostRecent };
