import { ResizeHandleProps } from "../../types/blockly";
import { GripHorizontal, GripVertical } from "lucide-react";
import "./css/ResizeHandle.css";

export const ResizeHandle = ({
  direction,
  isDragging,
  onMouseDown,
}: ResizeHandleProps) => {
  const isVertical = direction === "vertical";
  const GripIcon = isVertical ? GripVertical : GripHorizontal;

  return (
    <div
      className={`resize-handle ${isVertical ? "resize-handle-vertical" : "resize-handle-horizontal"} ${
        isDragging ? "dragging" : ""
      }`}
      onMouseDown={onMouseDown}
    >
      <div className="resize-handle-grip">
        <GripIcon className="resize-handle-icon" />
      </div>
    </div>
  );
};
