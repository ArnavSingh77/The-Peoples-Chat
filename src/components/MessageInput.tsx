import React from 'react';
import { Send, X } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTyping: () => void;
  replyTo?: {
    username: string;
    text: string;
  };
  clearReply: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSubmit,
  onTyping,
  replyTo,
  clearReply,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-4 bg-card border-t border-border">
      {replyTo && (
        <div className="mb-2 bg-secondary/50 rounded-lg p-2 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold block">
              Replying to {replyTo.username}
            </span>
            <p className="text-xs truncate">{replyTo.text}</p>
          </div>
          <button 
            type="button" 
            onClick={clearReply}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            onTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </form>
  );
};