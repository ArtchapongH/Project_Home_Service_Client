"use client";

import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import {
  createChatSocket,
  getChatMessages,
  getChatRooms,
  sendChatMessage,
} from "@/services/chatSocket";
import type { ChatMessage, ChatRoom } from "@/types/chat";
import type { Socket } from "socket.io-client";

function formatMessageTime(value: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function FloatingChatBubble() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const socketRef = useRef<Socket | null>(null);
  const activeRoomIdRef = useRef<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const socket = createChatSocket(token);
    socketRef.current = socket;

    async function loadRooms() {
      try {
        setRooms(await getChatRooms(socket));
        setError("");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "โหลดห้องแชทไม่สำเร็จ");
      }
    }

    socket.on("connect", () => {
      setIsConnected(true);
      void loadRooms();
    });
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", () => {
      setIsConnected(false);
      setError("เชื่อมต่อแชทไม่สำเร็จ");
    });
    socket.on("chat:rooms-updated", () => void loadRooms());
    socket.on("chat:message", (message: ChatMessage) => {
      setRooms((current) =>
        current.map((room) =>
          room.roomId === message.roomId
            ? { ...room, lastMessage: message.content, lastMessageAt: message.createdAt }
            : room,
        ),
      );
      if (activeRoomIdRef.current === message.roomId) {
        setMessages((current) =>
          current.some((item) => item.messageId === message.messageId)
            ? current
            : [...current, message],
        );
      }
    });

    return () => {
      socketRef.current = null;
      socket.disconnect();
      setIsConnected(false);
      setRooms([]);
      setMessages([]);
      setActiveRoomId(null);
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function selectRoom(roomId: string) {
    const socket = socketRef.current;
    if (!socket) return;

    setActiveRoomId(roomId);
    setMessages([]);
    setError("");
    try {
      setMessages(await getChatMessages(socket, roomId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "โหลดข้อความไม่สำเร็จ");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const socket = socketRef.current;
    const content = draft.trim();
    if (!socket || !activeRoomId || !content || isSending) return;

    setIsSending(true);
    setError("");
    try {
      await sendChatMessage(socket, activeRoomId, content);
      setDraft("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "ส่งข้อความไม่สำเร็จ");
    } finally {
      setIsSending(false);
    }
  }

  const activeRoom = rooms.find((room) => room.roomId === activeRoomId) ?? null;
  const isAuthPage = /\/(login|register)(\/|$)/.test(pathname);
  if (isLoading || !isAuthenticated || !user || isAuthPage) return null;

  return (
    <Box sx={{ position: "fixed", right: { xs: 12, sm: 24 }, bottom: { xs: 12, sm: 24 }, zIndex: 1400 }}>
      {isOpen && (
        <Paper
          elevation={12}
          sx={{
            position: "absolute",
            right: 0,
            bottom: 72,
            width: { xs: "calc(100vw - 24px)", sm: 390 },
            height: { xs: "min(620px, calc(100vh - 110px))", sm: 570 },
            maxHeight: "calc(100vh - 110px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 3,
            border: "1px solid #dce5f5",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 68, px: 2, color: "white", background: "linear-gradient(135deg, #123a82 0%, #2d63f6 100%)" }}>
            {activeRoom && (
              <IconButton aria-label="กลับไปยังรายการห้อง" onClick={() => setActiveRoomId(null)} sx={{ color: "white" }}>
                <ArrowLeft size={20} />
              </IconButton>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }} noWrap>
                {activeRoom?.title || "ข้อความของคุณ"}
              </Typography>
              <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "rgba(255,255,255,.8)" }}>
                <Box component="span" sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: isConnected ? "#69e2a0" : "#f7b267" }} />
                {activeRoom?.orderCode || (isConnected ? "เชื่อมต่อแล้ว" : "กำลังเชื่อมต่อ")}
              </Typography>
            </Box>
            <IconButton aria-label="ปิดแชท" onClick={() => setIsOpen(false)} sx={{ color: "white" }}>
              <X size={20} />
            </IconButton>
          </Box>

          {activeRoom ? (
            <>
              <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2, bgcolor: "#f5f8fe" }}>
                {messages.length === 0 && !error && (
                  <Typography align="center" color="text.secondary" sx={{ mt: 5, fontSize: 14 }}>
                    เริ่มต้นบทสนทนาด้วยข้อความแรก
                  </Typography>
                )}
                {messages.map((message) => {
                  const isMine = String(message.senderId) === String(user.id);
                  return (
                    <Box key={message.messageId} sx={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", mb: 1.5 }}>
                      <Box sx={{ maxWidth: "82%" }}>
                        {!isMine && (
                          <Typography variant="caption" sx={{ ml: 1, color: "#67738a" }}>
                            {message.senderName}
                          </Typography>
                        )}
                        <Box sx={{ px: 1.5, py: 1, borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", bgcolor: isMine ? "#2d63f6" : "white", color: isMine ? "white" : "#263248", boxShadow: isMine ? "none" : "0 2px 10px rgba(27,55,100,.08)", overflowWrap: "anywhere" }}>
                          <Typography sx={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{message.content}</Typography>
                          <Typography sx={{ mt: 0.25, fontSize: 10, textAlign: "right", color: isMine ? "rgba(255,255,255,.72)" : "#8791a3" }}>
                            {formatMessageTime(message.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messageEndRef} />
              </Box>
              {error && <Typography sx={{ px: 2, py: 0.75, bgcolor: "#fff2f2", color: "#bd2c2c", fontSize: 12 }}>{error}</Typography>}
              {activeRoom.canSend ? (
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, p: 1.5, borderTop: "1px solid #e6ebf3", bgcolor: "white" }}>
                  <Box
                    component="textarea"
                    aria-label="ข้อความ"
                    placeholder="พิมพ์ข้อความ..."
                    value={draft}
                    maxLength={2000}
                    rows={1}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    sx={{ flex: 1, resize: "none", maxHeight: 90, border: "1px solid #dce3ed", borderRadius: 2, px: 1.5, py: 1.1, font: "inherit", fontSize: 14, outline: "none", "&:focus": { borderColor: "#2d63f6" } }}
                  />
                  <IconButton type="submit" aria-label="ส่งข้อความ" disabled={!draft.trim() || isSending || !isConnected} sx={{ alignSelf: "flex-end", bgcolor: "#2d63f6", color: "white", "&:hover": { bgcolor: "#214fca" }, "&.Mui-disabled": { bgcolor: "#dce3ed" } }}>
                    <Send size={18} />
                  </IconButton>
                </Box>
              ) : (
                <Typography align="center" sx={{ p: 1.5, bgcolor: "#eef1f6", color: "#667085", fontSize: 13 }}>
                  งานนี้สิ้นสุดแล้ว คุณยังเปิดดูประวัติข้อความได้
                </Typography>
              )}
            </>
          ) : (
            <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#f8faff" }}>
              {error && <Typography sx={{ p: 1.5, bgcolor: "#fff2f2", color: "#bd2c2c", fontSize: 12 }}>{error}</Typography>}
              {rooms.length === 0 && !error && (
                <Box sx={{ px: 4, pt: 9, textAlign: "center", color: "#7a8495" }}>
                  <MessageCircle size={38} strokeWidth={1.5} />
                  <Typography sx={{ mt: 1.5, fontSize: 14 }}>ยังไม่มีห้องสนทนา</Typography>
                </Box>
              )}
              {rooms.map((room) => (
                <Box
                  component="button"
                  type="button"
                  key={room.roomId}
                  onClick={() => void selectRoom(room.roomId)}
                  sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.6, border: 0, borderBottom: "1px solid #e7ebf2", bgcolor: "white", textAlign: "left", cursor: "pointer", "&:hover": { bgcolor: "#f1f5ff" } }}
                >
                  <Box sx={{ display: "grid", placeItems: "center", width: 42, height: 42, flex: "0 0 auto", borderRadius: "50%", bgcolor: room.roomType === "SUPPORT" ? "#e8efff" : "#e8f8f1", color: room.roomType === "SUPPORT" ? "#2d63f6" : "#16845b" }}>
                    <MessageCircle size={20} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 650, fontSize: 14 }} noWrap>{room.title}</Typography>
                    <Typography sx={{ color: "#7a8495", fontSize: 12 }} noWrap>
                      {room.lastMessage || room.orderCode || "เริ่มต้นการสนทนา"}
                    </Typography>
                  </Box>
                  <ChevronRight size={18} color="#9aa3b2" />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      )}

      <IconButton
        aria-label={isOpen ? "ปิดแชท" : "เปิดแชท"}
        onClick={() => setIsOpen((current) => !current)}
        sx={{ width: 58, height: 58, color: "white", background: "linear-gradient(135deg, #123a82 0%, #2d63f6 100%)", boxShadow: "0 10px 28px rgba(34,82,179,.35)", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 13px 32px rgba(34,82,179,.42)" }, transition: "transform .2s, box-shadow .2s" }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
      </IconButton>
    </Box>
  );
}
