import { Button, ButtonProps } from "@radix-ui/themes";
import classNames from "classnames";
import "@/component/atoms/css/IconButton.css";

export type IconButtonProps = Omit<ButtonProps, "variant"> & {
  "aria-label"?: string;
};

export default function IconButton({
  className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      {...rest}
      variant="ghost"
      className={classNames("icon-button", className)}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}
