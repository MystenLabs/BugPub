// app/src/app/hooks/useGetAudits.ts
import { useEffect, useState } from "react";
import { SuiMoveObject } from "@mysten/sui.js";

import { encrypt, readKey, createMessage } from "openpgp";

import { useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import toast from "react-hot-toast";

import { useCustomWallet } from "@/contexts/CustomWallet";

async function downloadBlob(blobId: string): Promise<any> {
  try {
    // We use a relative URL to call our local Next.js API
    console.log(`Sending Request to download blob with id: ${blobId}`);
    const resp = await fetch(`/api/walrus/${blobId}`);
    if (!resp.ok) {
      throw new Error(`Failed to download blob: ${await resp.text()}`);
    }
    console.log("Blob downloaded successfully");
    const data = await resp.json();
    console.log("Blob data:", data.data); // Adjust log if needed depending on API response structure.
    return data.data;
  } catch (error) {
    console.error("Error downloading blob:", error);
    throw error;
  }
}

export const useGetAudits = (bountyId: string) => {
  const suiClient = useSuiClient();
  const { address, executeTransactionBlockWithoutSponsorship } =
    useCustomWallet();

  const [dataAudits, setDataAudits] = useState<any[]>([]);
  const [dataName, setDataName] = useState<string>("");

  const [bountyChain, setBountyChain] = useState<string>("");
  const [bountyNetwork, setBountyNetwork] = useState<string>("");
  const [bountyVersion, setBountyVersion] = useState<string>("");
  const [bountyReward, setBountyReward] = useState<number>(0);
  const [bountyPackageId, setBountyPackageId] = useState<string>("");
  const [bountyPgpKeyBlobId, setBountyPgpKeyBlobId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const SUI_CLOCK =
    "0x0000000000000000000000000000000000000000000000000000000000000006";

  const createAudit = async ({
    title,
    auditBody,
    severity,
    poaId,
  }: {
    title: string;
    auditBody: string;
    severity: string;
    poaId?: string;
  }): Promise<void> => {
    let encrypted = auditBody;
    if (bountyPgpKeyBlobId !== "") {
      // retrieve pgp key from walrus
      console.log("Downloading pgp key");
      const publicKeyArmored: string = await downloadBlob(bountyPgpKeyBlobId);
      const publicKey = await readKey({ armoredKey: publicKeyArmored });
      encrypted = await encrypt({
        message: await createMessage({ text: auditBody }),
        encryptionKeys: publicKey,
      });
      console.log("Encrypted message \n", encrypted);
    }
    const tx = new Transaction();
    if (auditBody.length < 5) {
      toast.error("Audit body must be at least 5 characters");
      return;
    }

    if (poaId) {
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::write_new_audit`,
        arguments: [
          tx.object(bountyId),
          tx.pure.string(address || ""),
          tx.pure.string(title),
          tx.pure.string(encrypted),
          tx.pure.string(severity),
          tx.object(SUI_CLOCK),
          tx.object(poaId),
        ],
      });
    } else {
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::write_new_audit_without_poa`,
        arguments: [
          tx.object(bountyId),
          tx.pure.address(address || ""),
          tx.pure.string(title),
          tx.pure.string(encrypted),
          tx.pure.string(severity),
          tx.object(SUI_CLOCK),
        ],
      });
    }
    const auditGasBudget = 400000000;
    tx.setGasBudget(auditGasBudget);
    const resp = await executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    console.dir(resp, { depth: null });
    toast.success("Audit created successfully");

    // Assuming resp contains the new audit id and score after successful submission:
    // TODO: refresh state of audits list for bounty -- might require a sui client over-haul
    //window.location.reload();
    // router.push(`/bounty/${id}`);
  };

  useEffect(() => {
    console.log(`customWalelt address: ${address}`);
    if (!!address && !!bountyId) {
      reFetchData();
    } else {
      setDataAudits([]);
      setDataName("");
      setIsLoading(false);
      setIsError(false);
    }
  }, [address, bountyId]);

  const reFetchData = async () => {
    setIsLoading(true);

    console.log(`fetching obj_id=${bountyId}`);
    console.log("calling Get audits");
    console.log(`customWalelt address: ${address}`);
    suiClient
      .getObject({
        id: bountyId,
        options: {
          showContent: true,
        },
      })
      .then((res) => {
        console.log(res);

        setDataAudits((res.data?.content as SuiMoveObject).fields.top_audits);
        setDataName((res.data?.content as SuiMoveObject).fields.name);
        setBountyChain((res.data?.content as SuiMoveObject).fields.chain);
        setBountyNetwork((res.data?.content as SuiMoveObject).fields.network);
        setBountyReward((res.data?.content as SuiMoveObject).fields.reward);
        setBountyVersion((res.data?.content as SuiMoveObject).fields.version);
        setBountyPackageId(
          (res.data?.content as SuiMoveObject).fields.package_id,
        );
        setBountyPgpKeyBlobId(
          (res.data?.content as SuiMoveObject).fields.pgp_key_blob_id,
        );
        const len = (res.data?.content as SuiMoveObject).fields.audits.fields
          .size;
        setIsLoading(false);
        setIsError(false);
      })
      .catch((err) => {
        console.log(err);
        setDataAudits([]);
        setDataName("");
        setBountyChain("");
        setBountyNetwork("");
        setBountyReward(0);
        setBountyVersion("");
        setBountyPackageId("");
        setBountyPgpKeyBlobId("");
        setIsLoading(false);
        setIsError(true);
      });
  };

  return {
    dataAudits,
    dataName,
    bountyChain,
    bountyNetwork,
    bountyReward,
    bountyVersion,
    bountyPackageId,
    bountyPgpKeyBlobId,
    isLoading,
    isError,
    reFetchData,
    address,
    createAudit,
  };
};
