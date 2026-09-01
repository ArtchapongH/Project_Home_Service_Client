"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/theme/muiTheme";
import { AuthProvider } from "@/contexts/AuthContext";
import { FloatingChatBubble } from "@/components/chat/FloatingChatBubble";

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider theme={muiTheme}>
        {children}
        <FloatingChatBubble />
      </ThemeProvider>
    </AuthProvider>
  );
}
