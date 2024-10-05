import clientConfig from "@/config/clientConfig";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { Transaction } from "@mysten/sui/transactions";
import toast from "react-hot-toast";

export const useTestTransaction = () => {
  const { sponsorAndExecuteTransactionBlock } = useCustomWallet();

  const handleExecute = () => {
    const recipient =
      "0x403eb2b0512ee18c24d96878f8beabf54734798c22f06e8c8569eecd31a17909";
    const tx = new Transaction();
    const nft = tx.moveCall({
      target:
        "0xeefeb7429cb5e2772762a872a1f0089e711e7ad8330808cb08db49e1d5754537::dummy_nft1::mint",
      arguments: [
        tx.pure.string(`Test NFT ${Math.floor(Math.random() * 10_000)}`),
      ],
    });
    tx.transferObjects([nft], recipient);
    sponsorAndExecuteTransactionBlock({
      tx,
      network: clientConfig.SUI_NETWORK_NAME,
      includesTransferTx: true,
      allowedAddresses: [recipient],
      options: {
        showEffects: true,
      },
    })
      .then((resp) => {
        console.log(resp);
        toast.success("Transaction executed successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to execute transaction");
      });
  };

  return { handleExecute };
};
