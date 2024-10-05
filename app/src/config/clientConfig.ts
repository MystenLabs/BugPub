import { z } from "zod";

/*
 * The schema for the client-side environment variables
 * These variables should be defined in the app/.env file
 * These variables are NOT SECRET, they are exposed to the client side
 * They can and should be tracked by Git
 * All of the env variables must have the NEXT_PUBLIC_ prefix
 */

const clientConfigSchema = z.object({
  SUI_NETWORK: z.string(),
  SUI_NETWORK_NAME: z.enum(["mainnet", "testnet"]),
  USE_TOP_NAVBAR_IN_LARGE_SCREEN: z.boolean(),
  ENOKI_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
});

const clientConfig = clientConfigSchema.parse({
  SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK!,
  SUI_NETWORK_NAME: process.env.NEXT_PUBLIC_SUI_NETWORK_NAME as
    | "mainnet"
    | "testnet",
  USE_TOP_NAVBAR_IN_LARGE_SCREEN:
    process.env.NEXT_PUBLIC_USE_TOP_NAVBAR_IN_LARGE_SCREEN === "true",
  ENOKI_API_KEY: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
});

export default clientConfig;
