// app/src/app/globalContexts.tsx
"use client";

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Navbar } from "./components/navbar/Navbar";
import { MySidebar } from "./components/sidebar/Sidebar";
import { AuthenticationProvider } from "@/app/contexts/Authentication";

import { create } from "domain";
import test from "node:test";

import "@mysten/dapp-kit/dist/index.css";
import { sessionStorageAdapter } from "@/lib/prompt/sessionStorageConnector";

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});
const queryClient = new QueryClient();

export default function GlobalContexts({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect storage={sessionStorageAdapter}>
          <AuthenticationProvider>
            <Navbar />
            <div className="flex flex-row min-h-screen bg-gray-100">
              <div className="w-64 md:w-72 lg:w-60 xl:w-48 h-full bg-white shadow-md">
                <MySidebar />
              </div>
              <div className="flex-1 p-4 md:p-8">
                <main
                  className="flex "
                  style={{
                    height: "calc(100vh - 60px)",
                  }}
                >
                  {children}
                </main>
              </div>
            </div>
          </AuthenticationProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
