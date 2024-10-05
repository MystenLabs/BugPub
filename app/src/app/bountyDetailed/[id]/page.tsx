// app/src/app/bountyDetailed/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useGetAllAudits } from "@/app/hooks/useGetAllAudits";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AddAudit } from "@/app/components/audit/AddAudit";
import { Table } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { HiOutlineArrowRight, HiOutlinePencilAlt } from "react-icons/hi";
import { useGetAudits } from "@/app/hooks/useGetAudits";

export default function BountyDetailed() {
  const router = useRouter();
  const { id } = useParams();
  const { dataAudits, dataName, bountyPackageId, isLoading, address } =
    useGetAllAudits(id.toString());

  const { createAudit } = useGetAudits(id.toString());

  const [openModal, setOpenModal] = useState(false);

  const SUI_CLOCK =
    "0x0000000000000000000000000000000000000000000000000000000000000006";

  const onDisplayAudit = (audit_id: string) => {
    router.push(`/audit/${audit_id}`);
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
      <h1>Audits</h1>
      <div>Name: {`${dataName}`}</div>
      <div>Package ID: {`${bountyPackageId}`}</div>
      <div>Id: {`${id}`}</div>
      <div>Total: {`${dataAudits.length}`}</div>
      <div className="container">
        {dataAudits.length > 0 && (
          <Table hoverable className="items-center text-center">
            <Table.Head>
              <Table.HeadCell>Audit ID</Table.HeadCell>
              {/*<Table.HeadCell>Score</Table.HeadCell>*/}
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
                  {/*<Table.Cell>{item.priority}</Table.Cell>*/}
                  <Table.Cell>
                    {
                      <Button color="gray" onClick={() => onDisplayAudit(item)}>
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

      <Button color="green" onClick={() => setOpenModal(true)}>
        Add a new audit
        <HiOutlinePencilAlt className="ml-2 h-5 w-5" />
      </Button>
      <AddAudit
        bountyId={id.toString()}
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSubmitAudit={createAudit}
      />
    </div>
  );
}
