import { useSuiClient } from "@mysten/dapp-kit";

import { toast } from "react-hot-toast";
import { Transaction } from "@mysten/sui/transactions";

import { useCustomWallet } from "@/contexts/CustomWallet";

export const useBountyTopUp = () => {
  const client = useSuiClient();
  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();

  const handleBountyTopUp = async (bountyId: string, amount: number) => {
    const tx = new Transaction();
    const sendAmount = tx.splitCoins(tx.gas, [amount]);
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::top_up_reward`,
      arguments: [tx.object(bountyId), sendAmount],
    });
    const gasBudget = 400000000;

    const resp = await executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    console.log(resp);
  };

  return { handleBountyTopUp };
};
