import {
  Flex as RadixFlex,
  FlexProps as RadixFlexProps,
} from "@radix-ui/themes";

export type FlexProps = RadixFlexProps;

/**
 * Flex is a utility component that helps with layout by providing a simple way to
 * align and distribute elements horizontally or vertically.
 *
 * @example
 * <Flex gap="3" direction="column">
 *   <div>1</div>
 *   <div>2</div>
 *   <div>3</div>
 * </Flex>
 *
 * @see https://www.radix-ui.com/themes/docs/components/flex
 */
function Flex({ children, ...rest }: FlexProps) {
  return <RadixFlex {...rest}>{children}</RadixFlex>;
}

export default Flex;
