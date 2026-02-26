"use client";

import { CodeDisplayProps } from "../../types/blockly";
import { useTranslation } from "@/i18n";
import "./css/CodeDisplay.css";

export const CodeDisplay = ({ code, codeHeight }: CodeDisplayProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="code-display-container"
      style={{ height: `${codeHeight}%` }}
    >
      <pre className="code-display-pre">
        <code>{code || `# ${t("codeEditor.codeDisplay")}`}</code>
      </pre>
    </div>
  );
};
