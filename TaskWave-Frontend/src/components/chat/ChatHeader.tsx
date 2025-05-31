
import { Button } from '@/components/ui/button';
import { ChatContact } from '@/types/chat';
import { User, MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  contact: ChatContact;
}

const ChatHeader = ({ contact }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b p-3">
      <div className="flex items-center gap-3">
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
        
        <div>
          <h2 className="font-semibold">{contact.name}</h2>
          <p className="text-xs text-muted-foreground">
            {contact.status === 'online' ? 'Online' : 
             contact.status === 'away' ? 'Away' : 'Offline'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="rounded-full" title="Audio call">
          <Phone className="h-4 w-4" />
          <span className="sr-only">Audio call</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" title="Video call">
          <Video className="h-4 w-4" />
          <span className="sr-only">Video call</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" title="More options">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
