"use client";

import React, { useState } from "react";
import { useGetOwnedBounties } from "@/app/hooks/useGetOwnedBounties";
import { useGetOwnedAdminCaps } from "@/app/hooks/useGetOwnedAdminCaps";
import { Alert, Modal, Label, TextInput, Table } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { HiCake } from "react-icons/hi";
import { useBountyReward } from "@/app/hooks/useBountyRewardDistribution";

const RewardPage = () => {
  const { dataBounties } = useGetOwnedBounties();
  const { dataAdminCaps } = useGetOwnedAdminCaps();
  const { handleBountyReward } = useBountyReward();

  const [openModal, setOpenModal] = useState(false);
  const [bountyId, setbountyId] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [auditId, setAuditId] = useState("");
  const [rewardAmount, setRewardAmount] = useState(0);

  const onReward = () => {
    const adminCap = dataAdminCaps.find((item) => item.bounty_id == bountyId);
    if (adminCap === undefined) {
      setAlertMsg(`AdminCap not found for ${bountyId}`);
      return;
    }
    console.log("adminCaps=" + JSON.stringify(dataAdminCaps));
    handleBountyReward(adminCap.id.id, bountyId, auditId, rewardAmount);
  };

  return (
    <div className="flex flex-col mx-32 my-10">
      {alertMsg.length > 0 && (
        <Alert color="failure">
          <span className="font-medium">Failed to Reward!</span>
          {`  ${alertMsg}`}
        </Alert>
      )}
      <h1>Reward</h1>
      <p className="my-4 text-lg text-gray-500">Reward top 10 auditers.</p>

      <div className="container">
        {dataBounties.length > 0 && (
          <Table hoverable className="items-center text-center">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Bounty ID</Table.HeadCell>
              <Table.HeadCell>Reward</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {dataBounties.map((item) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={item.id}
                >
                  <Table.Cell>
                    <div className="w-40">{item.name}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="overflow-hidden truncate w-48">
                      {item.id}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{item.reward}</Table.Cell>
                  <Table.Cell>
                    {
                      <Button
                        color="gray"
                        onClick={() => {
                          setbountyId(item.id);
                          setOpenModal(true);
                        }}
                      >
                        Reward
                        <HiCake className="ml-2 h-5 w-5" />
                      </Button>
                    }
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Distribute Reward to Audit in Bounty</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label>Bounty Id</Label>
                </div>
                <TextInput id="bountyId" value={bountyId} disabled />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label>Audit ID</Label>
                </div>
                <TextInput
                  id="auditId"
                  onChange={(event) => setAuditId(event.target.value)}
                  value={auditId}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label>Reward</Label>
                </div>
                <TextInput
                  id="rewardAmount"
                  onChange={(event) =>
                    setRewardAmount(Number(event.target.value))
                  }
                  value={rewardAmount}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setOpenModal(false);
                onReward();
              }}
            >
              Confirm
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default RewardPage;
