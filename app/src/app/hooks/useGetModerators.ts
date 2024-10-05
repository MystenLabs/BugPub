import { useEffect, useState } from "react";
import { SuiMoveObject } from "@mysten/sui.js";
import { useSuiClient } from "@mysten/dapp-kit";
import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetModerators = (bountyId: string) => {
  const { address } = useCustomWallet();
  const suiClient = useSuiClient();

  const [dataModerators, setDataModerators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!!address) {
      reFetchData();
    } else {
      setDataModerators([]);
      setIsLoading(false);
      setIsError(false);
    }
  }, [address]);

  const reFetchData = async () => {
    setIsLoading(true);

    console.log(`fetching obj_id=${bountyId}`);
    console.log("calling Get audits");
    suiClient
      .getObject({ id: bountyId, options: { showContent: true } })
      .then((res) => {
        suiClient
          .getDynamicFields({
            parentId: (res.data?.content as SuiMoveObject).fields.moderators
              .fields.id.id,
            cursor: null,
            limit: 100,
          })
          .then((res) => {
            console.log(res);
            setDataModerators(
              res.data.map((item) => item.name.value as string),
            );
            setIsLoading(false);
            setIsError(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setDataModerators([]);
        setIsLoading(false);
        setIsError(true);
      });
  };

  return {
    dataModerators,
    isLoading,
    isError,
    reFetchData,
    address,
  };
};
