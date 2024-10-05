import { toast } from "react-hot-toast";
import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";

import { useCustomWallet } from "@/contexts/CustomWallet";

export const useSignAndExecuteTransaction = () => {
  const client = useSuiClient();
  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();

  const handleSignAndExecuteTransaction = async (
    tx: Transaction,
    operation: String,
    setIsLoading: any,
  ) => {
    const gasBudget = 1000000000;
    tx.setGasBudget(gasBudget);
    const resp = await executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    console.log(resp);
  };
  return { handleSignAndExecuteTransaction };
};
