import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, Reply } from 'lucide-react';

interface ChatMessageProps {
  message: {
    text: string;
    username: string;
    timestamp: { seconds: number };
    isRead: boolean;
    id?: string;
    replyTo?: {
      username: string;
      text: string;
    };
  };
  isOwnMessage: boolean;
  onReply: (message: {
    id?: string;
    username: string;
    text: string;
  }) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isOwnMessage, 
  onReply 
}) => {
  const timestamp = message.timestamp?.seconds 
    ? format(message.timestamp.seconds * 1000, 'HH:mm')
    : '';

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div
        className={`max-w-[70%] break-words rounded-lg px-4 py-2 relative ${
          isOwnMessage 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {message.replyTo && (
          <div className={`mb-2 py-1 px-2 rounded-md ${
            isOwnMessage 
              ? 'bg-primary-foreground/10' 
              : 'bg-secondary-foreground/10'
          }`}>
            <span className="text-xs font-semibold block">
              Replying to {message.replyTo.username}
            </span>
            <p className="text-xs truncate">{message.replyTo.text}</p>
          </div>
        )}
        
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
        <button 
          onClick={() => onReply({
            id: message.id,
            username: message.username,
            text: message.text
          })}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Reply className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    </div>
  );
};