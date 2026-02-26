/* eslint-disable @typescript-eslint/no-explicit-any */

// Blockly component types
export interface ResizeHandleProps {
  direction: "vertical" | "horizontal";
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export interface CodeActionsProps {
  code: string;
  loadingPyodide: boolean;
  runningCode: boolean;
  pyodideError: string;
  onCopy: () => void;
  onRun: () => void;
}

export interface ImportModalProps {
  showImportModal: boolean;
  setShowImportModal: (show: boolean) => void;
  importCode: string;
  setImportCode: (code: string) => void;
}

export interface SidebarProps {
  sidebarWidth: number;
  expandedCategories: Record<string, boolean>;
  toggleCategory: (categoryName: string) => void;
  getColumnsCount: () => number;
  getBlockMinWidth: () => number;
  handleAddBlock: (blockType: string) => void;
  isDraggingSidebar: boolean;
  handleSidebarMouseDown: (e: React.MouseEvent) => void;
}

export interface BlocklyWorkspaceProps {
  blocklyDivRef: React.RefObject<HTMLDivElement | null>;
  code: string;
}

export interface CodeDisplayProps {
  code: string;
  codeHeight: number;
}

export interface OutputDisplayProps {
  output: string;
  loadingPyodide: boolean;
  pyodideError: string;
  onClear: () => void;
}

export interface CodePanelProps {
  codePanelRef?: React.RefObject<HTMLDivElement | null>;
  codeHeight: number;
  code: string;
  output: string;
  loadingPyodide: boolean;
  runningCode: boolean;
  pyodideError: string;
  copyToClipboard: () => void;
  runGeneratedCode: () => void;
  clearOutput: () => void;
  isDraggingCodePanel: boolean;
  handleCodePanelMouseDown: (e: React.MouseEvent) => void;
  showGeneratedCode: boolean;
  toggleGeneratedCode: () => void;
  onClose?: () => void;
}

export interface CodeExecutorProps {
  pyodide: any;
  code: string;
  runningCode: boolean;
  setRunningCode: (running: boolean) => void;
  setOutput: (output: string) => void;
}

export interface MainLayoutProps {
  children: React.ReactNode;
}

export interface SidebarAreaProps {
  sidebarWidth: number;
  expandedCategories: Record<string, boolean>;
  toggleCategory: (categoryName: string) => void;
  getColumnsCount: () => number;
  getBlockMinWidth: () => number;
  handleAddBlock: (blockType: string) => void;
  isDraggingSidebar: boolean;
  handleSidebarMouseDown: (e: React.MouseEvent) => void;
}

export interface WorkspaceAreaProps {
  workspaceWidth: number;
  blocklyDivRef: React.RefObject<HTMLDivElement | null>;
  code: string;
  isDraggingWorkspace: boolean;
  handleWorkspaceMouseDown: (e: React.MouseEvent) => void;
  codePanelRef: React.RefObject<HTMLDivElement | null>;
  codeHeight: number;
  output: string;
  loadingPyodide: boolean;
  runningCode: boolean;
  pyodideError: string;
  copyToClipboard: () => void;
  runGeneratedCode: () => void;
  clearOutput: () => void;
  isDraggingCodePanel: boolean;
  handleCodePanelMouseDown: (e: React.MouseEvent) => void;
}
