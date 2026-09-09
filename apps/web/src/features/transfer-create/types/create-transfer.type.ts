import type { TransferResponse } from "@/features/transfer-list/types/transfer.type";

interface CreateTransferRequest {
  origin: string;
  destination: string;
  amount: {
    currency: "NIO";
    value: number;
  };
}

type CreateTransferResponse = TransferResponse;

export type { CreateTransferRequest, CreateTransferResponse };
