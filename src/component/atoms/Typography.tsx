import {
  Em as RadixEm,
  Text as RadixText,
  Quote as RadixQuote,
  Strong as RadixStrong,
  Heading as RadixHeading,
  EmProps as RadixEmProps,
  TextProps as RadixTextProps,
  Blockquote as RadixBlockquote,
  QuoteProps as RadixQuoteProps,
  StrongProps as RadixStrongProps,
  HeadingProps as RadixHeadingProps,
  BlockquoteProps as RadixBlockquoteProps,
} from "@radix-ui/themes";

type EmProps = {
  variant: "em";
} & RadixEmProps;

type TextProps = {
  variant: "text";
} & RadixTextProps;

type QuoteProps = {
  variant: "quote";
} & RadixQuoteProps;

type StrongProps = {
  variant: "strong";
} & RadixStrongProps;

type HeadingProps = {
  variant: "heading";
} & RadixHeadingProps;

type BlockQuoteProps = {
  variant: "blockquote";
} & RadixBlockquoteProps;

export type TypographyProps =
  | EmProps
  | TextProps
  | QuoteProps
  | StrongProps
  | HeadingProps
  | BlockQuoteProps;

function Typography(props: TypographyProps) {
  switch (props.variant) {
    case "em":
      return <RadixEm {...props} />;
    case "text":
      return <RadixText {...props} />;
    case "quote":
      return <RadixQuote {...props} />;
    case "strong":
      return <RadixStrong {...props} />;
    case "heading":
      return <RadixHeading {...props} />;
    case "blockquote":
      return <RadixBlockquote {...props} />;
    default:
      return <RadixText {...(props as RadixTextProps)} />;
  }
}

export default Typography;
