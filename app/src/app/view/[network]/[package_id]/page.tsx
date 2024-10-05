// app/src/app/view/[network]/[package_id]/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import hljs from "highlight.js/lib/core";
import rust from "highlight.js/lib/languages/rust";
import "highlight.js/styles/nord.css";
import ModuleSelectorAndCodeDisplay from "@/app/components/view/ModuleSelectorAndCodeDisplay";
import ReviewPanel from "@/app/components/view/ReviewPanel";
import axios from "axios";
import { RingAnimation } from "@/app/components/utils/RingAnimation";

hljs.registerLanguage("rust", rust);

interface SampleCodePageProps {
  params: { network: string; package_id: string };
}

const SampleCodePage: React.FC<SampleCodePageProps> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const h = searchParams.get("h");
  const selectedModule = searchParams.get("module");
  const { package_id, network } = params;

  const [highlightStart, setHighlightStart] = useState<number | null>(null);
  const [highlightEnd, setHighlightEnd] = useState<number | null>(null);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [scrollToHighlight, setScrollToHighlight] = useState(false);
  const [currentModule, setCurrentModule] = useState<string>(
    selectedModule || "",
  );
  const [modules, setModules] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<string>("move");
  const [error, setError] = useState<string>("");

  // Define the ref for scrolling the container
  const codeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        let response;
        try {
          response = await axios.get(`/api/code/${network}/${package_id}`);
        } catch (error) {
          console.error("Error fetching modules:", error);
          setError("Contract source code not found");
          return;
        }

        setModules(response.data.data);
        setLanguage(response.data.language);
        let currentModule = selectedModule || "";
        if (!selectedModule && Object.keys(response.data.data).length > 0) {
          currentModule = Object.keys(response.data.data)[0];
        } else if (selectedModule) {
          currentModule = selectedModule;
        }
        setCurrentModule(currentModule);
        const currentUrl = new URL(window.location.href);
        const searchParams = new URLSearchParams(currentUrl.search);
        searchParams.set("module", currentModule);
        router.replace(
          `/view/${network}/${package_id}?${searchParams.toString()}`,
        );
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [network, package_id, selectedModule]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (scrollToHighlight && highlightStart !== null) {
      const element = document.getElementById(`line-${highlightStart}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [scrollToHighlight, highlightStart]);

  const handleLineSelect = (start: number, end: number) => {
    setHighlightStart(start === 0 ? null : start);
    setHighlightEnd(end === 0 ? null : end);

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    if (start === 0 && end === 0) {
      searchParams.delete("h");
    } else {
      searchParams.set("h", `${start}-${end}`);
    }

    const newUrl = `/view/${network}/${package_id}?${searchParams.toString()}`;
    router.replace(newUrl);
  };

  const handleLineClick = (lineNumber: number) => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    if (shiftPressed && highlightStart !== null) {
      const start = Math.min(highlightStart, lineNumber);
      const end = Math.max(highlightStart, lineNumber);
      setHighlightEnd(end);
      searchParams.set("h", `${start}-${end}`);
    } else if (highlightStart === lineNumber && highlightEnd === lineNumber) {
      // If the clicked line is already selected, deselect it
      setHighlightStart(null);
      setHighlightEnd(null);
      searchParams.delete("h");
    } else {
      setHighlightStart(lineNumber);
      setHighlightEnd(lineNumber);
      searchParams.set("h", `${lineNumber}-${lineNumber}`);
    }

    searchParams.set("module", currentModule);
    const newUrl = `/view/${network}/${package_id}?${searchParams.toString()}`;
    router.replace(newUrl);
  };

  const handleModuleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newModule = event.target.value;
    setCurrentModule(newModule);

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);

    searchParams.set("module", newModule);
    searchParams.delete("h"); // Reset the highlight parameter

    const newUrl = `/view/${network}/${package_id}?${searchParams.toString()}`;
    router.replace(newUrl);
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (Object.keys(modules).length === 0 || isLoading) {
    return (
      <div className="flex justify-center items-center w-full">
        <RingAnimation />
      </div>
    );
  }
  return (
    <div className="flex flex-col sm:flex-row my-5 mx-10">
      {/* Code display */}
      <div className="sm:w-2/3 sm:mr-10 w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] 2xl:w-[800px] mb-5 sm:mb-0">
        <ModuleSelectorAndCodeDisplay
          currentModule={currentModule}
          modules={modules}
          highlightStart={highlightStart}
          highlightEnd={highlightEnd}
          handleModuleChange={handleModuleChange}
          handleLineClick={handleLineClick}
          h={h}
        />
      </div>
      {/* Review panel */}
      <div className="sm:w-1/3 w-[200px] md:w-[250px] lg:w-[300px] xl:w-[400px] 2xl:w-[600px]">
        <ReviewPanel
          currentModule={currentModule}
          modules={modules}
          language={language}
          packageId={package_id}
          network={network}
          onLineSelect={handleLineSelect}
        />
      </div>
    </div>
  );
};

export default SampleCodePage;
