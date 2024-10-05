// app/src/app/components/view/ModuleSelectorAndCodeDisplay.tsx
import React, { ChangeEvent, useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import rust from "highlight.js/lib/languages/rust";
import "highlight.js/styles/nord.css";

hljs.registerLanguage("rust", rust);

interface ModuleSelectorAndCodeDisplayProps {
  currentModule: string;
  modules: { [key: string]: string };
  highlightStart: number | null;
  highlightEnd: number | null;
  handleModuleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleLineClick: (lineNumber: number) => void;
  h: string | null;
}

const ModuleSelectorAndCodeDisplay: React.FC<
  ModuleSelectorAndCodeDisplayProps
> = ({
  currentModule,
  modules,
  highlightStart,
  highlightEnd,
  handleModuleChange,
  handleLineClick,
  h,
}) => {
  const codeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (h && codeContainerRef.current) {
      const [start] = h.split("-").map(Number);
      const lineNumber = Math.max(start - 1, 1);
      const lineElement = document.getElementById(`line-${lineNumber}`);

      if (lineElement && codeContainerRef.current) {
        const containerRect = codeContainerRef.current.getBoundingClientRect();
        const lineRect = lineElement.getBoundingClientRect();
        const relativeTop =
          lineRect.top - containerRect.top + codeContainerRef.current.scrollTop;
        const targetScrollTop =
          relativeTop - containerRect.height / 2 + lineRect.height / 2;

        const startScrollTop = codeContainerRef.current.scrollTop;
        const distance = targetScrollTop - startScrollTop;
        const duration = 500; // 滾動持續時間（毫秒）
        let startTime: number | null = null;

        const animateScroll = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const easeProgress = easeInOutCubic(progress);

          if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop =
              startScrollTop + distance * easeProgress;
          }

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      }
    }
  }, [h]);

  const displayCode = () => {
    const codeSample = modules[currentModule];
    console.log({ codeSample });
    const codeLines = codeSample.split("\n");

    let startHighlight = 0;
    let endHighlight = 0;

    if (h) {
      const [start, end] = h.split("-").map(Number);
      startHighlight = start || 0;
      endHighlight = end || start;
    }

    const lineNumbers = codeLines.map((_, index) => (
      <button
        key={index}
        id={`line-${index + 1}`}
        onClick={() => handleLineClick(index + 1)}
        className="text-gray-400 hover:bg-gray-700 rounded mr-3"
        style={{ display: "block", textAlign: "left", width: "100%" }}
      >
        {index + 1}
      </button>
    ));

    return (
      <div className="w-full relative">
        <div
          ref={codeContainerRef}
          className="flex overflow-auto max-h-[70vh] bg-gray-800 py-4 pl-2 pr-4 rounded-lg"
        >
          <pre className="text-gray-400 select-none">{lineNumbers}</pre>
          <div>
            {codeLines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted =
                lineNumber >= startHighlight && lineNumber <= endHighlight;
              return (
                <pre
                  key={lineNumber}
                  id={`code-line-${lineNumber}`}
                  className={
                    isHighlighted
                      ? "text-yellow-500 bg-yellow-950"
                      : "text-white"
                  }
                >
                  <code
                    dangerouslySetInnerHTML={{
                      __html:
                        line === ""
                          ? "&nbsp;"
                          : hljs.highlight(line, { language: "rust" }).value,
                    }}
                  ></code>
                </pre>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      <select
        id="module-selector"
        value={currentModule}
        onChange={handleModuleChange}
        className="p-2 rounded bg-gray-700 text-white"
      >
        {Object.keys(modules).map((moduleName) => (
          <option key={moduleName} value={moduleName}>
            {moduleName}
          </option>
        ))}
      </select>
      {displayCode()}
    </div>
  );
};

// 緩動函數
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export default ModuleSelectorAndCodeDisplay;
