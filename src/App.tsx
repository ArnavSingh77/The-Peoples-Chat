import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { ChatMessage } from './components/ChatMessage';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatHeader } from './components/ChatHeader';
import { LoginScreen } from './components/LoginScreen';
import { MessageInput } from './components/MessageInput';

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: { seconds: number };
  isRead: boolean;
}

function App() {
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isUsernameSet) return;

    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
      
      snapshot.docs.forEach(doc => {
        if (doc.data().username !== username && !doc.data().isRead) {
          updateDoc(doc.ref, { isRead: true });
        }
      });
    });

    return () => unsubscribe();
  }, [isUsernameSet, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = async () => {
    if (!username) return;
    
    const typingRef = doc(db, 'typing', username);
    await addDoc(collection(db, 'typing'), { 
      username, 
      timestamp: serverTimestamp() 
    }).catch(console.error);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(async () => {
      try {
        await updateDoc(typingRef, { typing: false });
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        username,
        timestamp: serverTimestamp(),
        isRead: false
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isUsernameSet) {
    return (
      <LoginScreen
        username={username}
        setUsername={setUsername}
        onLogin={() => setIsUsernameSet(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <ChatHeader username={username} />

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.username === username}
            />
          ))}
          {typingUsers.map(user => (
            user !== username && <TypingIndicator key={user} username={user} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSubmit={handleSubmit}
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
}

export default App;