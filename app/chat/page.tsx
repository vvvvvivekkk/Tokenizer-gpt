'use client';

import { useState } from 'react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface TokenCount {
  role: string;
  content: string;
  tokens: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [tokenCounts, setTokenCounts] = useState<TokenCount[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);

  const handleAddMessage = async (role: 'user' | 'assistant') => {
    if (!newMessage.trim()) return;

    const updatedMessages = [...messages, { role, content: newMessage }];
    setMessages(updatedMessages);

    // Calculate tokens
    const response = await fetch('/api/tokenize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newMessage }),
    });

    if (response.ok) {
      const data = await response.json();
      const newCount: TokenCount = {
        role,
        content: newMessage,
        tokens: data.tokenCount,
      };

      setTokenCounts([...tokenCounts, newCount]);
      setTotalTokens(totalTokens + data.tokenCount);
    }

    setNewMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat Tokenizer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="font-semibold capitalize text-sm text-gray-600 dark:text-gray-400">
                  {msg.role}
                </div>
                <p className="text-gray-800 dark:text-gray-200">{msg.content}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleAddMessage('user')}
                disabled={!newMessage.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
              >
                Add User Message
              </button>
              <button
                onClick={() => handleAddMessage('assistant')}
                disabled={!newMessage.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
              >
                Add Assistant Message
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Token Count</h2>
            <div className="space-y-3">
              {tokenCounts.map((count, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm capitalize">{count.role}</span>
                  <span className="font-semibold">{count.tokens}</span>
                </div>
              ))}
              <div className="pt-2 border-t-2 border-gray-300 dark:border-gray-600 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-lg font-bold text-blue-600">{totalTokens}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
