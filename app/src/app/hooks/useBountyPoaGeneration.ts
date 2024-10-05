import { useSuiClient } from "@mysten/dapp-kit";
import { toast } from "react-hot-toast";
import { Transaction } from "@mysten/sui/transactions";

import { useCustomWallet } from "@/contexts/CustomWallet";

export const useBountyPoAGeneration = () => {
  const client = useSuiClient();
  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();

  const handleBountyPoAGeneration = async (
    adminCap: string,
    bountyId: string,
    recipient: string,
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::generate_proof_of_audit`,
      arguments: [
        tx.object(adminCap),
        tx.object(bountyId),
        tx.pure.string(recipient),
      ],
    });
    tx.setGasBudget(1000000000);
    const resp = await executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    console.log(resp);
  };

  return { handleBountyPoAGeneration };
};
