import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function GetSetWebChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Get Set Web AI assistant. How can I help you with your Instagram analytics today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. I\'m analyzing your Instagram metrics and will provide insights shortly. Is there anything specific you\'d like to know about your reach, engagement, or growth?',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#D4AF37] hover:bg-[#F5E6C5] text-[#0A0A0A] p-4 rounded-full shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-[#0F0F0F]/95 backdrop-blur-sm border border-[#2C2C2C] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-80 h-14' : 'w-80 h-96'
      }`}>
        {/* Header */}
        <div className="bg-[#0F0F0F]/90 border-b border-[#2C2C2C] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-sm font-['Cinzel']">G</span>
            </div>
            <div>
              <h3 className="text-[#EAEAEA] font-['Cinzel'] text-sm font-medium">Get Set Web AI</h3>
              <p className="text-[#EAEAEA]/60 text-xs font-['Inter']">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[#EAEAEA]/60 hover:text-[#EAEAEA] transition-colors p-1"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#EAEAEA]/60 hover:text-[#EAEAEA] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-64">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 font-['Inter'] text-sm ${
                      message.isUser
                        ? 'bg-[#D4AF37] text-[#0A0A0A] rounded-br-md'
                        : 'bg-[#2C2C2C] text-[#EAEAEA] rounded-bl-md'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#2C2C2C] p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your Instagram metrics..."
                  className="flex-1 bg-[#2C2C2C] border border-[#404040] rounded-full px-4 py-2 text-[#EAEAEA] placeholder-[#EAEAEA]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 font-['Inter'] text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-[#D4AF37] hover:bg-[#F5E6C5] disabled:bg-[#404040] disabled:cursor-not-allowed text-[#0A0A0A] p-2 rounded-full transition-colors duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}