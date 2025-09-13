// Footer.tsx
import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h4>About Us</h4>
          <p>
            We are a leading provider of high-quality tech products. Our mission is to
            bring the latest innovations to your doorstep.
          </p>
        </div>
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-2v-3.493c0-.94.043-1.879-1.144-1.879-1.143 0-1.233 1.099-1.233 2.193v3.179h-2v-6h2v1.173c.78-1.353 2.115-1.825 2.87-1.825 1.581 0 2.13 1.24 2.13 3.868v2.784z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14.868 2c-2.316 0-2.58.01-3.483.051-2.222.102-3.763.53-4.993 1.637-1.233 1.107-1.658 2.622-1.764 4.881-.041.903-.052 1.168-.052 3.483s.011 2.58.052 3.483c.106 2.259.531 3.774 1.764 4.881 1.23 1.107 2.771 1.535 4.993 1.637.903.041 1.168.051 3.483.051s2.58-.01 3.483-.051c2.222-.102 3.763-.53 4.993-1.637 1.233-1.107 1.658-2.622 1.764-4.881.041-.903.052-1.168.052-3.483s-.011-2.58-.052-3.483c-.106-2.259-.531-3.774-1.764-4.881-1.23-1.107-2.771-1.535-4.993-1.637-.903-.041-1.168-.051-3.483-.051zm-10.868 12c.007 2.255.437 3.256 1.487 4.195 1.056.938 2.054 1.353 4.195 1.487 1.165.074 1.22.079 3.251.079 2.031 0 2.086-.005 3.251-.079 2.141-.134 3.139-.549 4.195-1.487 1.05-1.111 1.48-2.113 1.487-4.195.074-1.165.079-1.22.079-3.251s-.005-2.086-.079-3.251c-.134-2.141-.549-3.139-1.487-4.195-1.111-1.05-2.113-1.48-4.195-1.487-1.165-.074-1.22-.079-3.251-.079-2.031 0-2.086.005-3.251.079-2.141.134-3.139.549-4.195 1.487-1.05 1.111-1.48 2.113-1.487 4.195-.074 1.165-.079 1.22-.079 3.251s.005 2.086.079 3.251z"/><circle cx="12" cy="12" r="3"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.304 16.965l-4.304-2.482-4.304 2.482c-.881.508-1.97-.246-1.97-1.298v-4.37c0-1.052 1.089-1.806 1.97-1.298l4.304 2.482 4.304-2.482c.881-.508 1.97.246 1.97 1.298v4.37c0 1.052-1.089 1.806-1.97 1.298z"/></svg>
            </a>

          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} InfiniteLoopGadgets. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;