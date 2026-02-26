import { useCallback, useEffect, useState } from "react";

export const useResizeHandlers = (
  setSidebarWidth: (width: number) => void,
  setWorkspaceWidth: (width: number) => void,
  setCodeHeight: (height: number) => void,
  codePanelRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingWorkspace, setIsDraggingWorkspace] = useState(false);
  const [isDraggingCodePanel, setIsDraggingCodePanel] = useState(false);

  // Sidebar resize handlers
  const handleSidebarMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSidebar(true);
  }, []);

  const handleSidebarMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingSidebar) return;
      e.preventDefault();
      const newWidth = Math.max(200, Math.min(700, e.clientX));
      setSidebarWidth(newWidth);
    },
    [isDraggingSidebar, setSidebarWidth],
  );

  const handleSidebarMouseUp = useCallback(() => {
    setIsDraggingSidebar(false);
  }, []);

  // Workspace resize handlers
  const handleWorkspaceMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingWorkspace(true);
  }, []);

  const handleWorkspaceMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingWorkspace) return;
      e.preventDefault();

      const mainArea = document.querySelector(
        ".workspace-container",
      ) as HTMLElement;
      if (!mainArea) return;

      const rect = mainArea.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const percentage = Math.max(
        30,
        Math.min(100, (relativeX / rect.width) * 100),
      );
      setWorkspaceWidth(percentage);
    },
    [isDraggingWorkspace, setWorkspaceWidth],
  );

  const handleWorkspaceMouseUp = useCallback(() => {
    setIsDraggingWorkspace(false);
  }, []);

  // Code panel resize handlers
  const handleCodePanelMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingCodePanel(true);
  }, []);

  const handleCodePanelMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingCodePanel || !codePanelRef.current) return;
      e.preventDefault();

      const rect = codePanelRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const percentage = Math.max(
        20,
        Math.min(90, (relativeY / rect.height) * 100),
      );
      setCodeHeight(percentage);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDraggingCodePanel, setCodeHeight],
  );

  const handleCodePanelMouseUp = useCallback(() => {
    setIsDraggingCodePanel(false);
  }, []);

  // Mouse event listeners
  useEffect(() => {
    if (isDraggingSidebar) {
      document.addEventListener("mousemove", handleSidebarMouseMove);
      document.addEventListener("mouseup", handleSidebarMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleSidebarMouseMove);
      document.removeEventListener("mouseup", handleSidebarMouseUp);
      if (!isDraggingWorkspace && !isDraggingCodePanel) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }
    return () => {
      document.removeEventListener("mousemove", handleSidebarMouseMove);
      document.removeEventListener("mouseup", handleSidebarMouseUp);
    };
  }, [
    isDraggingSidebar,
    handleSidebarMouseMove,
    handleSidebarMouseUp,
    isDraggingWorkspace,
    isDraggingCodePanel,
  ]);

  useEffect(() => {
    if (isDraggingWorkspace) {
      document.addEventListener("mousemove", handleWorkspaceMouseMove);
      document.addEventListener("mouseup", handleWorkspaceMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleWorkspaceMouseMove);
      document.removeEventListener("mouseup", handleWorkspaceMouseUp);
      if (!isDraggingSidebar && !isDraggingCodePanel) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }
    return () => {
      document.removeEventListener("mousemove", handleWorkspaceMouseMove);
      document.removeEventListener("mouseup", handleWorkspaceMouseUp);
    };
  }, [
    isDraggingWorkspace,
    handleWorkspaceMouseMove,
    handleWorkspaceMouseUp,
    isDraggingSidebar,
    isDraggingCodePanel,
  ]);

  useEffect(() => {
    if (isDraggingCodePanel) {
      document.addEventListener("mousemove", handleCodePanelMouseMove);
      document.addEventListener("mouseup", handleCodePanelMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleCodePanelMouseMove);
      document.removeEventListener("mouseup", handleCodePanelMouseUp);
      if (!isDraggingSidebar && !isDraggingWorkspace) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }
    return () => {
      document.removeEventListener("mousemove", handleCodePanelMouseMove);
      document.removeEventListener("mouseup", handleCodePanelMouseUp);
    };
  }, [
    isDraggingCodePanel,
    handleCodePanelMouseMove,
    handleCodePanelMouseUp,
    isDraggingSidebar,
    isDraggingWorkspace,
  ]);

  return {
    isDraggingSidebar,
    isDraggingWorkspace,
    isDraggingCodePanel,
    handleSidebarMouseDown,
    handleWorkspaceMouseDown,
    handleCodePanelMouseDown,
  };
};
