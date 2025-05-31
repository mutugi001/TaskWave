
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { mockContacts, mockConversations, getConversationByParticipantId, getContactById } from '@/data/chatData';
import ChatContactList from '@/components/chat/ChatContactList';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/components/chat/ChatHeader';
import EmptyChatState from '@/components/chat/EmptyChatState';
import { ChatMessage } from '@/types/chat';

const Chat = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState(mockContacts);
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // In a real app, this would be the authenticated user's ID
  const currentUserId = "current-user";

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);

    // Mark messages as read when selecting a contact
    const updatedContacts = contacts.map(contact => {
      if (contact.id === contactId) {
        return { ...contact, unreadCount: 0 };
      }
      return contact;
    });

    setContacts(updatedContacts);

    // Mark messages as read in conversation
    const conversation = getConversationByParticipantId(contactId);
    if (conversation) {
      const updatedConversations = conversations.map(conv => {
        if (conv.id === conversation.id) {
          const updatedMessages = conv.messages.map(msg => {
            if (msg.recipientId === currentUserId && !msg.isRead) {
              return { ...msg, isRead: true };
            }
            return msg;
          });
          return { ...conv, messages: updatedMessages };
        }
        return conv;
      });
      setConversations(updatedConversations);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedContactId) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      senderId: currentUserId,
      recipientId: selectedContactId,
      content,
      timestamp: new Date(),
      isRead: false,
    };

    // Check if conversation exists
    const existingConversation = getConversationByParticipantId(selectedContactId);

    if (existingConversation) {
      // Update existing conversation
      const updatedConversations = conversations.map(conv => {
        if (conv.id === existingConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
    } else {
      // Create new conversation
      const newConversation = {
        id: uuidv4(),
        participantId: selectedContactId,
        messages: [newMessage],
      };
      setConversations([...conversations, newConversation]);
    }

    // Update contact's last message
    const updatedContacts = contacts.map(contact => {
      if (contact.id === selectedContactId) {
        return {
          ...contact,
          lastMessage: newMessage,
        };
      }
      return contact;
    });
    setContacts(updatedContacts);

    toast({
      description: "Message sent",
      duration: 1500,
    });
  };

  const selectedContact = selectedContactId ? getContactById(selectedContactId) : null;
  const selectedConversation = selectedContactId ? getConversationByParticipantId(selectedContactId) : null;
  const messages = selectedConversation ? selectedConversation.messages : [];

  return (
    <div className="h-[calc(100vh-7rem)] overflow-hidden rounded-lg border bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <ChatContactList
            contacts={contacts}
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75}>
          {selectedContact ? (
            <div className="flex flex-col h-full">
              <ChatHeader contact={selectedContact} />
              <ChatMessages
                messages={messages}
                contact={selectedContact}
                currentUserId={currentUserId}
              />
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          ) : (
            <EmptyChatState />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
