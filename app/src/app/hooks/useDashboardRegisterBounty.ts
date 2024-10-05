import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "./useSignAndExecuteTransaction";
// has to be async
export const useDashboardRegisterBounty = () => {
  const { handleSignAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleRegisterBounty = async (
    dashboard_obj: any,
    bounty_id: any,
    setIsLoading: any,
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE}::dashboard::register_bounty`,
      arguments: [tx.object(dashboard_obj), tx.pure.string(bounty_id)],
    });
    setIsLoading(true);
    console.log("useDashboardRegisterBounty, signing transaction block...");
    return handleSignAndExecuteTransaction(
      tx,
      "DashboardRegisterBounty",
      setIsLoading,
    );
  };

  return { handleRegisterBounty };
};
