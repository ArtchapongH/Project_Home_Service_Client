"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, MessageCircle, Send, X } from "lucide-react";
import { Box, IconButton, Typography } from "@mui/material";
import type { Socket } from "socket.io-client";
import { useLocale, useTranslations } from "next-intl";
import type { User } from "@/contexts/AuthContext";
import {
  createChatSocket,
  getChatMessages,
  getChatRooms,
  sendChatMessage,
} from "@/services/chatSocket";
import type { ChatMessage, ChatRoom } from "@/types/chat";

interface HumanChatPanelProps {
  user: User;
  token: string;
  onBack: () => void;
  onClose: () => void;
}

function formatMessageTime(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function HumanChatPanel({ user, token, onBack, onClose }: HumanChatPanelProps) {
  const t = useTranslations("Chatbot");
  const locale = useLocale();
  const socketRef = useRef<Socket | null>(null);
  const activeRoomIdRef = useRef<string | null>(null);
  const roomRequestRef = useRef(0);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => { activeRoomIdRef.current = activeRoomId; }, [activeRoomId]);

  useEffect(() => {
    const socket = createChatSocket(token);
    socketRef.current = socket;
    async function loadRooms() {
      try {
        setRooms(await getChatRooms(socket));
        setError("");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : t("humanLoadRoomsError"));
      }
    }
    socket.on("connect", () => { setIsConnected(true); void loadRooms(); });
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", () => { setIsConnected(false); setError(t("humanConnectionError")); });
    socket.on("chat:rooms-updated", () => void loadRooms());
    socket.on("chat:message", (message: ChatMessage) => {
      setRooms((current) => current.map((room) => room.roomId === message.roomId ? { ...room, lastMessage: message.content, lastMessageAt: message.createdAt } : room));
      if (activeRoomIdRef.current === message.roomId) {
        setMessages((current) => current.some((item) => item.messageId === message.messageId) ? current : [...current, message]);
      }
    });
    return () => { roomRequestRef.current += 1; socketRef.current = null; socket.disconnect(); };
  }, [t, token]);

  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function selectRoom(roomId: string) {
    const socket = socketRef.current;
    if (!socket) return;
    const requestId = ++roomRequestRef.current;
    activeRoomIdRef.current = roomId;
    setActiveRoomId(roomId);
    setMessages([]);
    setError("");
    try {
      const loadedMessages = await getChatMessages(socket, roomId);
      if (roomRequestRef.current !== requestId || activeRoomIdRef.current !== roomId) return;
      setMessages((current) => {
        const merged = new Map(loadedMessages.map((message) => [message.messageId, message]));
        current.forEach((message) => merged.set(message.messageId, message));
        return [...merged.values()].sort(
          (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
        );
      });
    } catch (loadError) {
      if (roomRequestRef.current === requestId) {
        setError(loadError instanceof Error ? loadError.message : t("humanLoadMessagesError"));
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const socket = socketRef.current;
    const content = draft.trim();
    if (!socket || !activeRoomId || !content || isSending) return;
    const sendingRoomId = activeRoomId;
    setIsSending(true);
    setError("");
    try {
      await sendChatMessage(socket, activeRoomId, content);
      if (activeRoomIdRef.current === sendingRoomId) setDraft("");
    } catch (sendError) {
      if (activeRoomIdRef.current === sendingRoomId) {
        setError(sendError instanceof Error ? sendError.message : t("humanSendError"));
      }
    } finally {
      setIsSending(false);
    }
  }

  const activeRoom = rooms.find((room) => room.roomId === activeRoomId) ?? null;
  return (
    <Box sx={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 68, px: 1.5, color: "white", background: "linear-gradient(135deg, #123a82 0%, #2d63f6 100%)" }}>
        <IconButton aria-label={activeRoom ? t("humanBackRooms") : t("back")} onClick={() => { if (activeRoom) { roomRequestRef.current += 1; activeRoomIdRef.current = null; setActiveRoomId(null); } else onBack(); }} sx={{ color: "white" }}><ArrowLeft size={20} /></IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700 }} noWrap>{activeRoom?.title || t("humanTitle")}</Typography>
          <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "rgba(255,255,255,.8)" }}>
            <Box component="span" sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: isConnected ? "#69e2a0" : "#f7b267" }} />
            {activeRoom?.orderCode || (isConnected ? t("humanConnected") : t("humanConnecting"))}
          </Typography>
        </Box>
        <IconButton aria-label={t("close")} onClick={onClose} sx={{ color: "white" }}><X size={20} /></IconButton>
      </Box>

      {activeRoom ? (
        <>
          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2, bgcolor: "#f5f8fe" }}>
            {messages.length === 0 && !error && <Typography align="center" color="text.secondary" sx={{ mt: 5, fontSize: 14 }}>{t("humanEmptyConversation")}</Typography>}
            {messages.map((message) => {
              const mine = String(message.senderId) === String(user.id);
              return (
                <Box key={message.messageId} sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", mb: 1.5 }}>
                  <Box sx={{ maxWidth: "82%" }}>
                    {!mine && <Typography variant="caption" sx={{ ml: 1, color: "#67738a" }}>{message.senderName}</Typography>}
                    <Box sx={{ px: 1.5, py: 1, borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", bgcolor: mine ? "#2d63f6" : "white", color: mine ? "white" : "#263248", boxShadow: mine ? "none" : "0 2px 10px rgba(27,55,100,.08)", overflowWrap: "anywhere" }}>
                      <Typography sx={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{message.content}</Typography>
                      <Typography sx={{ mt: 0.25, fontSize: 10, textAlign: "right", color: mine ? "rgba(255,255,255,.72)" : "#8791a3" }}>{formatMessageTime(message.createdAt, locale)}</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
            <div ref={messageEndRef} />
          </Box>
          {error && <Typography role="alert" sx={{ px: 2, py: 0.75, bgcolor: "#fff2f2", color: "#bd2c2c", fontSize: 12 }}>{error}</Typography>}
          {activeRoom.canSend ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, p: 1.5, borderTop: "1px solid #e6ebf3", bgcolor: "white" }}>
              <Box component="textarea" aria-label={t("humanMessageLabel")} placeholder={t("humanPlaceholder")} value={draft} maxLength={2000} rows={1} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} sx={{ flex: 1, resize: "none", maxHeight: 90, border: "1px solid #dce3ed", borderRadius: 2, px: 1.5, py: 1.1, font: "inherit", fontSize: 14, outline: "none", "&:focus": { borderColor: "#2d63f6" } }} />
              <IconButton type="submit" aria-label={t("send")} disabled={!draft.trim() || isSending || !isConnected} sx={{ alignSelf: "flex-end", bgcolor: "#2d63f6", color: "white", "&:hover": { bgcolor: "#214fca" }, "&.Mui-disabled": { bgcolor: "#dce3ed" } }}><Send size={18} /></IconButton>
            </Box>
          ) : <Typography align="center" sx={{ p: 1.5, bgcolor: "#eef1f6", color: "#667085", fontSize: 13 }}>{t("humanRoomClosed")}</Typography>}
        </>
      ) : (
        <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#f8faff" }}>
          {error && <Typography role="alert" sx={{ p: 1.5, bgcolor: "#fff2f2", color: "#bd2c2c", fontSize: 12 }}>{error}</Typography>}
          {rooms.length === 0 && !error && <Box sx={{ px: 4, pt: 9, textAlign: "center", color: "#7a8495" }}><MessageCircle size={38} strokeWidth={1.5} /><Typography sx={{ mt: 1.5, fontSize: 14 }}>{t("humanNoRooms")}</Typography></Box>}
          {rooms.map((room) => (
            <Box component="button" type="button" key={room.roomId} onClick={() => void selectRoom(room.roomId)} sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.6, border: 0, borderBottom: "1px solid #e7ebf2", bgcolor: "white", textAlign: "left", cursor: "pointer", "&:hover": { bgcolor: "#f1f5ff" } }}>
              <Box sx={{ display: "grid", placeItems: "center", width: 42, height: 42, flex: "0 0 auto", borderRadius: "50%", bgcolor: room.roomType === "SUPPORT" ? "#e8efff" : "#e8f8f1", color: room.roomType === "SUPPORT" ? "#2d63f6" : "#16845b" }}><MessageCircle size={20} /></Box>
              <Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontWeight: 650, fontSize: 14 }} noWrap>{room.title}</Typography><Typography sx={{ color: "#7a8495", fontSize: 12 }} noWrap>{room.lastMessage || room.orderCode || t("humanStartConversation")}</Typography></Box>
              <ChevronRight size={18} color="#9aa3b2" />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
