import { Outlet } from "react-router";
import { ModeHeader } from "./ModeHeader";

export function Layout() {
  return (
    <>
      <ModeHeader />
      <Outlet />
    </>
  );
}