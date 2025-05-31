
export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string; 
  status: 'online' | 'offline' | 'away';
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface ChatConversation {
  id: string;
  participantId: string;
  messages: ChatMessage[];
}
