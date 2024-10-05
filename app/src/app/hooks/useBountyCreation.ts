import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { useCustomWallet } from "@/contexts/CustomWallet";

async function uploadToWalrus(
  pgpKey: string,
  epochNum: number,
): Promise<string> {
  const walrusPublishUrl = "https://publisher-devnet.walrus.space";

  try {
    const resp = await fetch(
      `${walrusPublishUrl}/v1/store?epochs=${epochNum}`,
      {
        method: "PUT",
        body: pgpKey,
      },
    );

    if (resp.status !== 200) {
      console.error("Failed to upload pgp key to Walrus");
      throw new Error("Failed to upload pgp key to Walrus");
    }

    const info = await resp.json();
    console.log("Walrus response:", info);
    let blobId = "";

    if ("alreadyCertified" in info) {
      console.log(`alreadyCertified: ${info.alreadyCertified.blobId}`);
      blobId = info.alreadyCertified.blobId;
    } else if ("newlyCreated" in info) {
      console.log(`newlyCreated: ${info.newlyCreated.blobId}`);
      blobId = info.newlyCreated.blobId;
    }

    return blobId;
  } catch (error) {
    console.error("Error uploading PGP key to Walrus:", error);
    throw error;
  }
}

function createBountyTX(
  tx: Transaction,
  name: string,
  package_id: string,
  network: string,
  chain: string,
  version: string,
  reward: number,
  pgpKeyBlobId: string,
): TransactionResult {
  const createBountyCall = tx.moveCall({
    target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::create_bounty`,
    arguments: [
      tx.pure.string(name),
      tx.pure.string(package_id),
      tx.pure.string(network),
      tx.pure.string(chain),
      tx.pure.string(version),
      tx.pure.u64(reward),
      tx.pure.string(pgpKeyBlobId),
    ],
  });
  return createBountyCall;
}

export const useBountyCreation = () => {
  const { executeTransactionBlockWithoutSponsorship } = useCustomWallet();
  const handleBountyCreationAndRegister = async (
    name: string,
    package_id: string,
    network: string,
    chain: string,
    version: string,
    reward: number,
    pgpKey: string,
    dashboardId: string,
    setIsLoading: any,
  ) => {
    let pgpKeyBlobId = "";

    // if pgpKey is not empty, then upload it to Walrus
    if (pgpKey !== "") {
      // TODO: verify PGP Key
      // TODO: handle epoch number via user
      pgpKeyBlobId = await uploadToWalrus(pgpKey, 2);
      console.log(`pgpKeyBlobId: ${pgpKeyBlobId}`);
    }

    const tx = new Transaction();
    console.log(`create bounty call`);
    const bountyCreation = tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::create_bounty`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(package_id),
        tx.pure.string(network),
        tx.pure.string(chain),
        tx.pure.string(version),
        tx.pure.u64(reward),
        tx.pure.string(pgpKeyBlobId),
      ],
    });

    console.log(`register bounty`);
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::dashboard::register_bounty`,
      arguments: [tx.object(dashboardId), bountyCreation],
    });
    setIsLoading(true);
    console.log("Create Bounty, signing transaction block...");
    setIsLoading(true);
    return executeTransactionBlockWithoutSponsorship({
      tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
  };
  const handleBountyCreationTransactionBlock = async (
    name: string,
    package_id: string,
    network: string,
    chain: string,
    version: string,
    reward: number,
    setIsLoading: any,
    pgpKey: string,
  ): Promise<Transaction> => {
    let pgpKeyBlobId = "";

    // if pgpKey is not empty, then upload it to Walrus
    if (pgpKey !== "") {
      // TODO: verify PGP Key
      // TODO: handle epoch number via user
      pgpKeyBlobId = await uploadToWalrus(pgpKey, 2);
      console.log(`pgpKeyBlobId: ${pgpKeyBlobId}`);
    }
    console.log(`pgpKeyBlobId: ${pgpKeyBlobId}`);
    console.log(`create bounty call`);

    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::create_bounty`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(package_id),
        tx.pure.string(network),
        tx.pure.string(chain),
        tx.pure.string(version),
        tx.pure.u64(reward),
        tx.pure.string(pgpKeyBlobId),
      ],
    });
    setIsLoading(true);
    console.log("Create Bounty, signing transaction block...");
    return tx;
  };
  return {
    handleBountyCreationAndRegister,
    handleBountyCreationTransactionBlock,
  };
};
