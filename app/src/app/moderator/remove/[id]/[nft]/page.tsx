"use client";
import { useParams } from "next/navigation";
import { useGetAllAudits } from "@/app/hooks/useGetAllAudits";
import { useBountyModerator } from "@/app/hooks/useBountyModerator";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { HiOutlineArrowRight, HiXCircle } from "react-icons/hi";

export default function Audits() {
  const router = useRouter();
  const { id, nft } = useParams();
  const { dataAudits, dataName, bountyPackageId, isLoading, address } =
    useGetAllAudits(id.toString());
  const { handleRemoveAudit } = useBountyModerator();

  const [auditId, setAuditId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const onDisplayAudit = (audit_id: string) => {
    router.push(`/audit/${audit_id}`);
  };

  const onDelete = async () => {
    await handleRemoveAudit(nft.toString(), id.toString(), auditId);
    window.location.reload();
  };

  useEffect(() => {
    async function getAudits() {
      if (isLoading) {
        return;
      }
      console.dir(
        `audits: ${JSON.stringify(dataAudits)} size=${dataAudits.length}`,
      );
    }

    getAudits();
  }, [address, isLoading, dataAudits]);

  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Bounty</h1>
      <div>Name: {`${dataName}`}</div>
      <div>Id: {`${id}`}</div>
      <div>Audits: {`${dataAudits.length}`}</div>
      <div className="container">
        {dataAudits.length > 0 && (
          <Table hoverable className="items-center text-center">
            <Table.Head>
              <Table.HeadCell>Audit ID</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {dataAudits.map((item) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={item}
                >
                  <Table.Cell>
                    <div className="overflow-hidden">{item}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-row space-x-2">
                      <Button
                        color="gray"
                        pill
                        onClick={() => onDisplayAudit(item)}
                      >
                        View
                        <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button
                        color="red"
                        pill
                        onClick={() => {
                          setAuditId(item);
                          setOpenModal(true);
                        }}
                      >
                        Delete
                        <HiXCircle className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Delete a audit from bounty</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label>Bounty Id</Label>
                </div>
                <TextInput id="bountyId" value={id} disabled />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label>Audit Id</Label>
                </div>
                <TextInput id="auditId" value={auditId} disabled />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label>Moderator Id</Label>
                </div>
                <TextInput id="nft" value={nft} disabled />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setOpenModal(false);
                onDelete();
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
}
