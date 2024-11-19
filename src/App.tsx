import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
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
  replyTo?: {
    username: string;
    text: string;
  };
}

function App() {
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<{
    id?: string;
    username: string;
    text: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const currentTypingDocRef = useRef<string | null>(null);

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

    // Listen for typing indicators
    const typingUnsubscribe = onSnapshot(collection(db, 'typing'), (snapshot) => {
      const now = Date.now();
      const activeTypers = snapshot.docs
        .filter(doc => {
          const data = doc.data();
          const timestamp = data.timestamp?.toMillis() || 0;
          return now - timestamp < 3000 && data.username !== username;
        })
        .map(doc => doc.data().username);
      
      setTypingUsers([...new Set(activeTypers)]);
    });

    return () => {
      unsubscribe();
      typingUnsubscribe();
      if (currentTypingDocRef.current) {
        deleteDoc(doc(db, 'typing', currentTypingDocRef.current)).catch(console.error);
      }
    };
  }, [isUsernameSet, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReply = (message: {
    id?: string;
    username: string;
    text: string;
  }) => {
    setReplyTo(message);
  };

  const clearReply = () => {
    setReplyTo(null);
  };

  const handleTyping = async () => {
    if (!username) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      if (currentTypingDocRef.current) {
        await deleteDoc(doc(db, 'typing', currentTypingDocRef.current));
      }

      const typingDoc = await addDoc(collection(db, 'typing'), {
        username,
        timestamp: serverTimestamp()
      });
      currentTypingDocRef.current = typingDoc.id;

      typingTimeoutRef.current = setTimeout(async () => {
        if (currentTypingDocRef.current) {
          await deleteDoc(doc(db, 'typing', currentTypingDocRef.current));
          currentTypingDocRef.current = null;
        }
      }, 3000);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username) return;

    try {
      if (currentTypingDocRef.current) {
        await deleteDoc(doc(db, 'typing', currentTypingDocRef.current));
        currentTypingDocRef.current = null;
      }

      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        username,
        timestamp: serverTimestamp(),
        isRead: false,
        replyTo: replyTo ? {
          username: replyTo.username,
          text: replyTo.text
        } : null
      });
      setNewMessage('');
      clearReply();
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
        
        <div className="flex-1 overflow-y-auto p-4 mt-24">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.username === username}
              onReply={handleReply}
            />
          ))}
          {typingUsers.length > 0 && (
            <TypingIndicator usernames={typingUsers} />
          )}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSubmit={handleSubmit}
          onTyping={handleTyping}
          replyTo={replyTo}
          clearReply={clearReply}
        />
      </div>
    </div>
  );
}

export default App;