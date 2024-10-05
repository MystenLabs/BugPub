// app/src/app/components/audit/AddAudit.tsx
import { Button } from "@/components/ui/button";
import { Label, Modal, TextInput, Radio } from "flowbite-react";
import React, { useState, useEffect, useRef } from "react";

interface AddAuditProps {
  bountyId: string;
  poaId?: string;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  onSubmitAudit: (input: {
    title: string;
    auditBody: string;
    severity: string;
    poaId?: string;
  }) => Promise<void>;
  defaultAuditBody?: string;
  defaultSeverity?: string;
  defaultTitle?: string;
}

export const AddAudit = ({
  bountyId,
  poaId,
  openModal,
  setOpenModal,
  onSubmitAudit,
  defaultAuditBody = "",
  defaultSeverity = "high",
  defaultTitle = "",
}: AddAuditProps) => {
  //console.log({ defaultSeverity });
  const [auditBody, setAuditBody] = useState(defaultAuditBody);
  const [severity, setSeverity] = useState(defaultSeverity);
  const [title, setTitle] = useState(defaultTitle);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAuditBody(defaultAuditBody);
  }, [defaultAuditBody, openModal]);

  useEffect(() => {
    setSeverity(defaultSeverity.toLowerCase());
  }, [defaultSeverity, openModal]);

  useEffect(() => {
    setTitle(defaultTitle);
  }, [defaultTitle, openModal]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [auditBody]);

  return (
    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Write a New Audit</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label>Bounty ID</Label>
            </div>
            <TextInput id="bountyId" value={bountyId} disabled />
          </div>
          {!!poaId && (
            <div>
              <div className="mb-2 block">
                <Label>NFT ID (Proof of Ownership)</Label>
              </div>
              <TextInput id="poaId" value={poaId} disabled />
            </div>
          )}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" value="Title" />
            </div>
            <TextInput
              id="title"
              placeholder="Audit Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="auditBody" value="Content" />
            </div>
            <textarea
              ref={textareaRef}
              id="auditBody"
              className="w-full p-4 border rounded-lg"
              placeholder="Leave an audit"
              value={auditBody}
              onChange={(event) => setAuditBody(event.target.value)}
              required
              style={{ minHeight: "100px", resize: "none" }}
            />
          </div>
          <div>
            <fieldset className="flex max-w-md flex-col gap-4">
              <legend className="mb-4">Select Severity</legend>
              <div className="flex items-center gap-2">
                <Radio
                  id="info"
                  name="severity"
                  value="info"
                  onChange={(event) => setSeverity(event.target.value)}
                  checked={severity === "info"}
                />
                <Label htmlFor="info">Info</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="low"
                  name="severity"
                  value="low"
                  onChange={(event) => setSeverity(event.target.value)}
                  checked={severity === "low"}
                />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="med"
                  name="severity"
                  value="med"
                  onChange={(event) => setSeverity(event.target.value)}
                  checked={severity === "med"}
                />
                <Label htmlFor="med">Medium</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="high"
                  name="severity"
                  value="high"
                  onChange={(event) => setSeverity(event.target.value)}
                  checked={severity === "high"}
                />
                <Label htmlFor="high">High</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="critical"
                  name="severity"
                  value="critical"
                  onChange={(event) => setSeverity(event.target.value)}
                  checked={severity === "critical"}
                />
                <Label htmlFor="critical">Critical</Label>
              </div>
            </fieldset>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setOpenModal(false);
            onSubmitAudit({ title, auditBody, severity, poaId });
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
