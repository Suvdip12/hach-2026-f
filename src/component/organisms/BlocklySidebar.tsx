"use client";

import { useState } from "react"; // Import useState
import { CATEGORIES } from "../../data/blocklyCategories";
import { SidebarProps } from "../../types/blockly";
import { BlockCategory } from "../molecules/BlockCategory";
import { ResizeHandle } from "../atoms/ResizeHandle";
import { useTranslation } from "@/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import Icons
import "./css/BlocklySidebar.css";

export const BlocklySidebar = ({
  sidebarWidth,
  expandedCategories,
  toggleCategory,
  getColumnsCount,
  getBlockMinWidth,
  handleAddBlock,
  isDraggingSidebar,
  handleSidebarMouseDown,
}: SidebarProps) => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`blockly-sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{ width: isCollapsed ? "50px" : `${sidebarWidth}px` }}
    >
      <div className="blockly-sidebar-header">
        {!isCollapsed && (
          <h2 className="blockly-sidebar-title">{t("blockly.title")}</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sidebar-collapse-button"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Hide content when collapsed */}
      {!isCollapsed && (
        <div className="blockly-sidebar-content">
          {CATEGORIES.map((category) => (
            <BlockCategory
              key={category.name}
              name={category.name}
              color={category.color}
              blocks={category.blocks}
              isExpanded={expandedCategories[category.name]}
              onToggle={() => toggleCategory(category.name)}
              getColumnsCount={getColumnsCount}
              getBlockMinWidth={getBlockMinWidth}
              onAddBlock={handleAddBlock}
            />
          ))}
        </div>
      )}

      {/* Hide resize handle when collapsed so user can't drag it */}
      {!isCollapsed && (
        <ResizeHandle
          direction="vertical"
          isDragging={isDraggingSidebar}
          onMouseDown={handleSidebarMouseDown}
        />
      )}
    </div>
  );
};
