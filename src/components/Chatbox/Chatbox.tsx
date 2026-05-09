import React, { useEffect, useRef, useState } from 'react';
import './Chatbox.scss';
import { useEscapeKey } from '../../hooks/useEscapeKey';

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
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Dummy AI response
      responseTimeoutRef.current = window.setTimeout(() => {
        setMessages(prev => [...prev, { text: " Hehe 😛, I am just a dummy AI for now. I can't process your request.", sender: 'ai' }]);
      }, 1000);
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
