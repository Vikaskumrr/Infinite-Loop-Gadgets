import React from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import './Login.scss';

interface LoginProps {
  onClose: () => void;
  message: string;
}

const Login: React.FC<LoginProps> = ({ onClose, message }) => {
  useEscapeKey(onClose);

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close welcome dialog">
          &times;
        </button>
        <h3 id="login-title">Welcome</h3>
        <p>This app uses a local anonymous profile. Your cart, profile, and demo orders are saved in this browser only.</p>
        <p className="login-message">{message}</p>
        <button onClick={onClose} className="continue-btn">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Login;
