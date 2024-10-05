// app/src/app/bounty/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useGetAudits } from "@/app/hooks/useGetAudits";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AddAudit } from "@/app/components/audit/AddAudit";
import { Table } from "flowbite-react";
import { Button } from "@/components/ui/button";
import {
  HiOutlineArrowRight,
  HiOutlineEye,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import { Audit } from "@/app/types/Audit";
import { useAuthentication } from "@/app/hooks/useAuthentication";
import { SuiMoveObject } from "@mysten/sui.js";

import { useSuiClient } from "@mysten/dapp-kit";

import axios from "axios";

interface AuditType {
  id: string;
  priority: string;
}

export default function Bounty() {
  const router = useRouter();
  const { user } = useAuthentication();
  const { id } = useParams();
  const {
    dataAudits,
    dataName,
    bountyChain,
    bountyNetwork,
    bountyReward,
    bountyVersion,
    bountyPgpKeyBlobId,
    isLoading,
    bountyPackageId,
    address,
    createAudit,
  } = useGetAudits(id.toString());

  const [audits, setAudits] = useState([] as AuditType[]);
  const [aiAuditorAvailable, setAiAuditorAvailable] = useState(false);
  const [buttomText, setButtomText] = useState("");
  const [linkToSuigptDecompiler, setLinkToSuigptDecompiler] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const suiClient = useSuiClient();

  const onDisplayAudit = (audit: AuditType) => {
    router.push(`/audit/${audit.id}`);
  };

  useEffect(() => {
    async function getAudits() {
      if (isLoading) {
        return;
      }
      console.dir(
        `audits: ${JSON.stringify(dataAudits)} size=${dataAudits.length}`,
      );

      const auditsPromises = dataAudits.map(async (item: string) => {
        console.log(`audit: ${JSON.stringify(item)}`);
        let total_score = "0";
        await suiClient
          .getObject({
            id: item,
            options: {
              showContent: true,
            },
          })
          .then(async (res) => {
            total_score = (
              (res.data?.content as SuiMoveObject).fields as Audit
            ).total_score.toString();
          });
        return { id: item, priority: total_score };
      });
      setAudits(await Promise.all(auditsPromises));
      console.dir(`audits_post: ${JSON.stringify(audits)}`);
    }

    getAudits();
  }, [address, isLoading, dataAudits]);

  useEffect(() => {
    const checkAiAuditAvailability = async () => {
      if (bountyPackageId) {
        if (bountyChain.toLowerCase() === "sui") {
          try {
            const response = await axios.get(
              `https://suigpt.tools/api/decompiler/package/${bountyPackageId}?network=${bountyNetwork.toLowerCase()}`,
            );
            if (
              response.status === 200 &&
              response.data.isNeedFurtherDecompile == false
            ) {
              setAiAuditorAvailable(true);
            } else {
              setAiAuditorAvailable(false);
              setLinkToSuigptDecompiler(
                response.data.packagesNeedFurtherDecompile[0].go_decompile_url,
              );
              setButtomText(
                "This package did not have a source code available. You can try to decompile it with SuiGPT and then use the AI Auditor.",
              );
            }
          } catch (error) {
            console.log("Error checking SuiGPT availability:", error);
          }
        } else {
          try {
            const response = await axios.get(
              `/api/code/${`${bountyChain.toLowerCase()}-${bountyNetwork.toLowerCase()}`}/${bountyPackageId}`,
            );
            if (response.status === 200) {
              setAiAuditorAvailable(true);
            } else {
              setButtomText(
                "This package did not have a source code available.",
              );
              setAiAuditorAvailable(false);
            }
          } catch (error) {
            console.error("Error getting source code availability:", error);
            setAiAuditorAvailable(false);
          }
        }
      }
    };

    checkAiAuditAvailability();
  }, [bountyPackageId, bountyNetwork]);

  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Bounty info</h1>
      <div>Bounty Name: {`${dataName}`}</div>
      <div>Bounty Reward: {`${bountyReward}`}</div>
      <div>Bounty Object Id: {`${id}`}</div>
      <div>Bounty Package Id: {`${bountyPackageId}`}</div>
      {bountyPgpKeyBlobId ? (
        <div>
          Bounty PGP Key Walrus URL:{" "}
          {`https://aggregator-devnet.walrus.space/v1/${bountyPgpKeyBlobId}`}
        </div>
      ) : (
        <div>No PGP key uploaded</div>
      )}

      <div>Total Audits: {`${audits.length}`}</div>
      <div>Bounty Chain: {`${bountyChain}`}</div>
      <div>Bounty Network: {`${bountyNetwork}`}</div>
      <div>Bounty Version: {`${bountyVersion}`}</div>
      <h1>Audits</h1>
      <div className="container">
        {audits.length > 0 && (
          <Table hoverable className="items-center text-center">
            <Table.Head>
              <Table.HeadCell>Audit ID</Table.HeadCell>
              <Table.HeadCell>Score</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {audits.map((item) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={item.id}
                >
                  <Table.Cell>
                    <div className="overflow-hidden">{item.id}</div>
                  </Table.Cell>
                  <Table.Cell>{item.priority}</Table.Cell>
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

      {user?.role !== "bountyOwner" && (
        <Button
          color="green"
          onClick={() => setOpenModal(true)}
          className="mt-4"
        >
          Add a new audit
          <HiOutlinePencilAlt className="ml-2 h-5 w-5" />
        </Button>
      )}
      {aiAuditorAvailable && (
        <Button
          color="green"
          className="mt-4"
          onClick={() => {
            window.open(
              `/view/${bountyChain.toLowerCase()}-${bountyNetwork.toLowerCase()}/${bountyPackageId}?bounty_object_id=${id.toString()}`,
              "_blank",
            );
          }}
        >
          View code with AI Auditor
          <HiOutlineEye className="ml-2 h-5 w-5" />
        </Button>
      )}
      {buttomText && <div className="mt-4">{buttomText}</div>}
      {linkToSuigptDecompiler && (
        <Button
          color="green"
          className="mt-4"
          onClick={() => {
            window.open(linkToSuigptDecompiler, "_blank");
          }}
        >
          <img
            src="https://suigpt.tools/favicon.ico"
            alt="SuiGPT icon"
            className="mr-2 h-5 w-5"
          />
          Decompile this package with SuiGPT
        </Button>
      )}
      <AddAudit
        bountyId={id.toString()}
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSubmitAudit={createAudit}
      />
    </div>
  );
}
