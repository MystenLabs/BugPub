import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetOwnedModCaps = () => {
  const { address } = useCustomWallet();
  const suiClient = useSuiClient();

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!!address) {
      reFetchData();
    } else {
      setData([]);
      setIsLoading(false);
      setIsError(false);
    }
  }, [address]);

  const reFetchData = async () => {
    setIsLoading(true);
    console.log("fetching modCaps for current address: ", address);
    suiClient
      .getOwnedObjects({
        owner: address!,
        filter: {
          StructType: `${process.env.NEXT_PUBLIC_PACKAGE}::moderator::ModCap`,
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
    dataCaps: data.map(({ data }) => data.content.fields),
    isLoading,
  };
};
