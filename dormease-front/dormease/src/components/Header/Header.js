import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Header.css';


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">DormEase</div>
      </div>
      
      <button className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className={`header-center ${isMenuOpen ? 'active' : ''}`}>
        <nav className="nav-links">
          <a href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</a>
          <a href="#feature" onClick={() => setIsMenuOpen(false)}>Feature</a>
          <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
        </nav>
      </div>
      
      <div className={`header-right ${isMenuOpen ? 'active' : ''}`}>
        <button className="login-button" onClick={() => navigate('/login')}>Login</button>
      </div>
    </header>
  );
}

export default Header;