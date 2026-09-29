export type ChatbotRole = "user" | "assistant";

export interface ChatbotServiceLink {
  id: string;
  name: string;
  href: string;
  available: boolean;
}

export interface ChatbotMessage {
  id: string;
  role: ChatbotRole;
  content: string;
  serviceLinks?: ChatbotServiceLink[];
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
  serviceLinks: ChatbotServiceLink[];
}

export interface ChatbotHistory {
  conversationId: string;
  messages: ChatbotMessage[];
}
