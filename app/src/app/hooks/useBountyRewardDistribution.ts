import { useSuiClient } from "@mysten/dapp-kit";
import { toast } from "react-hot-toast";
import { Transaction } from "@mysten/sui/transactions";

import { useCustomWallet } from "@/contexts/CustomWallet";

export const useBountyReward = () => {
  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();
  const client = useSuiClient();

  const handleBountyReward = async (
    adminCap: string,
    bountyId: string,
    audit_id: string,
    reward_amount: number,
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::distribute_reward`,
      arguments: [
        tx.object(adminCap),
        tx.object(bountyId),
        tx.object(audit_id),
        tx.pure.u64(reward_amount),
      ],
    });
    tx.setGasBudget(400000000);
    const resp = await executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    console.log(resp);
  };

  return { handleBountyReward };
};
