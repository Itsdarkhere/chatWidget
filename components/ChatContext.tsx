'use client';
import React, {
  createContext,
  useContext,
  useState
} from 'react';
import { useChat, type Message } from 'ai/react';
type ChatWidgetContextType = {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
};

const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

export const useChatWidget = () => {
  const context = useContext(ChatWidgetContext);
  if (!context) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  return context;
};

export function ChatWidgetProvider({ children }: { children: React.ReactNode }) {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const initialMessages: Message[] = [{id: '1', role: 'assistant', content: 'Hey how can I help you today?'}]
    const { messages, input, handleInputChange, handleSubmit } =
    useChat({
      initialMessages,
      body: {},
      onResponse(response) {
        if (response.status === 401) {
          console.error(response.statusText);
        }
      }
    })

    const openChat = () => {
        setIsChatOpen(true);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

  return (
    <ChatWidgetContext.Provider
      value={{ isChatOpen, openChat, closeChat }}
    >
      {children}
      {isChatOpen && (
        <div className="fixed flex flex-col bottom-3 right-3 w-96 max-w-[100vw] h-2/3 max-h-[100vh] z-30 text-gray-900 bg-white shadow-2xl py-3 rounded-lg border border-gray-200">
            {/* Header */}
            <div className="px-4 w-full py-2 border-b border-gray-200 mb-2 flex justify-between items-center">
                <span className="font-semibold text-lg">Chat Interface</span>
                <button onClick={closeChat}>Close</button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 px-4 overflow-y-auto mb-4">
                {messages.map((m, index) => (
                    <div key={index} className={`flex flex-col mb-2 ${m.role === 'user' ? 'text-right' : ''}`}>
                        <span className="text-sm text-gray-500">{m.role === 'user' ? 'User: ' : 'Blocktickets support: '}</span>
                        <div className={`rounded-md p-2 ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Input Field */}
            <form onSubmit={handleSubmit} className="border-t px-4 border-gray-200 pt-2">
                <input 
                    type="text" 
                    value={input} onChange={handleInputChange}
                    placeholder="Type your message..." 
                    className="w-full rounded-md p-2 border border-gray-300"
                />
                <button type='submit' className="mt-2 bg-blue-500 text-white rounded-md p-2 w-full">Send</button>
            </form>
        </div>
      )}
      {!isChatOpen && (
        <button 
          onClick={openChat}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg"
        >
          Open Chat
        </button>
      )}
    </ChatWidgetContext.Provider>
  );
}