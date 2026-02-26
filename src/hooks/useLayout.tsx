import { useCallback, useState } from "react";

export const useLayoutState = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [workspaceWidth, setWorkspaceWidth] = useState(100);
  const [codeHeight, setCodeHeight] = useState(70);

  const getColumnsCount = useCallback(() => {
    if (sidebarWidth < 240) return 1;
    if (sidebarWidth < 300) return 2;
    if (sidebarWidth < 420) return 3;
    if (sidebarWidth < 520) return 4;
    return 5;
  }, [sidebarWidth]);

  const getBlockMinWidth = useCallback(() => {
    const columns = getColumnsCount();
    const availableWidth = sidebarWidth - 32;
    const gapSpace = (columns - 1) * 8;
    return Math.floor((availableWidth - gapSpace) / columns);
  }, [sidebarWidth, getColumnsCount]);

  return {
    sidebarWidth,
    setSidebarWidth,
    workspaceWidth,
    setWorkspaceWidth,
    codeHeight,
    setCodeHeight,
    getColumnsCount,
    getBlockMinWidth,
  };
};
