import {
  Button as RadixButton,
  ButtonProps as RadixButtonProps,
} from "@radix-ui/themes";
import Link from "next/link";

type Variant = "solid" | "outline" | "text";
type Size = "extra-small" | "small" | "medium" | "large";

export type ButtonProps = Omit<RadixButtonProps, "variant" | "size"> & {
  variant?: Variant;
  size?: Size;
  href?: string;
};

const buttonSizes: Record<Size, RadixButtonProps["size"]> = {
  "extra-small": "1",
  small: "2",
  medium: "3",
  large: "4",
};

const buttonVariants: Record<Variant, RadixButtonProps["variant"]> = {
  solid: "solid",
  outline: "outline",
  text: "ghost",
};

export default function Button({
  href,
  size = "medium",
  variant = "solid",
  children,
  ...rest
}: ButtonProps) {
  return href ? (
    <Link href={href}>
      <RadixButton
        {...rest}
        variant={buttonVariants[variant]}
        size={buttonSizes[size]}
      >
        {children}
      </RadixButton>
    </Link>
  ) : (
    <RadixButton
      {...rest}
      variant={buttonVariants[variant]}
      size={buttonSizes[size]}
    >
      {children}
    </RadixButton>
  );
}
