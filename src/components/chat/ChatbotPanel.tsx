"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, Bot, RotateCcw, Send, Trash2, X } from "lucide-react";
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  clearChatbotHistory,
  getChatbotError,
  getChatbotHistory,
  sendChatbotMessage,
} from "@/services/chatbotApi";
import type { ChatbotMessage } from "@/types/chatbot";

interface ChatbotPanelProps {
  authenticated: boolean;
  visible: boolean;
  onBack: () => void;
  onClose: () => void;
}

function localMessage(role: ChatbotMessage["role"], content: string): ChatbotMessage {
  return {
    id: `local-${role}-${Date.now()}-${Math.random()}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function ChatbotPanel({
  authenticated,
  visible,
  onBack,
  onClose,
}: ChatbotPanelProps) {
  const t = useTranslations("Chatbot");
  const endRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [failedRequest, setFailedRequest] = useState<{ content: string; requestId: string } | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(authenticated);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!authenticated) return;

    const controller = new AbortController();
    void getChatbotHistory(controller.signal)
      .then((history) => {
        setConversationId(history.conversationId);
        setMessages(history.messages);
        setError("");
      })
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) setError(getChatbotError(loadError, t("historyError")));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingHistory(false);
      });
    return () => controller.abort();
  }, [authenticated, t]);

  useEffect(() => {
    if (visible) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, visible]);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function submit(content: string, appendUser: boolean, requestId = crypto.randomUUID()) {
    if (!content || isSending || isLoadingHistory) return;
    const historyMessages = !appendUser && messages.at(-1)?.role === "user" && messages.at(-1)?.content === content
      ? messages.slice(0, -1)
      : messages;
    const priorHistory = historyMessages.slice(-10).map(({ role, content: itemContent }) => ({
      role,
      content: itemContent,
    }));
    if (appendUser) setMessages((current) => [...current, localMessage("user", content)]);
    setDraft("");
    setError("");
    setFailedRequest(null);
    setIsSending(true);
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await sendChatbotMessage(
        {
          message: content,
          requestId,
          conversationId,
          history: authenticated ? undefined : priorHistory,
        },
        controller.signal,
      );
      setConversationId(response.conversationId);
      setMessages((current) => [...current, localMessage("assistant", response.message)]);
    } catch (sendError) {
      if (!controller.signal.aborted) {
        setError(getChatbotError(sendError, t("sendError")));
        setFailedRequest({ content, requestId });
      }
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      if (!controller.signal.aborted) setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit(draft.trim(), true);
  }

  async function handleClear() {
    if (isSending || isLoadingHistory) return;
    if (!window.confirm(t("clearConfirm"))) return;
    requestRef.current?.abort();
    setIsSending(false);
    try {
      if (authenticated) {
        const result = await clearChatbotHistory();
        setConversationId(result.conversationId);
      } else {
        setConversationId(null);
      }
      setMessages([]);
      setError("");
      setFailedRequest(null);
    } catch (clearError) {
      setError(getChatbotError(clearError, t("clearError")));
    }
  }

  return (
    <Box sx={{ display: visible ? "flex" : "none", height: "100%", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 68, px: 1.5, color: "white", background: "linear-gradient(135deg, #123a82 0%, #2d63f6 100%)" }}>
        {authenticated && (
          <IconButton aria-label={t("back")} onClick={onBack} sx={{ color: "white" }}>
            <ArrowLeft size={20} />
          </IconButton>
        )}
        <Box sx={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: "12px", bgcolor: "rgba(255,255,255,.16)" }}>
          <Bot size={21} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700 }} noWrap>{t("title")}</Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,.8)" }}>{t("subtitle")}</Typography>
        </Box>
        <IconButton aria-label={t("clear")} onClick={() => void handleClear()} disabled={messages.length === 0 || isSending || isLoadingHistory} sx={{ color: "white" }}>
          <Trash2 size={18} />
        </IconButton>
        <IconButton aria-label={t("close")} onClick={onClose} sx={{ color: "white" }}>
          <X size={20} />
        </IconButton>
      </Box>

      <Box role="log" aria-live="polite" sx={{ flex: 1, overflowY: "auto", px: 2, py: 2, bgcolor: "#f5f8fe" }}>
        {isLoadingHistory ? (
          <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}><CircularProgress size={28} /></Box>
        ) : messages.length === 0 ? (
          <Box sx={{ mx: "auto", mt: 5, maxWidth: 280, textAlign: "center", color: "#667085" }}>
            <Box sx={{ display: "grid", placeItems: "center", width: 58, height: 58, mx: "auto", mb: 2, borderRadius: "18px", bgcolor: "#e5edff", color: "#2d63f6" }}><Bot size={30} /></Box>
            <Typography sx={{ fontWeight: 700, color: "#23314d" }}>{t("welcomeTitle")}</Typography>
            <Typography sx={{ mt: 1, fontSize: 13, lineHeight: 1.6 }}>{t("welcomeBody")}</Typography>
            <Typography sx={{ mt: 2, fontSize: 11, lineHeight: 1.5, color: "#8791a3" }}>
              {authenticated ? t("privacyAuthenticated") : t("privacyGuest")}
            </Typography>
          </Box>
        ) : (
          messages.map((message) => {
            const mine = message.role === "user";
            return (
              <Box key={message.id} sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", mb: 1.5 }}>
                <Box sx={{ maxWidth: "84%", px: 1.5, py: 1, borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", bgcolor: mine ? "#2d63f6" : "white", color: mine ? "white" : "#263248", boxShadow: mine ? "none" : "0 2px 10px rgba(27,55,100,.08)", overflowWrap: "anywhere" }}>
                  <Typography sx={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{message.content}</Typography>
                </Box>
              </Box>
            );
          })
        )}
        {isSending && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "fit-content", px: 1.5, py: 1, borderRadius: "16px 16px 16px 4px", bgcolor: "white", color: "#667085" }}>
            <CircularProgress size={14} /><Typography sx={{ fontSize: 13 }}>{t("thinking")}</Typography>
          </Box>
        )}
        <div ref={endRef} />
      </Box>

      {error && (
        <Box role="alert" sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 0.75, bgcolor: "#fff2f2", color: "#a92323" }}>
          <Typography sx={{ flex: 1, fontSize: 12 }}>{error}</Typography>
          {failedRequest && <Button size="small" startIcon={<RotateCcw size={13} />} onClick={() => void submit(failedRequest.content, false, failedRequest.requestId)}>{t("retry")}</Button>}
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, p: 1.5, borderTop: "1px solid #e6ebf3", bgcolor: "white" }}>
        <Box component="textarea" aria-label={t("messageLabel")} placeholder={t("placeholder")} value={draft} maxLength={1000} rows={1} disabled={isSending || isLoadingHistory} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} sx={{ flex: 1, resize: "none", maxHeight: 90, border: "1px solid #dce3ed", borderRadius: 2, px: 1.5, py: 1.1, font: "inherit", fontSize: 14, outline: "none", "&:focus": { borderColor: "#2d63f6" } }} />
        <IconButton type="submit" aria-label={t("send")} disabled={!draft.trim() || isSending || isLoadingHistory} sx={{ alignSelf: "flex-end", bgcolor: "#2d63f6", color: "white", "&:hover": { bgcolor: "#214fca" }, "&.Mui-disabled": { bgcolor: "#dce3ed" } }}><Send size={18} /></IconButton>
      </Box>
    </Box>
  );
}
