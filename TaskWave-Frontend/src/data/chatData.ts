
import { ChatContact, ChatConversation, ChatMessage } from "@/types/chat";

// Mock messages data
export const mockMessages: ChatMessage[] = [
  {
    id: "msg1",
    senderId: "user1",
    recipientId: "current-user",
    content: "Hey, how's the project going?",
    timestamp: new Date(2025, 3, 20, 10, 30),
    isRead: true
  },
  {
    id: "msg2",
    senderId: "current-user",
    recipientId: "user1",
    content: "It's going well! We're almost finished with the first milestone.",
    timestamp: new Date(2025, 3, 20, 10, 32),
    isRead: true
  },
  {
    id: "msg3",
    senderId: "user1",
    recipientId: "current-user",
    content: "That's great to hear! Do you need any help with anything?",
    timestamp: new Date(2025, 3, 20, 10, 35),
    isRead: true
  },
  {
    id: "msg4",
    senderId: "user2",
    recipientId: "current-user",
    content: "I've updated the designs for the dashboard. Can you take a look?",
    timestamp: new Date(2025, 3, 21, 9, 15),
    isRead: false
  },
  {
    id: "msg5",
    senderId: "user3",
    recipientId: "current-user",
    content: "Team meeting at 3pm today. Are you joining?",
    timestamp: new Date(2025, 3, 22, 11, 0),
    isRead: false
  }
];

// Mock contacts data
export const mockContacts: ChatContact[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    status: "online",
    unreadCount: 0,
    lastMessage: mockMessages[2]
  },
  {
    id: "user2",
    name: "Sarah Williams",
    status: "away",
    unreadCount: 1,
    lastMessage: mockMessages[3]
  },
  {
    id: "user3",
    name: "Michael Chen",
    status: "offline",
    unreadCount: 1,
    lastMessage: mockMessages[4]
  },
  {
    id: "user4",
    name: "Emma Davis",
    status: "online",
    unreadCount: 0
  },
  {
    id: "user5",
    name: "James Wilson",
    status: "offline",
    unreadCount: 0
  }
];

// Mock conversations data
export const mockConversations: ChatConversation[] = [
  {
    id: "conv1",
    participantId: "user1",
    messages: [mockMessages[0], mockMessages[1], mockMessages[2]]
  },
  {
    id: "conv2",
    participantId: "user2",
    messages: [mockMessages[3]]
  },
  {
    id: "conv3",
    participantId: "user3",
    messages: [mockMessages[4]]
  }
];

// Helper function to get conversation by participant ID
export const getConversationByParticipantId = (participantId: string): ChatConversation | undefined => {
  return mockConversations.find(conv => conv.participantId === participantId);
};

// Helper function to get contact by ID
export const getContactById = (contactId: string): ChatContact | undefined => {
  return mockContacts.find(contact => contact.id === contactId);
};
