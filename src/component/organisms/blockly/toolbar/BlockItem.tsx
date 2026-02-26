import { BlockButton } from "../../../atoms/BlockButton";

interface BlockItemProps {
  type: string;
  label: string;
  onAddBlock: (type: string) => void;
}

export const BlockItem = ({ type, label, onAddBlock }: BlockItemProps) => {
  return (
    <BlockButton
      blockType={type}
      label={label}
      minWidth={100} // Default min width for popover items
      showBlockType={false}
      onAddBlock={onAddBlock}
    />
  );
};
