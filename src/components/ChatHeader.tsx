import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

interface ChatHeaderProps {
  username: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ username }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-card/80 backdrop-blur-md border border-border/30 rounded-xl shadow-xl px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-card-foreground tracking-tight">
              Real-time Chat
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-medium">
              {username}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary/50 transition-all duration-300 ease-in-out"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-card-foreground transform hover:rotate-180 transition-transform" />
              ) : (
                <Moon className="w-6 h-6 text-card-foreground transform hover:rotate-180 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};