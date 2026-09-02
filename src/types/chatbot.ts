export type ChatbotRole = "user" | "assistant";

export interface ChatbotMessage {
  id: string;
  role: ChatbotRole;
  content: string;
  createdAt: string;
}

export interface ChatbotRequest {
  message: string;
  requestId: string;
  conversationId?: string | null;
  history?: Array<Pick<ChatbotMessage, "role" | "content">>;
}

export interface ChatbotReply {
  message: string;
  conversationId: string | null;
}

export interface ChatbotHistory {
  conversationId: string;
  messages: ChatbotMessage[];
}
