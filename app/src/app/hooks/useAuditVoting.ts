import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";

import { useCustomWallet } from "@/contexts/CustomWallet";

export const useAuditVoting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();

  const handleUpvote = async (bountyId: string, auditId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::upvote`,
      arguments: [tx.object(bountyId), tx.pure.string(auditId)],
    });
    setIsLoading(true);
    const txResp = await executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    setIsLoading(false);
    return txResp;
  };

  return { handleUpvote };
};
