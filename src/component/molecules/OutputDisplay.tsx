"use client";

import { ErrorDisplay } from "../atoms/ErrorDisplay";
import { LoadingSpinner } from "../atoms/LoadingSpinner";
import { OutputDisplayProps } from "../../types/blockly";
import { useTranslation } from "@/i18n";
import "./css/OutputDisplay.css";

export const OutputDisplay = ({
  output,
  loadingPyodide,
  pyodideError,
  onClear,
}: OutputDisplayProps) => {
  const { t } = useTranslation();

  return (
    <div className="output-display-container">
      <div className="output-display-header">
        <span className="output-display-title">{t("codeEditor.output")}</span>
        <button onClick={onClear} className="output-clear-button">
          {t("codeEditor.clear")}
        </button>
      </div>
      <div className="output-display-content">
        <pre className="output-pre">
          {output ? (
            <span
              className={
                output.toLowerCase().includes("error") ||
                output.toLowerCase().includes("traceback") ||
                output.toLowerCase().includes("exception")
                  ? "error-text"
                  : ""
              }
            >
              {output}
            </span>
          ) : (
            <span className="output-placeholder">
              {loadingPyodide ? (
                <LoadingSpinner message={t("codeEditor.loadingPythonEnv")} />
              ) : pyodideError ? (
                <ErrorDisplay error={pyodideError} />
              ) : (
                t("codeEditor.runCodeToSeeOutput")
              )}
            </span>
          )}
        </pre>
      </div>
    </div>
  );
};
