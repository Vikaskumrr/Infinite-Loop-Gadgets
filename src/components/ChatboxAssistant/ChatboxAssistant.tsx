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
      <div className="bird-icon-wrapper" onClick={handleToggleChatbox}>
        <ChatboxSvg />
      </div>
      {isChatboxOpen && <Chatbox onClose={handleToggleChatbox} />}
    </div>
  );
};

export default ChatboxAssistant;