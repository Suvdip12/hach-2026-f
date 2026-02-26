import "./css/BlockButton.css";

interface BlockButtonProps {
  blockType: string;
  label: string;
  minWidth: number;
  showBlockType: boolean;
  onAddBlock: (blockType: string) => void;
}

export const BlockButton = ({
  blockType,
  label,
  minWidth,
  showBlockType,
  onAddBlock,
}: BlockButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddBlock(blockType);
  };

  return (
    <button
      className="block-button"
      onClick={handleClick}
      title={`${label} (${blockType})`}
      style={{ minWidth: `${minWidth}px` }}
    >
      <div className="block-button-content">
        <div className="block-label">{label}</div>
        {showBlockType && (
          <div className="block-type">{blockType.split("_")[0]}</div>
        )}
      </div>
      <div className="block-button-overlay" />
    </button>
  );
};
