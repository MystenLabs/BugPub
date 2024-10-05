import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetOwnedObjects = () => {
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
    suiClient
      .getOwnedObjects({
        owner: address!,
        limit: 100,
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
    data: data.map(({ data }) => data),
    isLoading,
    isError,
    reFetchData,
    address,
  };
};
