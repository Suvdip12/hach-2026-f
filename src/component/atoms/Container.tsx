import {
  Container as RadixContainer,
  ContainerProps as RadixContainerProps,
} from "@radix-ui/themes";

type Size = "small" | "medium" | "large" | "extra-large";
type ContainerSize =
  | Size
  | {
      sm: Size;
      md: Size;
      lg: Size;
      xl: Size;
    };

export type ContainerProps = Omit<RadixContainerProps, "size"> & {
  size?: ContainerSize;
};

const containerSizes: Record<Size, "1" | "2" | "3" | "4"> = {
  small: "1",
  medium: "2",
  large: "3",
  "extra-large": "4",
};

function getSizeFromProps(size: ContainerSize) {
  if (!["string", "object"].includes(typeof size)) {
    return;
  }

  if (typeof size === "string") {
    return containerSizes[size];
  }

  return {
    sm: containerSizes[size.sm],
    md: containerSizes[size.md],
    lg: containerSizes[size.lg],
    xl: containerSizes[size.xl],
  };
}

/**
 * Container’s sole responsibility is to provide a consistent max-width to the content it wraps.
 * It comes just with a couple of pre-defined sizes that work well with common
 * breakpoints and typical content widths for comfortable reading.
 *
 * @see https://www.radix-ui.com/themes/docs/components/container
 */

function Container({ children, size, ...rest }: ContainerProps) {
  return (
    <RadixContainer {...rest} size={getSizeFromProps(size || "extra-large")}>
      {children}
    </RadixContainer>
  );
}

export default Container;
