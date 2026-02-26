"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/i18n";
import { BlockGrid } from "./BlockGrid";
import { BlockItem } from "./BlockItem";
import { Button, Box, Text } from "@radix-ui/themes";
import "../../../molecules/css/BlockCategory.css";
import "./BlockCategoryPopover.css";

// Copied from BlockCategory.tsx for translation mapping
const categoryTranslationMap: Record<string, string> = {
  Logic: "Control",
  Loops: "Control",
  Math: "Math",
  Text: "Text",
  Lists: "Lists",
  Variables: "Memory",
  Functions: "Functions",
};

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

interface Block {
  type: string;
  label: string;
}

interface BlockCategoryPopoverProps {
  name: string;
  color: string;
  blocks: Block[];
  onAddBlock: (type: string) => void;
}

export const BlockCategoryPopover = ({
  name,
  color,
  blocks,
  onAddBlock,
}: BlockCategoryPopoverProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const getTranslatedCategoryName = (categoryName: string) => {
    return categoryTranslationMap[categoryName] || categoryName;
  };

  const getTranslatedBlockLabel = (label: string) => {
    return blockTranslationMap[label] || label;
  };

  // Extract color classes to apply styles
  const getCategoryClass = (categoryName: string) => {
    return `category-${categoryName.toLowerCase()}`;
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className={getCategoryClass(name)}>
          <button
            className={`category-button popover-trigger-button ${open ? "popover-trigger-active" : ""}`}
          >
            <span className="category-name category-name-custom">
              {getTranslatedCategoryName(name)}
            </span>
            {open ? (
              <ChevronUp className="chevron-icon" size={16} />
            ) : (
              <ChevronDown className="chevron-icon" size={16} />
            )}
          </button>
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="popover-content"
          sideOffset={8}
          align="start"
        >
          <Box mb="2">
            <Text as="p" className="popover-header">
              {getTranslatedCategoryName(name)} Blocks
            </Text>
          </Box>
          <BlockGrid>
            {blocks.map((block) => (
              <BlockItem
                key={block.type}
                type={block.type}
                label={getTranslatedBlockLabel(block.label)}
                onAddBlock={(type) => {
                  onAddBlock(type);
                  setOpen(false); // Close on selection
                }}
              />
            ))}
          </BlockGrid>
          <Popover.Arrow className="popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
