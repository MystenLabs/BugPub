// app/src/app/user/ownedPoas/page.tsx
"use client";

import React, { useState } from "react";
import { useGetOwnedPoas } from "@/app/hooks/useGetOwnedPoas";
import { Button, Table } from "flowbite-react";
import { AddAudit } from "@/app/components/audit/AddAudit";
import { HiOutlinePencilAlt } from "react-icons/hi";

import { useGetAudits } from "@/app/hooks/useGetAudits";

const OwnedBountiesPage = () => {
  const { dataPoes } = useGetOwnedPoas();

  const [openModal, setOpenModal] = useState(false);
  const [bountyId, setbountyId] = useState("");
  const [poaId, setPoeId] = useState("");

  const SUI_CLOCK =
    "0x0000000000000000000000000000000000000000000000000000000000000006";

  const { createAudit } = useGetAudits(bountyId);

  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Recently Visited</h1>
      <p className="my-4 text-lg text-gray-500">
        Obtained the following NFTs by visiting the listed bounty providers and
        registering for their bounties. You may burn an NFT when writing a audit
        for the bounty provider, and receive an elevated reward for the audit.
      </p>
      <div>
        {dataPoes.length > 0 && (
          <Table hoverable className="items-center text-center">
            <Table.Head>
              <Table.HeadCell>MY OWNED NFT</Table.HeadCell>
              <Table.HeadCell>Bounty ID</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {dataPoes.map((item) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={item.id.id}
                >
                  <Table.Cell>
                    <div className="overflow-hidden truncate w-48">
                      {item.id.id}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="overflow-hidden truncate w-48">
                      {item.bounty_id}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {
                      <Button
                        color="gray"
                        pill
                        onClick={() => {
                          setbountyId(item.bounty_id);
                          setPoeId(item.id.id);
                          setOpenModal(true);
                        }}
                      >
                        Audit
                        <HiOutlinePencilAlt className="ml-2 h-5 w-5" />
                      </Button>
                    }
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        <AddAudit
          bountyId={bountyId}
          poaId={poaId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onSubmitAudit={createAudit}
        />
      </div>
    </div>
  );
};

export default OwnedBountiesPage;
