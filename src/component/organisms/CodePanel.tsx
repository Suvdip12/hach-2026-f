"use client";

import { CodePanelProps } from "../../types/blockly";
import { CodeActions } from "../molecules/CodeActions";
import { ResizeHandle } from "../atoms/ResizeHandle";
import { CodeDisplay } from "../molecules/CodeDisplay";
import { OutputDisplay } from "../molecules/OutputDisplay";
import { useTranslation } from "@/i18n";
import { Eye, EyeOff, X } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import "./css/CodePanel.css";

export const CodePanel = ({
  codePanelRef,
  codeHeight,
  code,
  output,
  loadingPyodide,
  runningCode,
  pyodideError,
  copyToClipboard,
  runGeneratedCode,
  clearOutput,
  isDraggingCodePanel,
  handleCodePanelMouseDown,
  showGeneratedCode,
  toggleGeneratedCode,
  onClose,
}: CodePanelProps) => {
  const { t } = useTranslation();

  const [codeSectionHeightPercent, setCodeSectionHeightPercent] = useState(60); // Start at 50%
  const [isResizingInternal, setIsResizingInternal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingInternal(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizingInternal(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizingInternal && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newHeight = e.clientY - containerRect.top;
        const totalHeight = containerRect.height;
        // Calculate percentage (clamped between 10% and 90%)
        let newPercent = (newHeight / totalHeight) * 100;
        newPercent = Math.max(10, Math.min(90, newPercent));
        setCodeSectionHeightPercent(newPercent);
      }
    },
    [isResizingInternal],
  );

  useEffect(() => {
    if (isResizingInternal) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizingInternal, resize, stopResizing]);

  return (
    <div ref={codePanelRef} className="code-panel">
      <div className="code-panel-header">
        <span className="code-panel-title">
          {t("codeEditor.generatedPython")}
        </span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {onClose && (
            <button onClick={onClose} className="close-button" title="Close">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="code-panel-content" ref={containerRef}>
        <div
          className="code-half"
          style={{ height: `${codeSectionHeightPercent}%`, flex: "none" }}
        >
          <CodeDisplay code={code} codeHeight={100} />
        </div>

        <ResizeHandle
          direction="horizontal" // Visually horizontal line, moves vertically
          isDragging={isResizingInternal}
          onMouseDown={startResizing}
        />

        <div className="output-half" style={{ flex: 1, minHeight: 0 }}>
          <OutputDisplay
            output={output}
            loadingPyodide={loadingPyodide}
            pyodideError={pyodideError}
            onClear={clearOutput}
          />
        </div>
      </div>

      <ResizeHandle
        direction="horizontal"
        isDragging={isDraggingCodePanel}
        onMouseDown={handleCodePanelMouseDown}
      />
    </div>
  );
};
