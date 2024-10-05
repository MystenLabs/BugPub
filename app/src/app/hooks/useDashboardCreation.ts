import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "./useSignAndExecuteTransaction";

export const useDashboardCreation = () => {
  const { handleSignAndExecuteTransaction } = useSignAndExecuteTransaction();
  const handleDashboardCreation = async (
    bounty_type: string,
    setIsLoading: any,
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::dashboard::create_dashboard`,
      arguments: [tx.pure.string(bounty_type)],
    });
    setIsLoading(true);
    console.log("useDashboardCreation, signing transaction block...");
    return handleSignAndExecuteTransaction(
      tx,
      "DashboardCreation",
      setIsLoading,
    );
  };

  return { handleDashboardCreation };
};
