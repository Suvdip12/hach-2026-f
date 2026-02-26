/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideError, setPyodideError] = useState("");
  const [loadingPyodide, setLoadingPyodide] = useState(true);

  useEffect(() => {
    const loadPyodide = async () => {
      setLoadingPyodide(true);
      setPyodideError("");

      try {
        if (typeof (window as any).loadPyodide === "function") {
          const pyodideInstance = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
            fullStdLib: false,
          });

          setPyodide(pyodideInstance);
          setLoadingPyodide(false);

          return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
        script.async = true;

        script.onload = async () => {
          try {
            const pyodideInstance = await (window as any).loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
              fullStdLib: false,
            });

            await pyodideInstance.runPython(`
              import sys
              from io import StringIO
            `);

            setPyodide(pyodideInstance);
            setLoadingPyodide(false);
          } catch (initError) {
            setPyodideError(`Failed to initialize Python: ${initError}`);
            setLoadingPyodide(false);
          }
        };

        script.onerror = () => {
          setPyodideError("Failed to load Python runtime from CDN");
          setLoadingPyodide(false);
        };

        document.head.appendChild(script);

        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      } catch (error) {
        setPyodideError(`Error loading Python: ${error}`);
        setLoadingPyodide(false);
      }
    };

    loadPyodide();
  }, []);

  return { pyodide, loadingPyodide, pyodideError };
};
