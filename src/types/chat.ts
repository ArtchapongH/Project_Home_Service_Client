export interface ChatRoom {
  roomId: string;
  roomType: "SUPPORT" | "ORDER";
  customerId: string;
  orderId: string | null;
  title: string;
  orderCode: string | null;
  canSend: boolean;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

export interface ChatMessage {
  messageId: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt: string;
}
