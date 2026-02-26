import { TextField as RadixTextField } from "@radix-ui/themes";

export type TextFieldProps = Omit<
  Parameters<(typeof RadixTextField)["Root"]>["0"],
  "size" | "variant"
> & {
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
};

const sizeMap: Record<
  NonNullable<TextFieldProps["size"]>,
  Parameters<(typeof RadixTextField)["Root"]>["0"]["size"]
> = {
  small: "1",
  medium: "2",
  large: "3",
};

export const TextField = ({ size, icon, ...restProps }: TextFieldProps) => {
  return (
    <RadixTextField.Root {...restProps} size={size ? sizeMap[size] : undefined}>
      {icon && <RadixTextField.Slot>{icon}</RadixTextField.Slot>}
    </RadixTextField.Root>
  );
};
