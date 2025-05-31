
import { MessageSquare } from 'lucide-react';

const EmptyChatState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No conversation selected</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Select a contact from the list to start chatting or continue a previous conversation.
      </p>
    </div>
  );
};

export default EmptyChatState;
