import { RawSigner } from "@mysten/sui.js";
import { SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromB64 } from "@mysten/sui.js/utils";

export const getSigner = (privateKey: string) => {
  const FULL_NODE = process.env.NEXT_PUBLIC_SUI_NETWORK!;
  const connection = new SuiClient({
    url: FULL_NODE,
  });

  console.log("Getting signer for private key:", privateKey);
  let privateKeyArray = Uint8Array.from(Array.from(fromB64(privateKey)));
  console.log("Private key array:", privateKeyArray);
  if (privateKeyArray.length === 33) {
    console.log("Cutting length to 32");
    privateKeyArray = privateKeyArray.slice(1);
  }
  const keypair = Ed25519Keypair.fromSecretKey(privateKeyArray);
  console.log("Built keypair");
  const signer = new RawSigner(keypair, connection);
  return signer;
};
