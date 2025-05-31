
import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-3">
      <div className="flex gap-2">
        <Textarea
          placeholder="Type a message..."
          className="min-h-[40px] flex-1 resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            type="button"
            title="Attach files"
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach files</span>
          </Button>
          <Button
            size="icon"
            className="rounded-full"
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            title="Send message"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
