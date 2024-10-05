import { useEffect, useState } from "react";
import { Bounty as BountyType } from "@/app/types/Bounty";
import { SuiMoveObject } from "@mysten/sui.js";
import { useGetOwnedAdminCaps } from "@/app/hooks/useGetOwnedAdminCaps";
import { useSuiClient } from "@mysten/dapp-kit";
import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetOwnedBounties = () => {
  const { address } = useCustomWallet();
  const suiClient = useSuiClient();

  const { dataAdminCaps, isLoading } = useGetOwnedAdminCaps();
  const [bountys, setBounties] = useState([] as BountyType[]);

  useEffect(() => {
    if (isLoading) return;
    const bountysPromises = dataAdminCaps.map(async (item) => {
      const obj = await suiClient.getObject({
        id: item.bounty_id,
        options: { showContent: true },
      });
      const name = (obj.data?.content as SuiMoveObject).fields.name;
      const reward = (obj.data?.content as SuiMoveObject).fields.reward;
      const pool = (obj.data?.content as SuiMoveObject).fields.reward_pool;
      console.log(`obj: ${JSON.stringify(obj.data)}`);
      return { id: item.bounty_id, name, reward, pool };
    });
    Promise.all(bountysPromises).then((data) => setBounties(data));
  }, [address, isLoading]);

  return {
    dataBounties: bountys,
  };
};
