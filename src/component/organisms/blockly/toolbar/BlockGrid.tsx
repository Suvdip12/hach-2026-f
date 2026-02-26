import { ReactNode } from "react";
import { Box, Grid } from "@radix-ui/themes";

interface BlockGridProps {
  children: ReactNode;
}

export const BlockGrid = ({ children }: BlockGridProps) => {
  return (
    <Grid columns="2" gap="2" width="auto">
      {children}
    </Grid>
  );
};
