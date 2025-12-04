import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to Spicy Biryani! I\'m here to help you with orders, menu questions, or anything else. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      return 'Hello! 👋 Thank you for contacting Spicy Biryani! How can I help you today?';
    }

    // Menu questions
    if (lowerMessage.match(/(menu|what do you serve|what.*available|items|dishes)/)) {
      return 'We serve delicious biryanis! 🍛 Our menu includes Chicken Biryani, Mutton Biryani, Veg Biryani, and more. You can browse our full menu on the website. Would you like to know about a specific dish?';
    }

    // Order tracking
    if (lowerMessage.match(/(track|order.*status|where.*order|my order)/)) {
      return 'To track your order, click on the package icon (📦) in the navigation bar and enter your order number. You\'ll get real-time updates on your order status!';
    }

    // Delivery time
    if (lowerMessage.match(/(delivery|time|how long|when|eta|estimated)/)) {
      return 'Our standard delivery time is 30-45 minutes! ⏱️ We prepare everything fresh when you order. You\'ll get updates as your order progresses.';
    }

    // Price/cost
    if (lowerMessage.match(/(price|cost|how much|rate|pricing)/)) {
      return 'Our prices are competitive and listed on the menu! 💰 Prices vary by dish - check out our menu section for detailed pricing. Most biryanis range from ₹150-350.';
    }

    // Address/location
    if (lowerMessage.match(/(address|location|where|deliver|area)/)) {
      return 'We deliver to various areas! 📍 Please enter your delivery address during checkout to see if we deliver to your location. For more details, contact us at +91 9390492316.';
    }

    // Contact information
    if (lowerMessage.match(/(contact|phone|number|call|reach|support)/)) {
      return 'You can reach us at +91 9390492316 📞. We\'re here to help with orders, inquiries, or any questions you might have!';
    }

    // Payment methods
    if (lowerMessage.match(/(payment|pay|cod|card|upi|online payment)/)) {
      return 'We accept Cash on Delivery (COD), UPI, and card payments! 💳 Choose your preferred payment method during checkout.';
    }

    // Ordering process
    if (lowerMessage.match(/(order|how.*order|place order|buy)/)) {
      return 'Ordering is easy! 🛒 Add items to your cart, click checkout, fill in your details, and confirm. You\'ll receive a confirmation with your order number for tracking!';
    }

    // Special requests
    if (lowerMessage.match(/(spicy|mild|extra|special|request|modification|customize)/)) {
      return 'We\'d love to customize your order! 🌶️ Please mention any special requests in the notes section during checkout, and we\'ll do our best to accommodate them.';
    }

    // Hours/opening
    if (lowerMessage.match(/(open|hours|timing|when.*open|close|time)/)) {
      return 'We\'re open daily! ⏰ Please contact us at +91 9390492316 for our exact operating hours and availability.';
    }

    // Complaints/issues
    if (lowerMessage.match(/(problem|issue|complaint|wrong|mistake|error|not satisfied)/)) {
      return 'I\'m sorry to hear about the issue! 😔 Please contact us immediately at +91 9390492316 and we\'ll resolve it right away. Your satisfaction is our priority!';
    }

    // Thank you
    if (lowerMessage.match(/(thank|thanks|appreciate)/)) {
      return 'You\'re very welcome! 😊 We\'re happy to help. Is there anything else you\'d like to know?';
    }

    // Default response
    return 'I understand you\'re asking about: "' + userMessage + '". Let me help! 🤔 For specific questions about orders, please contact us at +91 9390492316. For menu items, check out our menu section. How else can I assist you?';
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border-2 border-red-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">Spicy Biryani Support</h3>
            <p className="text-xs text-red-100">We're online</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'bot'
                  ? 'bg-red-600 text-white'
                  : 'bg-orange-500 text-white'
              }`}
            >
              {message.sender === 'bot' ? (
                <Bot className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.sender === 'bot'
                  ? 'bg-white text-gray-800 border border-gray-200'
                  : 'bg-red-600 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Quick responses available
        </p>
      </div>
    </div>
  );
}


