// app/src/app/components/view/ReviewPanel.tsx
import { AddAudit } from "@/app/components/audit/AddAudit";
import { RingAnimation } from "@/app/components/utils/RingAnimation";
import { useGetAudits } from "@/app/hooks/useGetAudits";
import { parseAuditString } from "@/lib/prompt/parseAuditString";
import { headers } from "next/headers";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Bug {
  bugType: string;
  level: string;
  function: string;
  threatFrom: string;
  description: string;
  line: string;
}

interface ModuleBugs {
  [key: string]: Bug[];
}

interface ModuleReviewStatus {
  [key: string]: "not_reviewed" | "reviewing" | "reviewed";
}

interface ReviewPanelProps {
  currentModule: string;
  modules: { [key: string]: string };
  language: string;
  packageId: string;
  network: string;
  onLineSelect: (start: number, end: number) => void;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({
  currentModule,
  modules,
  language,
  packageId,
  network,
  onLineSelect,
}) => {
  const [selectedThreatIndex, setSelectedThreatIndex] = useState<number | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);
  const [moduleBugs, setModuleBugs] = useState<ModuleBugs>({});
  const [moduleReviewStatus, setModuleReviewStatus] =
    useState<ModuleReviewStatus>({});
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [selectedRagDatabase, setSelectedRagDatabase] = useState("");

  const searchParams = useSearchParams();
  const bounty_object_id = searchParams.get("bounty_object_id");
  const [openAuditBugIndex, setOpenAuditBugIndex] = useState<number | null>(
    null,
  );

  const {
    dataAudits,
    dataName,
    bountyChain,
    bountyNetwork,
    bountyReward,
    bountyVersion,
    isLoading,
    bountyPackageId,
    address,
    createAudit,
  } = useGetAudits(bounty_object_id as string);

  useEffect(() => {
    setSelectedThreatIndex(null);
  }, [currentModule, packageId, network]);

  useEffect(() => {
    if (!moduleBugs[currentModule]) {
      setModuleBugs((prevState) => ({
        ...prevState,
        [currentModule]: [],
      }));
    }
    if (!moduleReviewStatus.hasOwnProperty(currentModule)) {
      // updateModuleReviewStatus(currentModule, "reviewed");
      updateModuleReviewStatus(currentModule, "not_reviewed");
    }
  }, [currentModule, moduleBugs, moduleReviewStatus]);

  const updateModuleReviewStatus = (
    module: string,
    status: "not_reviewed" | "reviewing" | "reviewed",
  ) => {
    setModuleReviewStatus((prevState) => ({
      ...prevState,
      [module]: status,
    }));
  };

  const getColorByLevel = (level: string) => {
    switch (level) {
      case "Low":
        return { bgColor: "bg-yellow-200", textColor: "text-yellow-600" };
      case "Moderate":
        return { bgColor: "bg-orange-200", textColor: "text-orange-600" };
      case "High":
        return { bgColor: "bg-red-200", textColor: "text-red-600" };
      default:
        return { bgColor: "bg-gray-200", textColor: "text-gray-600" };
    }
  };

  const handleLineClick = (line: string, index: number) => {
    if (selectedThreatIndex === index) {
      setSelectedThreatIndex(null);
      onLineSelect(0, 0);
    } else {
      const [start, end] = line.split("-").map(Number);
      setSelectedThreatIndex(index);
      onLineSelect(start, end || start);
    }
  };

  const bugs = moduleBugs[currentModule] || [];

