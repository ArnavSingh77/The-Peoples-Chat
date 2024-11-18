import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

interface ChatHeaderProps {
  username: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ username }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-card-foreground">Real-time Chat</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Logged in as {username}</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-card-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-card-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};