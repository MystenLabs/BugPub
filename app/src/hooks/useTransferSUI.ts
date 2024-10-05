import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import toast from "react-hot-toast";
import { useCustomWallet } from "@/contexts/CustomWallet";

interface HandleTransferSUIProps {
  amount: number;
  recipient: string;
  refresh?: () => void;
}

export const useTransferSUI = () => {
  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleTransferSUI = async ({
    amount,
    recipient,
    refresh,
  }: HandleTransferSUIProps) => {
    setIsLoading(true);

    const tx = new Transaction();
    let coin = tx.splitCoins(tx.gas, [
      tx.pure.u64(amount * Number(MIST_PER_SUI)),
    ]);
    tx.transferObjects([coin], tx.pure.address(recipient));
    // this transaction cannot be sponsored by Enoki
    // because it is using the gas coin as a transaction argument
    // so we are not sponsoring it with Enoki, the user pays for the gas
    executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })
      .then((resp) => {
        console.log(resp);
        if (resp?.effects?.status.status !== "success") {
          throw new Error("Transaction failed");
        }
        setIsLoading(false);
        toast.success("SUI transferred successfully!");
        !!refresh && refresh();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Transaction failed");
        setIsLoading(false);
      });
  };

  return {
    isLoading,
    handleTransferSUI,
  };
};
