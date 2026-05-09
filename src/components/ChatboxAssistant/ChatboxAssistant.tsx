import React, { useState } from 'react';
import Chatbox from '../Chatbox/Chatbox';
import ChatboxSvg from '../../svg/ChatboxSvg';
import './ChatboxAssistant.scss';

const ChatboxAssistant: React.FC = () => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);

  const handleToggleChatbox = () => {
    setIsChatboxOpen(prev => !prev);
  };

  return (
    <div className="chatbox-assistant-container">
      <button
        type="button"
        className="bird-icon-wrapper"
        onClick={handleToggleChatbox}
        aria-label={isChatboxOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        <ChatboxSvg />
      </button>
      {isChatboxOpen && <Chatbox onClose={handleToggleChatbox} />}
    </div>
  );
};

export default ChatboxAssistant;
