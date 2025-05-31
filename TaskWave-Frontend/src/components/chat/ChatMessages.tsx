
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ChatMessage, ChatContact } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessagesProps {
  messages: ChatMessage[];
  contact: ChatContact;
  currentUserId: string;
}

const ChatMessages = ({ messages, contact, currentUserId }: ChatMessagesProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.length > 0 ? (
          <>
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showAvatar = index === 0 || 
                messages[index - 1].senderId !== message.senderId;
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-2 text-sm",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                      {contact.avatar ? (
                        <img 
                          src={contact.avatar} 
                          alt={contact.name} 
                          className="aspect-square h-full w-full"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={cn(
                    "flex flex-col gap-1",
                    isCurrentUser ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                      isCurrentUser 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-foreground"
                    )}>
                      {message.content}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(message.timestamp, 'h:mm a')}
                    </span>
                  </div>
                  
                  {isCurrentUser && showAvatar && (
                    <div className="h-8 w-8 opacity-0">
                      {/* Spacer for alignment */}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full py-8">
            <p className="text-center text-muted-foreground">
              No messages yet. Start a conversation!
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
