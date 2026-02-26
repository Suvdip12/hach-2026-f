import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";
import { useEffect, useRef, useCallback } from "react";

export const useBlocklyWorkspace = (
  blocklyDivRef: React.RefObject<HTMLDivElement | null>,
  setCode: (code: string) => void,
  sidebarWidth?: number,
  workspaceWidth?: number,
) => {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  // 1. Initialize Blockly
  useEffect(() => {
    if (!blocklyDivRef.current) return;
    if (workspaceRef.current) return;

    try {
      workspaceRef.current = Blockly.inject(blocklyDivRef.current, {
        trashcan: true,
        scrollbars: true,
        grid: {
          spacing: 20,
          length: 3,
          colour: "#E5E7EB",
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
        oneBasedIndex: false,
        move: {
          scrollbars: {
            horizontal: true,
            vertical: true,
          },
          drag: true,
          wheel: true,
        },
      });

      const onWorkspaceChange = () => {
        if (workspaceRef.current) {
          try {
            const pyCode = pythonGenerator.workspaceToCode(
              workspaceRef.current,
            );
            setCode(pyCode);
          } catch (error) {
            console.error("Code generation error:", error);
            setCode("# Error generating code from blocks");
          }
        }
      };

      workspaceRef.current.addChangeListener(onWorkspaceChange);
    } catch (error) {
      console.error("Blockly initialization error:", error);
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [blocklyDivRef, setCode]);

  useEffect(() => {
    const div = blocklyDivRef.current;
    // We only attach the observer if the workspace is initialized
    if (!div || !workspaceRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // This forces Blockly to recalculate its width/height
      // based on the parent div's new size
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    });

    resizeObserver.observe(div);

    return () => {
      resizeObserver.disconnect();
    };
  }, [blocklyDivRef]); // Run this effect once when the ref is stable

  // 3. Handle Add Block Logic
  const handleAddBlock = useCallback((blockType: string) => {
    if (workspaceRef.current) {
      try {
        const block = workspaceRef.current.newBlock(blockType);
        block.initSvg();
        block.render();
        block.select();

        // Center the new block
        const blockCoords = block.getRelativeToSurfaceXY();
        const workspaceMetrics = workspaceRef.current.getMetrics();

        // Safety check for metrics
        if (workspaceMetrics) {
          const centerX = workspaceMetrics.viewWidth / 2 - blockCoords.x;
          const centerY = workspaceMetrics.viewHeight / 2 - blockCoords.y;
          block.moveBy(centerX, centerY);
        }
      } catch (error) {
        console.error("Error adding block:", error);
      }
    } else {
      console.error("Workspace not available");
    }
  }, []);

  return { handleAddBlock };
};
