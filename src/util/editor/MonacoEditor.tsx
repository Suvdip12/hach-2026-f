"use client";

import { JSX, useMemo } from "react";
import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";
import "./MonacoEditor.css";
import { defineThemes } from "@/data/theme_loader";

type Props = {
  value: string;
  setValue: (val: string) => void;
  lang?: string;
  setLang?: (lang: string) => void;
};

const MonacoEditor = ({ value, setValue }: Props): JSX.Element => {
  const { theme: systemTheme } = useTheme();
  const theme = useMemo(() => {
    if (systemTheme === "dark") {
      return "vs-dark";
    } else if (systemTheme === "light") {
      return "vs-light";
    } else if (typeof window !== "undefined") {
      // system theme - check for dark mode preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "vs-dark"
        : "vs-light";
    } else {
      return "vs-dark";
    }
  }, [systemTheme]);

  return (
    <div className="monaco-editor-container">
      <div className="monaco-editor-wrapper">
        <Editor
          language="python"
          value={value}
          theme={theme}
          height="100%"
          saveViewState
          onChange={(val) => setValue(val || "")}
          options={{
            fontSize: 14,
            fontFamily:
              "var(--font-urbanist-sans), 'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            minimap: { enabled: true },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "line",
            tabSize: 2,
            formatOnType: true,
            formatOnPaste: true,
            autoClosingBrackets: "always",
            matchBrackets: "always",
            contextmenu: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderWhitespace: "selection",
            bracketPairColorization: { enabled: true },
          }}
          onMount={(editor, monaco) => {
            defineThemes(monaco);
          }}
          onValidate={(markers) => console.log("Validation markers:", markers)}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
