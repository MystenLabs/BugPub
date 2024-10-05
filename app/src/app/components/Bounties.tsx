// app/src/app/components/Bounties.tsx
import React, { useEffect, useState } from "react";
import { SuiMoveObject } from "@mysten/sui.js";
import { useRouter } from "next/navigation";
import { Bounty as BountyType } from "../types/Bounty";
import { useGetBounties } from "@/app/hooks/useGetBounties";
import { Button, Table } from "flowbite-react";
import { HiOutlineArrowRight } from "react-icons/hi";

import { useSuiClient } from "@mysten/dapp-kit";

interface Props {
  isDetailed?: boolean | false;
}

export const Bounties = ({ isDetailed }: Props) => {
  const suiClient = useSuiClient();
  const router = useRouter();
  const { bountyList, isLoading, address } = useGetBounties(
    process.env.NEXT_PUBLIC_DASHBOARD_ID as string,
  );

  const [bountys, setBounties] = useState([] as BountyType[]);

  const onDisplayBounty = (bounty: BountyType) => {
    router.push(`/bounty/${bounty.id}`);
  };

  const onDisplayDetailedBounty = (bounty: BountyType) => {
    onDisplayBounty(bounty);
    // router.push(`/bountyDetailed/${bounty.id}`);
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    console.log(`bountyList: ${JSON.stringify(bountyList)}`);

    const bountysPromises = bountyList.map(async (bountyId: string) => {
      const obj = await suiClient.getObject({
        id: bountyId,
        options: { showContent: true },
      });
      const bountyName = (obj.data?.content as SuiMoveObject).fields.name;
      const len = (obj.data?.content as SuiMoveObject).fields.audits.fields
        .size;
      console.log(`obj: ${JSON.stringify(obj.data)}`);
      return { id: bountyId, name: bountyName };
    });

    Promise.all(bountysPromises).then((data) => setBounties(data));
  }, [address, isLoading, bountyList]);

  // console.log("before=" + JSON.stringify(bountys));
  // console.log("after=" + JSON.stringify(bountys));

  return (
    <div className="container">
      {bountys.length > 0 && (
        <Table hoverable className="items-center text-center">
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Bounty ID</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {bountys.map((item) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={item.id}
              >
                <Table.Cell>
                  <div className="w-32">{item.name}</div>
                </Table.Cell>
                <Table.Cell>
                  <div className="overflow-hidden truncate w-24">{item.id}</div>
                </Table.Cell>
                <Table.Cell>
                  {
                    <Button
                      color="gray"
                      pill
                      onClick={() =>
                        isDetailed
                          ? onDisplayDetailedBounty(item)
                          : onDisplayBounty(item)
                      }
                    >
                      Info
                      <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};