  const startAiReview = async () => {
    try {
      updateModuleReviewStatus(currentModule, "reviewing");
      const response = await fetch(`/api/llm/review/openai/${selectedModel}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: modules[currentModule],
          language: language,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let outputText = "";

      while (!done) {
        const { value, done: doneReading } = (await reader?.read()) ?? {
          done: true,
        };
        done = doneReading;
        const chunk = decoder.decode(value);
        console.log(chunk);
        if (chunk !== "DOING_CoT_Dummy\n") {
          outputText += chunk;
        }
        if (outputText) {
          const bugs = parseAuditString(outputText);
          console.log({ bugs });
          setModuleBugs((prevState) => ({
            ...prevState,
            [currentModule]: bugs,
          }));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      updateModuleReviewStatus(currentModule, "reviewed");
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-h-[75vh] w-full overflow-y-auto">
      {!moduleReviewStatus[currentModule] ||
      moduleReviewStatus[currentModule] === "not_reviewed" ? (
        <div className="p-4 rounded-lg shadow-lg bg-gray-200 text-gray-600">
          <h2 className="text-xl font-bold">AI Review</h2>
          <div className="mt-4">
            <label htmlFor="model-select" className="block mb-2">
              Select AI Model:
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o-mini</option>
              <option value="o1">OpenAI o1</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="prompt-select" className="block mb-2">
              Select Prompt
            </label>
            <select
              id="prompt-select"
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Bugdar (default)</option>
              <option value="suigpt-v1">SuiGPT v1</option>
              <option value="suigpt-v2">SuiGPT v2</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="rag-select" className="block mb-2">
              Select RAG Database
            </label>
            <select
              id="rag-select"
              value={selectedRagDatabase}
              onChange={(e) => setSelectedRagDatabase(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">None (default)</option>
              <option value="mysten-labs">Mysten Labs</option>
              <option value="suigpt-auditor">SuiGPT Auditor</option>
            </select>
          </div>
          <button
            onClick={() => startAiReview()}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Start AI Review
          </button>
        </div>
      ) : moduleReviewStatus[currentModule] === "reviewed" &&
        bugs.length === 0 ? (
        <div className="p-4 rounded-lg shadow-lg bg-gray-200 text-gray-600">
          <h2 className="text-xl font-bold">Review Status</h2>
          <p>No bugs found in this module.</p>
          <button
            onClick={() =>
              updateModuleReviewStatus(currentModule, "not_reviewed")
            }
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {bugs.map((threat, index) => {
            const { bgColor, textColor } = getColorByLevel(threat.level);
            const isSelected = selectedThreatIndex === index;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-lg ${bgColor} ${
                  !isSelected && selectedThreatIndex !== null
                    ? "opacity-50"
                    : ""
                }`}
                onClick={() => handleLineClick(threat.line, index)}
              >
                <h2 className={`text-xl font-bold ${textColor}`}>
                  Level: {threat.level}
                </h2>
                <p className="text-gray-700 font-bold">At {threat.function}</p>
                <p className="text-gray-700 font-bold">{threat.threatFrom}</p>
                <p className="text-gray-600">
                  Description: {threat.description}
                </p>
                <div className="flex justify-end space-x-4">
                  <span className="text-green-500 text-xl">✔️</span>
                  <span className="text-red-500 text-xl">❌</span>
                  {bounty_object_id && (
                    <div>
                      <div className="flex justify-center">
                        <button
                          onClick={(e: any) => {
                            setOpenAuditBugIndex(index);
                            setOpenModal(true);
                            e.stopPropagation();
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Add Audit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {moduleReviewStatus[currentModule] === "reviewed" && (
            <>
              {" "}
              <div className="flex justify-center items-center">Reviewed</div>
            </>
          )}
          {moduleReviewStatus[currentModule] === "reviewing" && (
            <div className="flex justify-center items-center">
              <RingAnimation />
            </div>
          )}
          {openAuditBugIndex !== null && (
            <AddAudit
              bountyId={bounty_object_id as string}
              openModal={openModal}
              setOpenModal={setOpenModal}
              onSubmitAudit={createAudit}
              defaultTitle={
                bugs[openAuditBugIndex].function +
                ": " +
                bugs[openAuditBugIndex].threatFrom
              }
              defaultAuditBody={bugs[openAuditBugIndex].description}
              defaultSeverity={bugs[openAuditBugIndex].level}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReviewPanel;
