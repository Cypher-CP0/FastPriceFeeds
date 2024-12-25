import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAccount } from 'wagmi';
import { ChatMessage } from '../types/crypto';
import { Send, ChevronRight, ChevronLeft } from 'lucide-react';

export const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        address,
        message: newMessage.trim(),
        timestamp: Date.now()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={`fixed right-0 top-20 bottom-0 bg-dark-surface border-l border-dark-border transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-96'
    }`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-dark-surface p-2 rounded-l-lg border-l border-t border-b border-dark-border"
      >
        {isCollapsed ? <ChevronLeft size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
      </button>

      {!isCollapsed && (
        <div className="h-full flex flex-col p-4">
          <h2 className="text-xl font-bold mb-4 text-white">Chat Room</h2>
          
          {!isConnected ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-center">
                Please connect your wallet to participate in the chat.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.address === address ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.address === address
                          ? 'bg-blue-600 text-white'
                          : 'bg-dark-bg text-white'
                      }`}
                    >
                      <p className="text-xs opacity-75 mb-1">
                        {msg.address.slice(0, 6)}...{msg.address.slice(-4)}
                      </p>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 rounded-lg bg-dark-bg border border-dark-border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};