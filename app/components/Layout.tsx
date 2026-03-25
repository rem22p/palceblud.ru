import { Outlet } from "react-router";
import { ModeHeader } from "./ModeHeader";
import { Header } from "./Header";

interface LayoutProps {
  children?: React.ReactNode;
  isFinished?: boolean;
  isActive?: boolean;
  showHeader?: boolean;
}

export function Layout({ children, isFinished = false, isActive = false, showHeader = false }: LayoutProps) {
  return (
    <>
      {showHeader ? <Header /> : <ModeHeader isFinished={isFinished} isActive={isActive} />}
      {children || <Outlet />}
    </>
  );
}