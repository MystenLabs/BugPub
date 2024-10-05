import { Button } from "@/components/ui/button";
import {
  Label,
  Modal,
  RangeSlider,
  Textarea,
  TextInput,
  Select,
  Checkbox,
} from "flowbite-react";
import React, { useState } from "react";

interface AddBountyProps {
  dashboardId: string;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  onCreateBounty: (
    bountyName: string,
    packageId: string,
    network: string,
    chain: string,
    version: string,
    reward: number,
    pgpKey: string,
  ) => void;
}

export const AddBounty = ({
  dashboardId,
  openModal,
  setOpenModal,
  onCreateBounty,
}: AddBountyProps) => {
  const [bountyName, setBountyName] = useState("");
  const [packageId, setPackageId] = useState("");
  const [network, setNetwork] = useState("Mainnet");
  const [chain, setChain] = useState("Sui");
  const [version, setVersion] = useState("");
  const [reward, setReward] = useState(0);
  const [enablePGP, setEnablePGP] = useState(false);
  const [pgpKey, setPgpKey] = useState("");

  return (
    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Add a New Bounty</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label>Dashboard Id</Label>
            </div>
            <TextInput id="dashboardId" value={dashboardId} disabled />
          </div>
          <div>
            <div className="mb-2 block">
              <Label>Bounty Name</Label>
            </div>
            <TextInput
              id="bountyName"
              value={bountyName}
              onChange={(event) => setBountyName(event.target.value)}
              required
            />
            <div className="mb-2 block">
              <Label>Package ID</Label>
            </div>
            <TextInput
              id="packageId"
              value={packageId}
              onChange={(event) => setPackageId(event.target.value)}
              required
            />
            <div className="mb-2 block">
              <Label>Chain</Label>
            </div>
            <Select
              id="chain"
              value={chain}
              onChange={(event) => setChain(event.target.value)}
              required
            >
              <option>Sui</option>
              <option>Ethereum</option>
              <option>Polygon</option>
            </Select>

            <div className="mb-2 block">
              <Label>Network</Label>
            </div>
            <Select
              id="network"
              value={network}
              onChange={(event) => setNetwork(event.target.value)}
              required
            >
              <option>Mainnet</option>
              <option>Testnet</option>
              <option>Rinkeby</option>
              <option>Ropsten</option>
            </Select>
            <div className="mb-2 block">
              <Label>Package Version</Label>
            </div>
            <TextInput
              id="version"
              value={version}
              onChange={(event) => setVersion(event.target.value)}
              required
            />
            <div className="mb-2 block">
              <Label>Reward Value (in MIST)</Label>
            </div>
            <TextInput
              id="reward"
              value={reward}
              onChange={(event) => setReward(Number(event.target.value))}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label>Enable PGP Encryption</Label>
            </div>
            <Checkbox
              id="enablePGP"
              checked={enablePGP}
              onChange={(e) => setEnablePGP(e.target.checked)}
            />
            <Label htmlFor="enablePGP">Enable PGP Encryption</Label>
            {enablePGP && (
              <div className="mt-2">
                <Label htmlFor="pgpKey">PGP Key</Label>
                <Textarea
                  id="pgpKey"
                  value={pgpKey}
                  onChange={(e) => setPgpKey(e.target.value)}
                  placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----"
                />
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setOpenModal(false);
            onCreateBounty(
              bountyName,
              packageId,
              network,
              chain,
              version,
              reward,
              pgpKey,
            );
          }}
        >
          Submit
        </Button>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
