"use client";

import React, { ChangeEvent, useState, useCallback } from "react";
import { Bounties } from "@/app/components/Bounties";
import { useBountyCreation } from "@/app/hooks/useBountyCreation";
import { AddBounty } from "@/app/components/bounty/AddBounty";
import { Button } from "@/components/ui/button";
import { HiOutlinePlusCircle } from "react-icons/hi";

const BountyOwnerPage = () => {
  console.log("BountyOwnerPage");
  const { handleBountyCreationAndRegister } = useBountyCreation();

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const dashboardId = process.env.NEXT_PUBLIC_DASHBOARD_ID as string;

  const onBountyAdded = useCallback(() => {}, []);

  const createBounty = async (
    bountyName: string,
    package_id: string,
    network: string,
    chain: string,
    version: string,
    reward: number,
    pgpKey: string,
  ): Promise<void> => {
    console.log(`bountyName: ${bountyName}`);
    console.log(`package_id: ${package_id}`);
    console.log(`network: ${network}`);
    console.log(`chain: ${chain}`);
    console.log(`version: ${version}`);
    console.log(`reward: ${reward}`);
    console.log(`pgpKey: ${pgpKey}`);

    const resp = await handleBountyCreationAndRegister(
      bountyName,
      package_id,
      network,
      chain,
      version,
      reward,
      pgpKey,
      dashboardId,
      setIsLoading,
    ).then((resp) => {
      console.log(`resp: ${JSON.stringify(resp)}`);
      setTimeout(() => {
        window.location.reload(), 2000;
      });
      onBountyAdded();
    });
  };

  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Dashboard</h1>
      <Bounties />
      <Button color="green" onClick={() => setOpenModal(true)}>
        Add a new bounty
        <HiOutlinePlusCircle className="ml-2 h-5 w-5" />
      </Button>
      <AddBounty
        dashboardId={dashboardId}
        openModal={openModal}
        setOpenModal={setOpenModal}
        onCreateBounty={createBounty}
      />
    </div>
  );
};

export default BountyOwnerPage;
