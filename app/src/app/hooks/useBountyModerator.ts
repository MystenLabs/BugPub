import { useSuiClient } from "@mysten/dapp-kit";
import { toast } from "react-hot-toast";
import { Transaction } from "@mysten/sui/transactions";

import { useCustomWallet } from "@/contexts/CustomWallet";

export const useBountyModerator = () => {
  const client = useSuiClient();

  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();

  const handleAddModerator = async (modCap: string, recipient: string) => {
    const tx = new Transaction();
    console.log(`modCap=${modCap} recipient=${recipient}`);
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::moderator::add_moderator`,
      arguments: [tx.object(modCap), tx.pure.string(recipient)],
    });
    const gasBudgetAddModerator = 400000000;
    tx.setGasBudget(gasBudgetAddModerator);
    const resp = await executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    console.log(resp);
  };

  const handleRemoveModerator = async (moderatorId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::moderator::delete_moderator`,
      arguments: [tx.object(moderatorId)],
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

  const handleRemoveAudit = async (
    moderatorId: string,
    bountyId: string,
    auditId: string,
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::remove_audit`,
      arguments: [
        tx.object(moderatorId),
        tx.object(bountyId),
        tx.pure.string(auditId),
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

  return { handleAddModerator, handleRemoveModerator, handleRemoveAudit };
};
