import { useEffect, useState } from "react";

import { useSuiClient } from "@mysten/dapp-kit";
import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetBounties = (dashboardId: string) => {
  const address = useCustomWallet();
  const suiClient = useSuiClient();

  const [bountyList, setBountyList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!!address) {
      reFetchData();
    } else {
      setBountyList([]);
      setIsLoading(false);
      setIsError(false);
    }
  }, [address]);

  const reFetchData = async () => {
    setIsLoading(true);

    console.log(`fetching obj_id=${dashboardId}`);
    console.log("calling Get Bounties");
    suiClient
      .getDynamicFields({
        parentId: dashboardId,
        cursor: null,
        limit: 100,
      })
      .then((res) => {
        console.log(`res: ${JSON.stringify(res.data)}`);
        setBountyList(res.data.map((item) => item.name.value as string));
        setIsLoading(false);
        setIsError(false);
      })
      .catch((err) => {
        console.log(err);
        setBountyList([]);
        setIsLoading(false);
        setIsError(true);
      });
  };

  return {
    bountyList,
    isLoading,
    isError,
    reFetchData,
    address,
  };
};
