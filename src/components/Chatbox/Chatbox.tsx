import React, { useEffect, useRef, useState } from 'react';
import './Chatbox.scss';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { enrichedProducts } from '../../data/enrichedProducts';
import { formatProductPrice } from '../../utils/products';

interface ChatboxProps {
  onClose: () => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ onClose }) => {
  useEscapeKey(onClose);
  const responseTimeoutRef = useRef<number>();
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        window.clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      const userInput = input.trim();
      setMessages([...messages, { text: userInput, sender: 'user' }]);
      setInput('');
      responseTimeoutRef.current = window.setTimeout(() => {
        const normalized = userInput.toLowerCase();
        const budgetMatch = normalized.match(/under\s*₹?\s*(\d+)/i);
        const budget = budgetMatch ? Number(budgetMatch[1]) : null;
        const matchedProducts = enrichedProducts.filter((product) => {
          const searchable = `${product.name} ${product.brand} ${product.category} ${product.subcategory} ${product.features?.join(' ')}`.toLowerCase();
          return normalized.split(/\s+/).some((term) => term.length > 2 && searchable.includes(term));
        });
        const budgetProducts = budget ? enrichedProducts.filter((product) => product.price <= budget).slice(0, 3) : [];
        const picks = (budgetProducts.length > 0 ? budgetProducts : matchedProducts).slice(0, 3);
        const response = picks.length > 0
          ? `I found ${picks.length} good match${picks.length > 1 ? 'es' : ''}: ${picks.map((product) => `${product.name} (${formatProductPrice(product)})`).join(', ')}. You can open a product page, wishlist it, or compare it.`
          : 'Try asking for "best phone under 80000", "compare Pixel and iPhone", or "show gaming products".';
        setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
      }, 500);
    }
  };

  return (
    <div className="chatbox-overlay">
      <div className="chatbox-modal" role="dialog" aria-modal="true" aria-labelledby="chatbox-title">
        <button className="close-btn" onClick={onClose} aria-label="Close AI assistant">&times;</button>
        <div className="chatbox-header">
          <h3 id="chatbox-title">AI Assistant</h3>
        </div>
        <div className="chatbox-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbox-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
