"use client";

import { useState } from "react";

import { formatTransferDate } from "../helpers/transfer-display.helper";
import type { Transfer } from "../types/transfer.type";
import TransferDetailDialog from "./transfer_detail_dialog";
import TransferListTable from "./transfer_list_table";
import TransferMobileList from "./transfer_mobile_list";

interface TransferListResponsiveProps {
  accountId: string;
  transfers: Transfer[];
}

const TransferListResponsive = ({ accountId, transfers }: TransferListResponsiveProps) => {
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);

  return (
    <>
      <TransferListTable
        accountId={accountId}
        transfers={transfers}
        onSelectTransfer={setSelectedTransfer}
      />
      <TransferMobileList
        accountId={accountId}
        transfers={transfers}
        onSelectTransfer={setSelectedTransfer}
      />
      <TransferDetailDialog
        transfer={selectedTransfer}
        open={selectedTransfer !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransfer(null);
          }
        }}
        formatDate={formatTransferDate}
      />
    </>
  );
};

export default TransferListResponsive;
