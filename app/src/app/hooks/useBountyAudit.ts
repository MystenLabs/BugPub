import { useSuiClient } from "@mysten/dapp-kit";
import { toast } from "react-hot-toast";
import { Transaction } from "@mysten/sui/transactions";
import { SuiMoveObject } from "@mysten/sui/client";
import { useCustomWallet } from "@/contexts/CustomWallet";

export const useBountyAudit = () => {
  const suiClient = useSuiClient();
  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();

  const handleDeleteAudit = async (delistedId: string, auditId: string) => {
    // todo: get bountyId from auditId
    let bountyId = "";
    await suiClient
      .getObject({
        id: auditId,
        options: {
          showContent: true,
        },
      })
      .then(async (res) => {
        // console.log(res);
        const content = res.data?.content as SuiMoveObject;
        if (content && "fields" in content && "bounty_id" in content.fields) {
          const bountyIdField = content.fields.bounty_id;
          if (typeof bountyIdField === "string") {
            bountyId = bountyIdField;
          } else {
            throw new Error("bounty_id is not a string or is null");
          }
        } else {
          throw new Error("bounty_id not found in the audit object");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Audit delete failed.");
        return;
      });

    const tx = new Transaction();
    console.log(
      `bountyId=${bountyId} auditId=${auditId} delistedId=${delistedId}`,
    );
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::delete_audit`,
      arguments: [
        tx.object(bountyId),
        tx.object(auditId),
        tx.object(delistedId),
      ],
    });
    tx.setGasBudget(1000000000);
    const tx_resp = await executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    console.log(tx_resp);
  };

  return { handleDeleteAudit };
};
