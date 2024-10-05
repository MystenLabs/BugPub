import { useEffect, useState } from "react";

import { useSuiClient } from "@mysten/dapp-kit";

import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetOwnedAdminCaps = () => {
  const { address } = useCustomWallet();
  const suiClient = useSuiClient();

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    reFetchData();
  }, [address]);

  const reFetchData = async () => {
    setIsLoading(true);
    console.log("address", address);
    suiClient
      .getOwnedObjects({
        owner: address!,
        filter: {
          StructType: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::AdminCap`,
        },
        options: {
          showContent: true,
        },
      })
      .then((res) => {
        console.log(res);
        setData(res.data);
        setIsLoading(false);
        setIsError(false);
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        setIsLoading(false);
        setIsError(true);
      });
  };

  return {
    dataAdminCaps: data.map(({ data }) => data.content.fields),
    isLoading,
  };
};
