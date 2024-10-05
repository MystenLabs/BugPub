"use client";

import React, { useEffect, useState } from "react";
import { useGetOwnedModerator } from "@/app/hooks/useGetOwnedModerator";
import { Button, Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useGetBounties } from "@/app/hooks/useGetBounties";

const ModeratorPage = () => {
  const { dataModerators } = useGetOwnedModerator();
  const router = useRouter();
  const [nft, setNft] = useState("");
  const { bountyList, isLoading, address } = useGetBounties(
    process.env.NEXT_PUBLIC_DASHBOARD_ID as string,
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (dataModerators.length > 0) {
      setNft(dataModerators.at(0));
    }
  }, [isLoading, dataModerators]);

  const onDisplayAudits = (id: string) => {
    router.push(`/moderator/remove/${id}/${nft}`);
  };

  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Bounties</h1>
      <p className="my-4 text-lg text-gray-500">
        Moderators may monitor all the audits and remove them if they contain
        inappropriate contents.
      </p>
      <div>
        {dataModerators.length > 0 && (
          <Table hoverable className="items-center text-center">
            <Table.Head>
              <Table.HeadCell>Bounty ID</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {bountyList.map((item) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={item}
                >
                  <Table.Cell>
                    <div className="overflow-hidden truncate">{item}</div>
                  </Table.Cell>
                  <Table.Cell>
                    {
                      <Button
                        color="gray"
                        pill
                        onClick={() => onDisplayAudits(item)}
                      >
                        Audits
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
    </div>
  );
};

export default ModeratorPage;
