/* eslint-disable @typescript-eslint/no-unused-vars */
import { Code2, Play } from "lucide-react";
import { BlocklyWorkspaceProps } from "../../types/blockly";
import "./css/BlocklyWorkspace.css";

export const BlocklyWorkspace = ({
  blocklyDivRef,
  code,
}: BlocklyWorkspaceProps) => (
  <div className="blockly-workspace" style={{ width: "100%" }}>
    <div className="blockly-workspace-container">
      <div ref={blocklyDivRef} className="blockly-workspace-inner" />
      {!code.trim() && (
        <div className="blockly-placeholder">
          <div className="blockly-placeholder-content">
            <div className="blockly-placeholder-icon">
              <Code2 />
            </div>
            <h3 className="blockly-placeholder-title">Start Building</h3>
            <p className="blockly-placeholder-description">
              Drag blocks from the topbar to create your visual program, or
              import existing Python code
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);
