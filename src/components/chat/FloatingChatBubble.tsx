"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, ChevronRight, Headphones, MessageCircle, X } from "lucide-react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { ChatbotPanel } from "@/components/chat/ChatbotPanel";
import { HumanChatPanel } from "@/components/chat/HumanChatPanel";
import { useAuth } from "@/contexts/AuthContext";

type ChatMode = "menu" | "ai" | "human";

export function FloatingChatBubble() {
  const t = useTranslations("Chatbot");
  const { user, token, isAuthenticated, isLoading, isAdmin, isTechnician } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("menu");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const staffMode = isAdmin || isTechnician;
  const activeMode = staffMode ? "human" : isAuthenticated ? mode : "ai";

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [activeMode, isOpen]);

  const hiddenRoute = /\/(login|register)(\/|$)/.test(pathname);
  if (isLoading || hiddenRoute) return null;

  function toggleChat() {
    if (!isOpen) setMode(staffMode ? "human" : isAuthenticated ? "menu" : "ai");
    setIsOpen((current) => !current);
  }

  function closeChat() {
    setIsOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }

  return (
    <Box sx={{ position: "fixed", right: { xs: 12, sm: 24 }, bottom: { xs: "max(12px, env(safe-area-inset-bottom))", sm: 24 }, zIndex: 1400 }}>
      <Paper
        ref={panelRef}
        role="dialog"
        aria-label={t("menuTitle")}
        tabIndex={-1}
        onKeyDown={(event) => { if (event.key === "Escape") closeChat(); }}
        elevation={12}
        sx={{
          position: "absolute",
          right: 0,
          bottom: 72,
          width: { xs: "calc(100vw - 24px)", sm: 390 },
          height: { xs: "min(620px, calc(100dvh - 110px))", sm: 570 },
          maxHeight: "calc(100dvh - 110px)",
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid #dce5f5",
        }}
      >
        {!staffMode && (
          <ChatbotPanel
            key={isAuthenticated && user ? `user-${user.id}` : "guest"}
            authenticated={isAuthenticated && Boolean(user)}
            visible={activeMode === "ai"}
            onBack={() => setMode("menu")}
            onClose={closeChat}
          />
        )}

        {!staffMode && activeMode === "menu" && (
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", bgcolor: "#f7f9fe" }}>
            <Box sx={{ display: "flex", alignItems: "center", minHeight: 68, px: 2, color: "white", background: "linear-gradient(135deg, #123a82 0%, #2d63f6 100%)" }}>
              <Box sx={{ flex: 1 }}><Typography sx={{ fontWeight: 700 }}>{t("menuTitle")}</Typography><Typography variant="caption" sx={{ color: "rgba(255,255,255,.8)" }}>{t("menuSubtitle")}</Typography></Box>
              <IconButton aria-label={t("close")} onClick={closeChat} sx={{ color: "white" }}><X size={20} /></IconButton>
            </Box>
            <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 1.5, p: 2.5 }}>
              <Typography sx={{ mb: 0.5, color: "#667085", fontSize: 13 }}>{t("chooseMode")}</Typography>
              <ModeButton icon={<Bot size={22} />} title={t("aiMode")} description={t("aiModeDescription")} color="#2d63f6" onClick={() => setMode("ai")} />
              <ModeButton icon={<Headphones size={22} />} title={t("humanMode")} description={t("humanModeDescription")} color="#16845b" onClick={() => setMode("human")} />
            </Box>
          </Box>
        )}

        {isOpen && activeMode === "human" && user && token && (
          <HumanChatPanel
            user={user}
            token={token}
            onBack={staffMode ? closeChat : () => setMode("menu")}
            onClose={closeChat}
          />
        )}
      </Paper>

      <IconButton ref={launcherRef} aria-label={isOpen ? t("close") : t("open")} onClick={toggleChat} sx={{ width: 58, height: 58, color: "white", background: "linear-gradient(135deg, #123a82 0%, #2d63f6 100%)", boxShadow: "0 10px 28px rgba(34,82,179,.35)", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 13px 32px rgba(34,82,179,.42)" }, transition: "transform .2s, box-shadow .2s" }}>
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
      </IconButton>
    </Box>
  );
}

function ModeButton({ icon, title, description, color, onClick }: { icon: ReactNode; title: string; description: string; color: string; onClick: () => void }) {
  return (
    <Box component="button" type="button" onClick={onClick} sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%", p: 2, border: "1px solid #e1e7f1", borderRadius: 3, bgcolor: "white", textAlign: "left", cursor: "pointer", boxShadow: "0 5px 18px rgba(27,55,100,.06)", "&:hover": { borderColor: color, transform: "translateY(-1px)" }, transition: "all .18s" }}>
      <Box sx={{ display: "grid", placeItems: "center", width: 46, height: 46, flex: "0 0 auto", borderRadius: "14px", bgcolor: `${color}14`, color }}>{icon}</Box>
      <Box sx={{ flex: 1 }}><Typography sx={{ fontWeight: 700, color: "#24324b" }}>{title}</Typography><Typography sx={{ mt: 0.25, color: "#7a8495", fontSize: 12 }}>{description}</Typography></Box>
      <ChevronRight size={18} color="#9aa3b2" />
    </Box>
  );
}
