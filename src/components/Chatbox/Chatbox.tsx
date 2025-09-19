import React, { useState } from 'react';
import './Chatbox.scss';

interface ChatboxProps {
  onClose: () => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Dummy AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: " Hehe 😛, I am just a dummy AI for now. I can't process your request.", sender: 'ai' }]);
      }, 1000);
    }
  };

  return (
    <div className="chatbox-overlay">
      <div className="chatbox-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="chatbox-header">
          <h3>AI Assistant</h3>
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
            onKeyPress={(e) => {
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