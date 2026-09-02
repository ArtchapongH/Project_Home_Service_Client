import apiClient from "@/services/apiClient";
import type {
  ChatbotHistory,
  ChatbotReply,
  ChatbotRequest,
} from "@/types/chatbot";

export async function sendChatbotMessage(
  input: ChatbotRequest,
  signal?: AbortSignal,
): Promise<ChatbotReply> {
  const response = await apiClient.post<ChatbotReply>("/api/chat", input, {
    signal,
    timeout: 45000,
  });
  return response.data;
}

export async function getChatbotHistory(signal?: AbortSignal): Promise<ChatbotHistory> {
  const response = await apiClient.get<ChatbotHistory>("/api/chat/history", { signal });
  return response.data;
}

export async function clearChatbotHistory(): Promise<{ conversationId: string }> {
  const response = await apiClient.delete<{ conversationId: string }>("/api/chat/history");
  return response.data;
}

export function getChatbotError(_error: unknown, fallback: string): string {
  return fallback;
}
