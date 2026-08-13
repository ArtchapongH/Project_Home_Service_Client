"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/src/theme/muiTheme";

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
  );
}
