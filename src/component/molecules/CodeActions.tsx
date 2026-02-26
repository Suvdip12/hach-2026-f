"use client";

import { Download, Play, Square } from "lucide-react";
import { CodeActionsProps } from "../../types/blockly";
import { useTranslation } from "@/i18n";
import "./css/CodeActions.css";

export const CodeActions = ({
  code,
  loadingPyodide,
  runningCode,
  pyodideError,
  onCopy,
  onRun,
}: CodeActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="code-actions">
      <button
        className="code-action-button"
        onClick={onCopy}
        title={t("codeEditor.copyCode")}
      >
        <Download className="code-action-button-icon" />
      </button>
      <button
        className="run-button"
        onClick={onRun}
        disabled={
          loadingPyodide || runningCode || !code.trim() || !!pyodideError
        }
        title={
          loadingPyodide
            ? t("codeEditor.loadingPython")
            : pyodideError
              ? t("codeEditor.pythonRuntimeError")
              : !code.trim()
                ? t("codeEditor.noCodeToRun")
                : t("codeEditor.runGeneratedCode")
        }
      >
        {runningCode ? (
          <>
            <Square className="run-button-icon" />
            <span className="run-button-text">{t("codeEditor.running")}</span>
          </>
        ) : (
          <>
            <Play className="run-button-icon" />
            <span className="run-button-text">{t("codeEditor.run")}</span>
          </>
        )}
      </button>
    </div>
  );
};
