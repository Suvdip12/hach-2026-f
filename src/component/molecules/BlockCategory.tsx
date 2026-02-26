"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { BlockButton } from "../atoms/BlockButton";
import { useTranslation } from "@/i18n";
import "./css/BlockCategory.css";

interface Block {
  type: string;
  label: string;
}

interface BlockCategoryProps {
  name: string;
  color: string;
  blocks: Block[];
  isExpanded: boolean;
  onToggle: () => void;
  getColumnsCount: () => number;
  getBlockMinWidth: () => number;
  onAddBlock: (blockType: string) => void;
}

// Map category names to simplified terms
const categoryTranslationMap: Record<string, string> = {
  Logic: "Control",
  Loops: "Control",
  Math: "Math",
  Text: "Text",
  Lists: "Lists",
  Variables: "Memory",
  Functions: "Functions",
};

// Map block labels to simplified terms
const blockTranslationMap: Record<string, string> = {
  If: "If",
  Compare: "Compare",
  Operation: "Operation",
  Boolean: "Boolean",
  Null: "Null",
  Ternary: "Ternary",
  Repeat: "Repeat",
  "While / Until": "While / Until",
  For: "For",
  "For Each": "For Each",
  "Flow Statements": "Flow Statements",
  Number: "Number",
  Arithmetic: "Arithmetic",
  Single: "Single",
  Trig: "Trig",
  Constant: "Constant",
  "Number Property": "Number Property",
  Round: "Round",
  "On List": "On List",
  Modulo: "Modulo",
  Constrain: "Constrain",
  "Random Int": "Random Int",
  "Random Float": "Random Float",
  Text: "Text",
  Join: "Join",
  Append: "Append",
  Length: "Length",
  "Is Empty": "Is Empty",
  "Index Of": "Index Of",
  "Char At": "Char At",
  "Get Substring": "Get Substring",
  "Change Case": "Change Case",
  Trim: "Trim",
  Print: "Show Message",
  "Create Empty": "Create Empty",
  "Create With": "Create With",
  "Get Index": "Get Index",
  "Set Index": "Set Index",
  "Get Sublist": "Get Sublist",
  Split: "Split",
  Sort: "Sort",
  // New/Renamed mappings
  "Text Input": "Ask for Text",
  "Get Variable": "Use Memory",
  "Set Variable": "Change Memory",
  "Create Variable": "Remember as",
};

export const BlockCategory = ({
  name,
  blocks,
  isExpanded,
  onToggle,
  getColumnsCount,
  getBlockMinWidth,
  onAddBlock,
}: BlockCategoryProps) => {
  const { t } = useTranslation();

  const getCategoryClass = (categoryName: string) => {
    return `category-${categoryName.toLowerCase()}`;
  };

  const getTranslatedCategoryName = (categoryName: string) => {
    return categoryTranslationMap[categoryName] || categoryName;
  };

  const getTranslatedBlockLabel = (label: string) => {
    return blockTranslationMap[label] || label;
  };

  return (
    <div className={`sidebar-category ${getCategoryClass(name)}`}>
      <button onClick={onToggle} className="category-button">
        <div className="category-button-content">
          <span className="category-name">
            {getTranslatedCategoryName(name)}
          </span>
          <span className="category-count">{blocks.length}</span>
        </div>
        <div className="category-icons">
          {isExpanded ? (
            <ChevronDown className="chevron-icon" />
          ) : (
            <ChevronRight className="chevron-icon" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div
          className="blocks-grid"
          style={{
            gridTemplateColumns: `repeat(${getColumnsCount()}, 1fr)`,
          }}
        >
          {blocks.map((block) => (
            <BlockButton
              key={block.type}
              blockType={block.type}
              label={getTranslatedBlockLabel(block.label)}
              minWidth={getBlockMinWidth()}
              showBlockType={getColumnsCount() <= 2}
              onAddBlock={onAddBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
};
