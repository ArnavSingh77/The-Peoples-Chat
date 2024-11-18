import React from 'react';
import { MessageSquare } from 'lucide-react';

interface LoginScreenProps {
  username: string;
  setUsername: (username: string) => void;
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ username, setUsername, onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-lg p-8 shadow-xl max-w-md w-full border border-border">
        <div className="flex items-center justify-center mb-8">
          <MessageSquare className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 text-card-foreground">Join the Chat</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};