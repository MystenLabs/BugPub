import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetOwnedPoas = () => {
  const { address } = useCustomWallet();
  const suiClient = useSuiClient();

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    reFetchData();
  }, [address]);

  const reFetchData = async () => {
    suiClient
      .getOwnedObjects({
        owner: address!,
        filter: {
          StructType: `${process.env.NEXT_PUBLIC_PACKAGE}::bounty::ProofOfExperience`,
        },
        options: {
          showContent: true,
        },
      })
      .then((res) => {
        console.log("POEs=" + JSON.stringify(res));
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
    dataPoes: data.map(({ data }) => data.content.fields),
  };
};
