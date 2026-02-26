/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "./EditorComponent.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Play,
  Trash2,
  Copy,
  Package,
  Terminal,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronUp,
  Lightbulb,
  List,
  X,
} from "lucide-react";
import {
  Badge,
  Card,
  Flex,
  Text,
  ScrollArea,
  Button,
  Box,
  Separator,
} from "@radix-ui/themes";
import MonacoEditor from "@/util/editor/MonacoEditor";
import { useTranslation } from "@/i18n";
import {
  assignmentApi,
  extractData,
  type Assignment,
  type Question,
} from "@/services/api.service";
import toast from "react-hot-toast";

type AssignmentWithDetails = Assignment & {
  questionDetails?: Question & {
    hints?: string[]; // Check directly on question
    answer?: {
      hints?: string[]; // And nested in answer
      answer?: string;
    };
    testCases?: { input: string; expectedOutput: string }[];
  };
};

type TestResult = {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
};

const EditorComponent = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");

  // --- EDITOR STATE ---
  const [value, setValue] = useState('print("Hello, World!")');
  const [output, setOutput] = useState("");
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("python");
  const [command, setCommand] = useState("");
  const [installing, setInstalling] = useState(false);
  const [running, setRunning] = useState(false);

  // --- ASSIGNMENT STATE ---
  const [assignment, setAssignment] = useState<AssignmentWithDetails | null>(
    null,
  );
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [testing, setTesting] = useState(false);

  // --- TOGGLES ---
  const [showTestCases, setShowTestCases] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // 0. FIX MONACO ERROR (Stackframe)
  useEffect(() => {
    // This suppresses the specific Monaco/Next.js conflict error
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes('Loading "stackframe" failed')
      ) {
        return;
      }
      originalConsoleError(...args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // 1. Load Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      setLoading(true);
      try {
        // @ts-expect-error: window.loadPyodide comes from CDN
        const pyodideModule = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
        });
        setPyodide(pyodideModule);
      } catch (err) {
        console.error("Failed to load Pyodide:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!(window as any).loadPyodide) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
      script.onload = loadPyodide;
      document.body.appendChild(script);
    } else {
      loadPyodide();
    }
  }, []);

  // 2. Fetch Assignment
  useEffect(() => {
    const fetchAssignment = async () => {
      if (!assignmentId) return;
      try {
        const res = await assignmentApi.getById(assignmentId);
        const data = extractData<AssignmentWithDetails>(res);
        if (data) {
          setAssignment(data);
          setValue((prev) =>
            prev === 'print("Hello, World!")'
              ? "# Write your solution here\n"
              : prev,
          );
        }
      } catch (error) {
        console.error("Failed to load assignment", error);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  // 3. Run Code
  const runCode = async () => {
    if (!pyodide) return;
    setRunning(true);
    setOutput("");
    setTestResults(null);

    try {
      if (lang === "python") {
        await pyodide.runPythonAsync(
          `import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = sys.stdout\n`,
        );
        await pyodide.runPythonAsync(value);
        const result = await pyodide.runPythonAsync("sys.stdout.getvalue()");
        setOutput(result !== undefined ? result.toString() : "");
      } else {
        setOutput("Code execution only supported for Python.");
      }
    } catch (err: any) {
      setOutput(`Error: ${String(err)}`);
    } finally {
      setRunning(false);
    }
  };

  // 4. Run Tests
  const runTests = async () => {
    if (!pyodide || !assignment?.questionDetails?.testCases) return;
    setTesting(true);
    setTestResults(null);
    setOutput("");

    const results: TestResult[] = [];
    const testCases = assignment.questionDetails.testCases;

    try {
      for (const testCase of testCases) {
        const inputVal = testCase.input || "";
        const expectedVal = (testCase.expectedOutput || "").trim();

        const setupCode = `
import sys, io
sys.stdin = io.StringIO('${inputVal}')
sys.stdout = io.StringIO()
sys.stderr = sys.stdout
`;
        try {
          await pyodide.runPythonAsync(setupCode);
          await pyodide.runPythonAsync(value);
          const rawOutput = await pyodide.runPythonAsync(
            "sys.stdout.getvalue()",
          );
          const actualVal = (rawOutput?.toString() || "").trim();

          results.push({
            input: inputVal,
            expected: expectedVal,
            actual: actualVal,
            passed: actualVal === expectedVal,
          });
        } catch (err: any) {
          results.push({
            input: inputVal,
            expected: expectedVal,
            actual: "",
            passed: false,
            error: String(err),
          });
        }
      }
      setTestResults(results);
      if (results.every((r) => r.passed)) toast.success("All tests passed!");
      else toast.error("Some tests failed.");
    } catch (err) {
      console.error("Test error:", err);
      toast.error("Failed to run tests");
    } finally {
      setTesting(false);
    }
  };

  // Package Management
  const executeCommand = async () => {
    if (!pyodide || !command.trim()) return;
    const trimmedCommand = command.trim();

    if (trimmedCommand.startsWith("pip install ")) {
      const packageName = trimmedCommand.replace("pip install ", "").trim();
      if (!packageName) {
        setOutput("Error: No package name");
        return;
      }
      setInstalling(true);
      setOutput(`Installing ${packageName}...`);
      try {
        await pyodide.loadPackage("micropip");
        await pyodide.runPythonAsync(`import micropip`);
        await pyodide.runPythonAsync(
          `await micropip.install('${packageName}')`,
        );
        setOutput(`✅ Installed: ${packageName}`);
      } catch (err: any) {
        setOutput(`❌ Error: ${String(err)}`);
      }
      setInstalling(false);
    } else {
      setOutput('❌ Only "pip install <package>" supported');
    }
    setCommand("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") executeCommand();
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied!");
    } catch (err) {
      console.error(err);
    }
  };

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case "easy":
        return "green";
      case "medium":
        return "yellow";
      case "hard":
        return "red";
      default:
        return "gray";
    }
  };

  // Consolidated Hints Logic (Checks both locations)
  const availableHints =
    assignment?.questionDetails?.answer?.hints ||
    assignment?.questionDetails?.hints ||
    [];
  const hasHints = availableHints.length > 0;

  return (
    <div className="editor-main-container">
      <div className="editor-content">
        {/* === LEFT PANEL (EDITOR) === */}
        <div
          className="editor-panel"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* ASSIGNMENT CARD */}
          {assignment && (
            <Box mb="2" style={{ flexShrink: 0 }}>
              <Card>
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="start">
                    <Flex direction="column" gap="2">
                      <Flex gap="2" align="center">
                        <Badge
                          color={getDifficultyColor(assignment.difficultyLevel)}
                        >
                          {assignment.difficultyLevel?.toUpperCase()}
                        </Badge>
                        <Text weight="bold" size="3">
                          Coding Challenge
                        </Text>
                      </Flex>
                      <Text size="2" color="gray">
                        {assignment.questionDetails?.question}
                      </Text>
                    </Flex>

                    <Button
                      onClick={runTests}
                      disabled={loading || testing || running}
                      size="2"
                    >
                      {testing ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <FlaskConical size={16} />
                      )}
                      {testing ? "Running..." : "Run Tests"}
                    </Button>
                  </Flex>

                  {/* Toggle Buttons */}
                  <Flex gap="2">
                    {assignment.questionDetails?.testCases && (
                      <Button
                        variant="soft"
                        color="gray"
                        size="1"
                        onClick={() => setShowTestCases(!showTestCases)}
                      >
                        {showTestCases ? (
                          <ChevronUp size={14} />
                        ) : (
                          <List size={14} />
                        )}
                        {showTestCases ? "Hide Test Cases" : "Show Test Cases"}
                      </Button>
                    )}

                    {/* Hints Toggle */}
                    {hasHints && (
                      <Button
                        variant="soft"
                        color="blue"
                        size="1"
                        onClick={() => setShowHints(!showHints)}
                      >
                        <Lightbulb size={14} />
                        Show Hints
                      </Button>
                    )}
                  </Flex>

                  {/* Collapsible: Test Cases */}
                  {showTestCases && <Separator size="4" />}

                  {showTestCases && assignment.questionDetails?.testCases && (
                    <Box
                      mt="2"
                      p="2"
                      style={{
                        backgroundColor: "var(--gray-3)",
                        borderRadius: "6px",
                      }}
                    >
                      <Text size="1" weight="bold" color="gray" mb="1">
                        Sample Test Cases:
                      </Text>
                      <Flex gap="2" wrap="wrap">
                        {assignment.questionDetails.testCases.map(
                          (
                            tc: { input: string; expectedOutput: string },
                            i: number,
                          ) => (
                            <Card
                              key={i}
                              variant="surface"
                              style={{ padding: "8px" }}
                            >
                              <Flex direction="column" gap="1">
                                <Text size="1" color="gray">
                                  In:{" "}
                                  <code style={{ color: "var(--gray-12)" }}>
                                    {tc.input}
                                  </code>
                                </Text>
                                <Text size="1" color="gray">
                                  Out:{" "}
                                  <code style={{ color: "var(--gray-12)" }}>
                                    {tc.expectedOutput}
                                  </code>
                                </Text>
                              </Flex>
                            </Card>
                          ),
                        )}
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </Card>
            </Box>
          )}

          {/* EDITOR HEADER */}
          <div className="editor-panel-header" style={{ flexShrink: 0 }}>
            <div className="header-content">
              <div className="header-left">
                <span className="panel-title">
                  {t("codeEditor.codeEditorTitle")}
                </span>
                <button onClick={copyCode} className="copy-button">
                  <Copy size={14} />
                  <span className="button-text">{t("codeEditor.copy")}</span>
                </button>
              </div>

              <div className="header-right">
                <div className="package-inline">
                  <input
                    className="package-input-inline"
                    placeholder={t("codeEditor.packagePlaceholder")}
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading || installing}
                  />
                  <button
                    onClick={executeCommand}
                    disabled={loading || installing || !command.trim()}
                    className="install-button-inline"
                  >
                    {installing ? (
                      <div className="spinner" />
                    ) : (
                      <Package size={14} />
                    )}
                  </button>
                </div>

                <button
                  onClick={runCode}
                  disabled={loading || lang !== "python" || running || testing}
                  className="run-button-inline"
                >
                  {loading || running ? (
                    <div className="spinner" />
                  ) : (
                    <Play size={14} />
                  )}
                  <span className="button-text">
                    {loading
                      ? t("codeEditor.loading")
                      : running
                        ? t("codeEditor.running")
                        : t("codeEditor.runCode")}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* MONACO WRAPPER */}
          <div
            className="editor-monaco-wrapper"
            style={{ flexGrow: 1, minHeight: 0 }}
          >
            <MonacoEditor
              value={value}
              setValue={setValue}
              lang={lang}
              setLang={setLang}
            />
          </div>
        </div>

        {/* === RIGHT PANEL (OUTPUT) === */}
        <div className="output-panel">
          <div className="output-panel-header">
            <span className="panel-title">
              {testResults ? "Test Results" : t("codeEditor.outputTitle")}
            </span>
            <button
              onClick={() => {
                setOutput("");
                setTestResults(null);
              }}
              className="clear-button"
            >
              <Trash2 size={14} />
              <span>{t("codeEditor.clear")}</span>
            </button>
          </div>

          <div className="output-content">
            {testResults ? (
              // TEST RESULTS VIEW - UPDATED TO USE CARDS
              <ScrollArea
                type="auto"
                scrollbars="vertical"
                style={{ height: "100%", padding: "16px" }}
              >
                <Flex direction="column" gap="3">
                  {testResults.map((res, idx) => (
                    <Card
                      key={idx}
                      variant="surface"
                      style={{
                        borderLeft: res.passed
                          ? "4px solid var(--green-9)"
                          : "4px solid var(--red-9)",
                        backgroundColor: res.passed
                          ? "var(--green-2)"
                          : "var(--red-2)",
                      }}
                    >
                      <Flex direction="column" gap="2">
                        {/* Header: Icon + Pass/Fail */}
                        <Flex align="center" gap="2">
                          {res.passed ? (
                            <CheckCircle2 size={18} color="var(--green-9)" />
                          ) : (
                            <XCircle size={18} color="var(--red-9)" />
                          )}
                          <Text
                            weight="bold"
                            size="2"
                            color={res.passed ? "green" : "red"}
                          >
                            Test Case {idx + 1}:{" "}
                            {res.passed ? "Passed" : "Failed"}
                          </Text>
                        </Flex>

                        {/* Details */}
                        <Flex
                          direction="column"
                          gap="1"
                          style={{ paddingLeft: "26px" }}
                        >
                          <Text size="1" color="gray">
                            Input:{" "}
                            <code
                              style={{
                                background: "var(--gray-4)",
                                padding: "2px 4px",
                                borderRadius: "4px",
                                fontFamily: "monospace",
                              }}
                            >
                              {res.input || "(No input)"}
                            </code>
                          </Text>

                          {/* Only show detail diff if failed, or if you want to see success details too */}
                          <Flex direction="column" gap="1" mt="1">
                            <Flex justify="between" gap="2">
                              <Text
                                size="1"
                                color="gray"
                                style={{ minWidth: "60px" }}
                              >
                                Expected:
                              </Text>
                              <Text
                                size="1"
                                style={{
                                  fontFamily: "monospace",
                                  color: "var(--gray-12)",
                                }}
                              >
                                {res.expected}
                              </Text>
                            </Flex>
                            <Flex justify="between" gap="2">
                              <Text
                                size="1"
                                color="gray"
                                style={{ minWidth: "60px" }}
                              >
                                Actual:
                              </Text>
                              <Text
                                size="1"
                                style={{
                                  fontFamily: "monospace",
                                  color: res.passed
                                    ? "var(--gray-12)"
                                    : "var(--red-9)",
                                  fontWeight: res.passed ? "normal" : "bold",
                                }}
                              >
                                {res.error
                                  ? `Error: ${res.error}`
                                  : res.actual || "(Empty)"}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </ScrollArea>
            ) : output ? (
              // STANDARD OUTPUT VIEW
              <pre className="output-text">{output}</pre>
            ) : (
              // PLACEHOLDER VIEW
              <div className="output-placeholder">
                {loading ? (
                  <div className="placeholder-content">
                    <div className="spinner-large" />
                    <span className="placeholder-text">
                      {t("codeEditor.loadingPythonEnv")}
                    </span>
                  </div>
                ) : (
                  <div className="placeholder-content">
                    <Terminal size={32} className="placeholder-icon" />
                    <span className="placeholder-text">
                      {t("codeEditor.runCodeToSeeOutput")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showHints && hasHints && (
        <>
          <div
            className="editor-modal-backdrop"
            onClick={() => setShowHints(false)}
          />
          <div className="editor-modal-hints">
            <div className="editor-modal-header">
              <h2 style={{ margin: 0 }}>Hints</h2>
              <button
                onClick={() => setShowHints(false)}
                className="editor-modal-close"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <ScrollArea className="editor-modal-content">
              <Flex direction="column" gap="3" p="4">
                {availableHints.map((hint: string, i: number) => (
                  <Card key={i} variant="surface">
                    <Flex direction="column" gap="2">
                      <Text
                        weight="bold"
                        size="2"
                        style={{ color: "var(--orange-9)" }}
                      >
                        Hint {i + 1}
                      </Text>
                      <Text size="2" color="gray">
                        {hint}
                      </Text>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};

export default EditorComponent;
