import {
  Grid as RadixGrid,
  GridProps as RadixGridProps,
} from "@radix-ui/themes";

export type GridProps = RadixGridProps;

/**
 * Grid is a utility component that helps with layout by providing a simple way to
 * organize the content in columns and rows
 *
 * @example
 * <Grid columns="3" gap="3">
 *   <div>1</div>
 *   <div>2</div>
 *   <div>3</div>
 * </Grid>
 *
 * @see https://www.radix-ui.com/themes/docs/components/grid
 */
function Grid({ children, ...rest }: GridProps) {
  return <RadixGrid {...rest}>{children}</RadixGrid>;
}

export default Grid;
