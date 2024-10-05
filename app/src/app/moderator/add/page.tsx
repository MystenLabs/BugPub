"use client";

import React, { useEffect, useState } from "react";
import { useGetOwnedModCaps } from "@/app/hooks/useGetOwnedModCaps";
import { useGetOwnedAdminCaps } from "@/app/hooks/useGetOwnedAdminCaps";
import { Label, Modal, Table, TextInput } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { HiOutlineArrowRight, HiOutlinePlusCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useBountyModerator } from "@/app/hooks/useBountyModerator";

const ModeratorPage = () => {
  const router = useRouter();
  const { handleAddModerator, handleRemoveModerator } = useBountyModerator();
  const [adminCap, setAdminCap] = useState("");
  const { dataAdminCaps, isLoading } = useGetOwnedAdminCaps();

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalRemove, setOpenModalRemove] = useState(false);
  const [moderatorAddress, setModeratorAddress] = useState("");

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (dataAdminCaps.length > 0) {
      console.log("adminCap=" + JSON.stringify(dataAdminCaps));
      setAdminCap(dataAdminCaps.at(0).id.id);
    } else {
      console.log("No dataCaps");
    }
  }, [isLoading]);

  const onAddModerator = async () => {
    console.log(
      "add moderator cap" + adminCap + " modAddress " + moderatorAddress,
    );
    if (adminCap.length == 0) {
      console.log("ModCap is empty");
      return;
    }
    if (moderatorAddress.length === 0) {
      console.log("Moderator address is empty");
      return;
    }
    await handleAddModerator(adminCap, moderatorAddress);
    window.location.reload();
  };

  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Add a Moderator</h1>
      <p className="my-4 text-lg text-gray-500">
        Admin user can add a new moderator who may monitor all the audits and
        remove them if they contain inappropriate contents.
      </p>
      <div className="container">
        <Button
          className="mb-4 w-64"
          color="green"
          onClick={() => {
            setOpenModalAdd(true);
          }}
        >
          Add
          <HiOutlinePlusCircle className="ml-2 h-5 w-5" />
        </Button>

        <Modal show={openModalAdd} onClose={() => setOpenModalAdd(false)}>
          <Modal.Header>Add a new moderator</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="moderatorAddress" value="Moderator Address" />
                </div>
                <TextInput
                  id="moderatorAddress"
                  placeholder=""
                  value={moderatorAddress}
                  onChange={(event) => setModeratorAddress(event.target.value)}
                  required
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setOpenModalAdd(false);
                onAddModerator();
              }}
            >
              Confirm
            </Button>
            <Button color="gray" onClick={() => setOpenModalAdd(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>

        {/*<Modal show={openModalRemove} onClose={() => setOpenModalRemove(false)}>*/}
        {/*  <Modal.Header>Delete a moderator from bounty</Modal.Header>*/}
        {/*  <Modal.Body>*/}
        {/*    <div className="space-y-6">*/}
        {/*      <div>*/}
        {/*        <div className="mb-2 block">*/}
        {/*          <Label>Bounty Id</Label>*/}
        {/*        </div>*/}
        {/*        <TextInput id="bountyId" value={id} disabled />*/}
        {/*      </div>*/}
        {/*      <div>*/}
        {/*        <div className="mb-2 block">*/}
        {/*          <Label>Moderator Address</Label>*/}
        {/*        </div>*/}
        {/*        <TextInput*/}
        {/*            id="moderatorAddress"*/}
        {/*            value={moderatorAddress}*/}
        {/*            disabled*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </Modal.Body>*/}
        {/*  <Modal.Footer>*/}
        {/*    <Button*/}
        {/*        onClick={() => {*/}
        {/*          setOpenModalRemove(false);*/}
        {/*          onDelete();*/}
        {/*        }}*/}
        {/*    >*/}
        {/*      Confirm*/}
        {/*    </Button>*/}
        {/*    <Button color="gray" onClick={() => setOpenModalRemove(false)}>*/}
        {/*      Decline*/}
        {/*    </Button>*/}
        {/*  </Modal.Footer>*/}
        {/*</Modal>*/}
      </div>
    </div>
  );
};

export default ModeratorPage;
