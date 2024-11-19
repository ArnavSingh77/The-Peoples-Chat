import React from 'react';

interface TypingIndicatorProps {
  usernames: string[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ usernames }) => {
  const getTypingText = () => {
    if (usernames.length === 1) {
      return `${usernames[0]} is typing`;
    } else if (usernames.length === 2) {
      return `${usernames[0]} and ${usernames[1]} are typing`;
    } else if (usernames.length > 2) {
      return `${usernames[0]} and ${usernames.length - 1} others are typing`;
    }
    return '';
  };

  return (
    <div className="flex items-center space-x-2 text-muted-foreground text-sm p-2">
      <span>{getTypingText()}</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};