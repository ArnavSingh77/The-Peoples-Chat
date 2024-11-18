import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface ChatMessageProps {
  message: {
    text: string;
    username: string;
    timestamp: { seconds: number };
    isRead: boolean;
  };
  isOwnMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  const timestamp = message.timestamp?.seconds 
    ? format(message.timestamp.seconds * 1000, 'HH:mm')
    : '';

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] break-words rounded-lg px-4 py-2 ${
          isOwnMessage 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {!isOwnMessage && (
          <span className="block text-xs font-semibold mb-1">{message.username}</span>
        )}
        <p className="text-sm">{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-75">{timestamp}</span>
          {isOwnMessage && (
            message.isRead ? 
              <CheckCheck className="w-4 h-4 opacity-75" /> : 
              <Check className="w-4 h-4 opacity-75" />
          )}
        </div>
      </div>
    </div>
  );
};