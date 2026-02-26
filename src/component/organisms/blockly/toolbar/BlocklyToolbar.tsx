"use client";

import { useTranslation } from "@/i18n";
import { Flex, Button, Separator } from "@radix-ui/themes";
import {
  Play,
  Code,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Braces,
} from "lucide-react";
import { CATEGORIES } from "../../../../data/blocklyCategories";
import { BlockCategoryPopover } from "./BlockCategoryPopover";

interface BlocklyToolbarProps {
  onAddBlock: (type: string) => void;
  onRunCode: () => void;
  onToggleCode: () => void;
  isOpen: boolean;
  onReset?: () => void; // Optional reset if present in future
}

export const BlocklyToolbar = ({
  onAddBlock,
  onRunCode,
  onToggleCode,
  isOpen,
}: BlocklyToolbarProps) => {
  const { t } = useTranslation();

  return (
    <Flex
      align="center"
      justify="between"
      style={{
        height: "48px",
        padding: "0 16px",
        borderBottom: "1px solid var(--gray-6)",
        background: "var(--color-surface)",
        flexShrink: 0,
      }}
    >
      <Flex gap="2" align="center" wrap="wrap">
        {CATEGORIES.map((category) => (
          <BlockCategoryPopover
            key={category.name}
            name={category.name}
            color={category.color}
            blocks={category.blocks}
            onAddBlock={onAddBlock}
          />
        ))}
      </Flex>

      <Flex gap="3" align="center">
        <Separator orientation="vertical" style={{ height: "24px" }} />

        <button
          className="blockly-topbar-button secondary"
          onClick={onToggleCode}
          title={isOpen ? "Hide Code" : "Show Code"}
        >
          {isOpen ? (
            <Code size={16} fill="currentColor" />
          ) : (
            <Braces size={16} fill="currentColor" />
          )}
          <span>{isOpen ? "Hide Code" : "Show Code"}</span>
        </button>

        <button
          className="blockly-topbar-button primary"
          onClick={onRunCode}
          title={"Run"}
        >
          <Play size={16} fill="currentColor" />
          <span>{"Run"}</span>
        </button>
      </Flex>
    </Flex>
  );
};
