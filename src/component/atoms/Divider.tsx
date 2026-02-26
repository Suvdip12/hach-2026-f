import classNames from "classnames";
import "@/component/atoms/css/Divider.css";

type DividerProps = {
  vertical?: boolean;
  size?: "50" | "60" | "70" | "80" | "90" | "100";
  className?: string;
};

function Divider({
  vertical = false,
  size = "80",
  className = "",
}: DividerProps) {
  return (
    <div
      className={classNames(
        "divider",
        vertical ? "vertical" : "horizontal",
        vertical ? [`height-${size}`] : [`width-${size}`],
        className,
      )}
    />
  );
}

export default Divider;
