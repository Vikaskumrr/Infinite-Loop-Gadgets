import React from 'react';
import './Login.scss';

interface LoginProps {
  onClose: () => void;
  message: string;
}

const Login: React.FC<LoginProps> = ({ onClose, message }) => {
  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>Welcome</h3>
        <p>This demo uses anonymous authentication. Your cart data will be saved automatically.</p>
        <p className="login-message">{message}</p>
        <button onClick={onClose} className="continue-btn">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Login;
