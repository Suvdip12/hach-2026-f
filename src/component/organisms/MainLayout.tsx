import { MainLayoutProps } from "../../types/blockly";
import "./css/MainLayout.css";

export const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="main-layout">{children}</div>
);
