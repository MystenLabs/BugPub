"use client";

import React, { useState } from "react";
import { Label, Modal, Table, TextInput } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { HiXCircle } from "react-icons/hi";
import { useBountyModerator } from "@/app/hooks/useBountyModerator";
import { useGetOwnedModerator } from "@/app/hooks/useGetOwnedModerator";

const DeleleteModeratorPage = () => {
  const { handleRemoveModerator } = useBountyModerator();
  const { dataModerators } = useGetOwnedModerator();

  const [openModalRemove, setOpenModalRemove] = useState(false);
  const [moderatorId, setModeratorId] = useState("");

  const onDelete = async () => {
    await handleRemoveModerator(moderatorId);
    window.location.reload();
  };

  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Delete Moderator</h1>
      <p className="my-4 text-lg text-gray-500">
        Moderators may burn their own NFTs, after which they are no longer able
        to delete audits.
      </p>

      <div className="container">
        {dataModerators.length > 0 && (
          <Table hoverable className="items-center text-center">
            <Table.Head>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {dataModerators.map((item) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={item}
                >
                  <Table.Cell>
                    <div className="overflow-hidden">{item}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      color="red"
                      onClick={() => {
                        setModeratorId(item);
                        setOpenModalRemove(true);
                      }}
                    >
                      Delete
                      <HiXCircle className="ml-2 h-5 w-5" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal show={openModalRemove} onClose={() => setOpenModalRemove(false)}>
        <Modal.Header>Delete a moderator from bounty</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label>Moderator ID</Label>
              </div>
              <TextInput id="moderatorId" value={moderatorId} disabled />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setOpenModalRemove(false);
              onDelete();
            }}
          >
            Confirm
          </Button>
          <Button color="gray" onClick={() => setOpenModalRemove(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleleteModeratorPage;
