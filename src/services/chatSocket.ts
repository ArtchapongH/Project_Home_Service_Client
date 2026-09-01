import { io, type Socket } from "socket.io-client";
import type { ChatMessage, ChatRoom } from "@/types/chat";

interface SocketSuccess<T> {
  ok: true;
  data: T;
}

interface SocketFailure {
  ok: false;
  error: { code: string; message: string };
}

type SocketResponse<T> = SocketSuccess<T> | SocketFailure;

function socketUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
}

export function createChatSocket(token: string): Socket {
  return io(socketUrl(), {
    auth: { token },
    transports: ["websocket", "polling"],
  });
}

function emitWithAck<T>(
  socket: Socket,
  event: string,
  payload?: Record<string, unknown>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(
      () => reject(new Error("การเชื่อมต่อแชทใช้เวลานานเกินไป")),
      10000,
    );
    const handleResponse = (response: SocketResponse<T>) => {
      window.clearTimeout(timeoutId);
      if (response.ok) resolve(response.data);
      else reject(new Error(response.error.message));
    };

    if (payload) socket.emit(event, payload, handleResponse);
    else socket.emit(event, handleResponse);
  });
}

export function getChatRooms(socket: Socket): Promise<ChatRoom[]> {
  // ส่ง payload ว่างให้ชัดเจน เพื่อไม่ให้ Socket.IO สับสนระหว่าง payload กับ acknowledgement
  return emitWithAck(socket, "chat:rooms", {});
}

export function getChatMessages(socket: Socket, roomId: string): Promise<ChatMessage[]> {
  return emitWithAck(socket, "chat:messages", { roomId });
}

export function sendChatMessage(
  socket: Socket,
  roomId: string,
  content: string,
): Promise<ChatMessage> {
  return emitWithAck(socket, "chat:send", { roomId, content });
}
