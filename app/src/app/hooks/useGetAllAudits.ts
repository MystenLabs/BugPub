import { useEffect, useState } from "react";
import { SuiMoveObject } from "@mysten/sui.js";

import { useSuiClient } from "@mysten/dapp-kit";
import { useCustomWallet } from "@/contexts/CustomWallet";

export const useGetAllAudits = (bountyId: string) => {
  const suiClient = useSuiClient();

  const { address } = useCustomWallet();

  const [dataAudits, setDataAudits] = useState<any[]>([]);
  const [dataName, setDataName] = useState<string>("");
  const [bountyPackageId, setBountyPackageId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!!address) {
      reFetchData();
    } else {
      setDataAudits([]);
      setDataName("");
      setIsLoading(false);
      setIsError(false);
    }
  }, [address]);

  const reFetchData = async () => {
    setIsLoading(true);

    console.log(`fetching obj_id=${bountyId}`);
    console.log("calling Get audits");
    suiClient
      .getObject({
        id: bountyId,
        options: {
          showContent: true,
        },
      })
      .then(async (res) => {
        setDataName((res.data?.content as SuiMoveObject).fields.name);
        const len = (res.data?.content as SuiMoveObject).fields.audits.fields
          .size;

        setBountyPackageId(
          (res.data?.content as SuiMoveObject).fields.package_id,
        );
        let audits: string[][] = Array(len);
        let i = 0;
        let { nextCursor, hasNextPage, data } =
          await suiClient.getDynamicFields({
            parentId: (res.data?.content as SuiMoveObject).fields.audits.fields
              .id.id,
            cursor: null,
          });
        data.forEach((item) => {
          audits[i++] = item.name.value as string[];
        });
        while (hasNextPage) {
          const resp = await suiClient.getDynamicFields({
            parentId: (res.data?.content as SuiMoveObject).fields.audits.fields
              .id.id,
            ...(hasNextPage && { cursor: nextCursor }),
          });
          hasNextPage = resp.hasNextPage;
          nextCursor = resp.nextCursor;
          data = resp.data;
          data.forEach((item) => {
            audits[i++] = item.name.value as string[];
          });
        }
        setDataAudits(audits);
        setIsLoading(false);
        setIsError(false);
      })
      .catch((err) => {
        console.log(err);
        setDataAudits([]);
        setDataName("");
        setIsLoading(false);
        setIsError(true);
      });
  };

  return {
    dataAudits,
    dataName,
    bountyPackageId,
    isLoading,
    isError,
    reFetchData,
    address,
  };
};
