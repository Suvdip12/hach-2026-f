/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import toast from "react-hot-toast";

interface UseCodeExecutorProps {
  pyodide: any;
  code: string;
  runningCode: boolean;
  setRunningCode: (running: boolean) => void;
  setOutput: (output: string) => void;
}

export const useCodeExecutor = ({
  pyodide,
  code,
  setRunningCode,
  setOutput,
}: UseCodeExecutorProps) => {
  const runGeneratedCode = useCallback(async () => {
    if (!pyodide || !code.trim()) {
      setOutput("No code to execute");
      return;
    }

    setRunningCode(true);
    setOutput("");

    try {
      await pyodide.runPython(`
import sys
from io import StringIO

captured_output = StringIO()
sys.stdout = captured_output
sys.stderr = captured_output
      `);

      await pyodide.runPython(code);

      const result = await pyodide.runPython(`
output = captured_output.getvalue()
output if output else "Code executed successfully (no output)"
      `);

      setOutput(String(result));
      toast.success("Your blocks looking good and its works");
    } catch (error) {
      // console.error("Run code error:", error);
      try {
        const partialOutput = await pyodide.runPython(
          "captured_output.getvalue()",
        );
        const errorMessage = `${partialOutput ? partialOutput + "\n" : ""}Error: ${String(error)}`;
        setOutput(errorMessage);
        toast.error("Check blocks and try again");
      } catch {
        setOutput(`Error: ${String(error)}`);
        toast.error("Check blocks and try again");
      }
    } finally {
      try {
        await pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
        `);
      } catch {
        // Ignore cleanup errors
      }
      setRunningCode(false);
    }
  }, [pyodide, code, setRunningCode, setOutput]);

  return { runGeneratedCode };
};
