import { useEffect, useState } from "react";
import { SuiMoveObject } from "@mysten/sui.js";
import { Audit } from "@/app/types/Audit";

import { useSuiClient } from "@mysten/dapp-kit";
import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetAudit = (auditId: string) => {
  const suiClient = useSuiClient();
  const { address } = useCustomWallet();

  const [dataAudit, setDataAudit] = useState<Audit>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log(`customWallet address: ${address}`);
    if (!!address) {
      reFetchData();
    } else {
      setDataAudit(undefined);
      setIsLoading(false);
      setIsError(false);
    }
  }, [address]);

  const reFetchData = async () => {
    setIsLoading(true);

    console.log(`fetching obj_id=${auditId}`);

    suiClient
      .getObject({
        id: auditId,
        options: {
          showContent: true,
        },
      })
      .then(async (res) => {
        // console.log(res);
        setDataAudit((res.data?.content as SuiMoveObject).fields as Audit);
        // console.log(`hash_of_audit=${dataAudit?.hash}`);
        setIsLoading(false);
        setIsError(false);
        // console.log("audit = " + JSON.stringify(dataAudit));
      })
      .catch((err) => {
        console.log(err);
        setDataAudit(undefined);
        setIsLoading(false);
        setIsError(true);
      });
  };

  return {
    dataAudit,
    isLoading,
    isError,
    reFetchData,
    address,
  };
};
