"use client";

import "blockly/python";
import "./BlocklyComponent.css";

import { useRef, useState, useEffect, useCallback } from "react";
import { usePyodide } from "../../../hooks/pyodide";
import { useLayoutState } from "../../../hooks/useLayout";
import { useResizeHandlers } from "../../../hooks/useResize";
import { useCodeExecutor } from "../../../hooks/useCodeExecutors";
import { useBlocklyWorkspace } from "../../../hooks/blockWorkspace";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/util/auth";
import {
  assignmentApi,
  extractData,
  qnaCompletedApi,
  type Assignment,
  type Question,
} from "@/services/api.service";

import {
  MainLayout,
  // BlocklySidebar, // Removed
  BlocklyWorkspace,
  CodePanel,
  ImportModal,
} from "../..";
import { AssignmentDrawer } from "@/component/molecules/AssignmentDrawer";
import { BlocklyToolbar } from "./toolbar/BlocklyToolbar";
import toast from "react-hot-toast";

type AssignmentWithQuestion = Assignment & {
  questionDetails?: Question;
};

export default function BlocklyComponent() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [importCode, setImportCode] = useState("");
  const [runningCode, setRunningCode] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);
  const [showCodePanelSide, setShowCodePanelSide] = useState(false);
  // Removed expandedCategories state as it's not needed for toolbar popovers

  const [assignments, setAssignments] = useState<AssignmentWithQuestion[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [markingSolved, setMarkingSolved] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showTestCases, setShowTestCases] = useState(false);

  const codePanelRef = useRef<HTMLDivElement>(null);
  const blocklyDivRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const lectureId = searchParams.get("lectureId");
  const assignmentIdFromUrl = searchParams.get("assignmentId");
  const studentId = session?.user?.id as string | undefined;

  const { pyodide, loadingPyodide, pyodideError } = usePyodide();
  const {
    // sidebarWidth, // Removed
    // setSidebarWidth, // Removed
    workspaceWidth,
    setWorkspaceWidth,
    codeHeight,
    setCodeHeight,
    // getColumnsCount, // Removed
    // getBlockMinWidth, // Removed
  } = useLayoutState();

  const {
    // isDraggingSidebar, // Removed
    isDraggingCodePanel,
    // handleSidebarMouseDown, // Removed
    handleCodePanelMouseDown,
  } = useResizeHandlers(
    () => {}, // setSidebarWidth no-op
    setWorkspaceWidth,
    setCodeHeight,
    codePanelRef,
  );

  const { handleAddBlock } = useBlocklyWorkspace(blocklyDivRef, setCode);

  const loadAssignments = useCallback(async () => {
    if (!lectureId || !studentId) return;

    try {
      setLoadingAssignments(true);
      const res = await assignmentApi.getByLecture(lectureId);
      const data = extractData<{ assignments: Assignment[] }>(res);

      if (data?.assignments) {
        const blocklyAssignments = data.assignments.filter(
          (a) => a.qnaType === "blockly",
        );

        const assignmentsWithDetails = await Promise.all(
          blocklyAssignments.map(async (assignment) => {
            try {
              const detailRes = await assignmentApi.getWithProgress(
                assignment.id,
                studentId,
              );
              return extractData<AssignmentWithQuestion>(detailRes);
            } catch {
              return assignment;
            }
          }),
        );

        const validAssignments = assignmentsWithDetails.filter(
          (a): a is AssignmentWithQuestion => a !== null && a !== undefined,
        );

        setAssignments(validAssignments);

        if (assignmentIdFromUrl) {
          const found = validAssignments.find(
            (a) => a.id === assignmentIdFromUrl,
          );
          if (found) {
            setSelectedAssignmentId(found.id);
          } else if (validAssignments.length > 0) {
            setSelectedAssignmentId(validAssignments[0].id);
          }
        } else if (validAssignments.length > 0) {
          setSelectedAssignmentId(validAssignments[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load assignments:", error);
    } finally {
      setLoadingAssignments(false);
    }
  }, [lectureId, studentId, assignmentIdFromUrl]);

  const [hasSuccessfulRun, setHasSuccessfulRun] = useState(false);

  // Monitor runningCode state to detect completion
  useEffect(() => {
    // If code finished running (was running, now false)
    if (!runningCode) {
      if (pyodideError || (output && output.toLowerCase().includes("error"))) {
        setHasSuccessfulRun(false);
      } else if (output && code && code.trim().length > 0) {
        // Only mark success if there is output, no error, AND code is not empty
        setHasSuccessfulRun(true);
      }
    }
  }, [runningCode, pyodideError, output, code]);

  // Reset success state if code changes?
  // User didn't ask for this, but it's good practice.
  // However, user might run -> success -> add comment -> submit.
  // So maybe don't reset strictly. Let's keep it sticky for now as requested "at least once".

  useEffect(() => {
    if (lectureId && studentId) {
      loadAssignments();
    }
  }, [lectureId, studentId, loadAssignments]);

  const selectedAssignment = assignments.find(
    (a) => a.id === selectedAssignmentId,
  );
  const question = selectedAssignment?.questionDetails;

  const isCompleted =
    selectedAssignment?.isAssignmentCompleted ||
    selectedAssignment?.isQuestionCompleted ||
    false;

  const toggleBlocks = () => {
    setShowBlocks((prev) => !prev);
  };

  const toggleGeneratedCode = () => {
    setShowGeneratedCode((prev) => !prev);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy code to clipboard:", err);
    }
  };

  const clearOutput = () => {
    setOutput("");
  };

  const { runGeneratedCode } = useCodeExecutor({
    pyodide,
    code,
    runningCode,
    setRunningCode,
    setOutput,
  });
  // thats not completed it not teking test cases inputs
  const runTestCase = async (
    testCase: { input: string; expectedOutput: string },
    userCode: string,
  ): Promise<{
    passed: boolean;
    actualOutput: string;
    inputCount: number;
    error?: string;
  }> => {
    if (!pyodide) {
      return {
        passed: false,
        actualOutput: "",
        inputCount: 0,
        error: "Pyodide not loaded",
      };
    }

    try {
      // Prepare input list for this test case
      // We handle multiple inputs if they are separated by newlines in the input string
      const inputs = testCase.input.split("\n");
      const inputsJson = JSON.stringify(inputs);

      // Reset output buffer and inject input mock
      await pyodide.runPythonAsync(`
import sys
from io import StringIO

# Mock input function
input_values = ${inputsJson}
input_counter = 0

def input(prompt=""):
    global input_counter
    if input_counter < len(input_values):
        val = input_values[input_counter]
        input_counter += 1
        return val
    return ""

# Capture stdout
captured_output = StringIO()
sys.stdout = captured_output
sys.stderr = captured_output
      `);

      // Run user code
      await pyodide.runPythonAsync(userCode);

      // Get output and input usage count
      const resultOutput = await pyodide.runPythonAsync(`
output = captured_output.getvalue()
output
      `);

      const inputCount =
        (await pyodide.runPythonAsync(`
input_counter
      `)) || 0;

      // Cleanup
      await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
      `);

      const actualOutput = String(resultOutput).trim();
      const expectedOutput = testCase.expectedOutput.trim();

      return {
        passed: actualOutput === expectedOutput,
        actualOutput,
        inputCount,
      };
    } catch (err) {
      // Cleanup on error
      try {
        await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
        `);
      } catch {}

      return {
        passed: false,
        actualOutput: "",
        inputCount: 0,
        error: String(err),
      };
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment?.qnaId || !studentId) {
      alert("Unable to submit. Missing assignment or student information.");
      return;
    }

    if (!code.trim()) {
      alert("Please create some blocks before submitting.");
      return;
    }

    if (question?.testCases && question.testCases.length > 0) {
      // Run Test Cases
      let allPassed = true;
      setSubmitting(true); // Show submitting state while testing

      for (let i = 0; i < question.testCases.length; i++) {
        const testCase = question.testCases[i];
        const result = await runTestCase(testCase, code);

        if (!result.passed) {
          allPassed = false;
          const inputValues = testCase.input ? testCase.input.split("\n") : [];
          const expectsInput =
            inputValues.length > 0 && testCase.input.trim() !== "";

          let errorMessage = `Test Case ${i + 1} Failed!\n\nInput:\n${testCase.input}\n\nExpected Output:\n${testCase.expectedOutput}\n\nYour Output:\n${result.actualOutput}`;

          if (expectsInput && result.inputCount === 0) {
            errorMessage += `\n\nSuggestion: It looks like your code didn't read the input. Make sure to use the "input" block to read the provided values instead of hardcoding them.`;
          }

          if (result.error) {
            errorMessage += `\nError: ${result.error}`;
          }

          alert(errorMessage);
          setSubmitting(false);
          return; // Stop on first failure
        }
      }

      if (!allPassed) {
        setSubmitting(false);
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await qnaCompletedApi.markCompleted(
        selectedAssignment.qnaId,
        "completed",
      );

      if (res.success) {
        toast.success("Assignment submitted successfully!");
        await loadAssignments();
      } else {
        toast.error(
          res.error || "Failed to submit assignment. Please try again.",
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsSolved = async () => {
    if (!selectedAssignment?.qnaId || !studentId) {
      alert(
        "Unable to mark as solved. Missing assignment or student information.",
      );
      return;
    }

    try {
      setMarkingSolved(true);
      const res = await qnaCompletedApi.markCompleted(
        selectedAssignment.qnaId,
        "completed",
      );

      if (res.success) {
        toast.success("Marked as solved!");
        await loadAssignments();
      } else {
        toast.error(res.error || "Failed to mark as solved. Please try again.");
      }
    } catch (error) {
      console.error("Mark as solved error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setMarkingSolved(false);
    }
  };

  return (
    <div className="blockly-main-container">
      <div className="blockly-layout">
        <ImportModal
          showImportModal={showImportModal}
          setShowImportModal={setShowImportModal}
          importCode={importCode}
          setImportCode={setImportCode}
        />

        <div className="blockly-layout-container">
          <div className="blockly-content-row">
            {lectureId && (
              <AssignmentDrawer
                assignments={assignments}
                selectedAssignmentId={selectedAssignmentId}
                onAssignmentChange={setSelectedAssignmentId}
                loadingAssignments={loadingAssignments}
                selectedAssignment={selectedAssignment}
                question={question}
                isCompleted={isCompleted}
                showHints={showHints}
                setShowHints={setShowHints}
                showTestCases={showTestCases}
                setShowTestCases={setShowTestCases}
                onSubmit={handleSubmitAssignment}
                submitting={submitting}
                onMarkAsSolved={handleMarkAsSolved}
                markingSolved={markingSolved}
                hasSuccessfulRun={hasSuccessfulRun}
              />
            )}

            <div className="blockly-right-panel">
              <BlocklyToolbar
                onAddBlock={handleAddBlock}
                onRunCode={() => {
                  if (!showCodePanelSide) setShowCodePanelSide(true);
                  runGeneratedCode();
                }}
                onToggleCode={() => setShowCodePanelSide((prev) => !prev)}
                isOpen={showCodePanelSide}
              />

              <div className="blockly-workspace-container">
                <BlocklyWorkspace blocklyDivRef={blocklyDivRef} code={code} />
              </div>
            </div>

            {showCodePanelSide && (
              <CodePanel
                codePanelRef={codePanelRef}
                codeHeight={codeHeight}
                code={code}
                output={output}
                loadingPyodide={loadingPyodide}
                runningCode={runningCode}
                pyodideError={pyodideError}
                copyToClipboard={copyToClipboard}
                runGeneratedCode={runGeneratedCode}
                clearOutput={clearOutput}
                isDraggingCodePanel={isDraggingCodePanel}
                handleCodePanelMouseDown={handleCodePanelMouseDown}
                showGeneratedCode={showGeneratedCode}
                toggleGeneratedCode={toggleGeneratedCode}
                onClose={() => setShowCodePanelSide(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
