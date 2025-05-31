
import { useState } from 'react';
import { ChatContact } from '@/types/chat';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatContactListProps {
  contacts: ChatContact[];
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

const ChatContactList = ({ contacts, selectedContactId, onSelectContact }: ChatContactListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className={cn(
                  "w-full flex items-start gap-3 rounded-md p-2 text-left",
                  selectedContactId === contact.id 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-muted"
                )}
                onClick={() => onSelectContact(contact.id)}
              >
                <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  {contact.avatar ? (
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      className="aspect-square h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                  <span 
                    className={cn(
                      "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-background",
                      contact.status === 'online' ? "bg-success" : 
                      contact.status === 'away' ? "bg-warning" : "bg-muted"
                    )}
                  />
                </div>
                
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{contact.name}</p>
                    {contact.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {format(contact.lastMessage.timestamp, 'h:mm a')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    {contact.lastMessage ? (
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {contact.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-xs italic text-muted-foreground">No messages yet</p>
                    )}
                    
                    {contact.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-center py-4 text-sm text-muted-foreground">No contacts found</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatContactList;
