import React from 'react';
import { useNavigate } from 'react-router-dom';

import './HeroSection.css';

function HeroSection() {
  const navigate = useNavigate()
  return (
    <section className="hero" id='about'>
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Smart Dormitory Management – 
            <span className="highlight">Fast</span> 
            Check-in and Seamless Experience
          </h1>
          
          <p>
            Experience a modern approach to dormitory living with our 
            automated system designed for AITU students.
          </p>
          
          <div className="buttons-container">
            <button className="get-started-btn" onClick={() => navigate('/login')}>Get Started</button>
          </div>
        </div>
        
        <div className="hero-image-container">
          <div className="image-wrapper">
            <img 
              src="/images/aitu-dormitory.jpg" 
              alt="Modern Dormitory Building" 
              className="hero-image" 
            />
            <div className="image-overlay"></div>
          </div>
          
          {/* Бейджи с анимацией */}
          <div className="badge top-right">
            {/* <span className="status-dot"></span> */}
            24/7 Support
          </div>
          
          <div className="badge bottom-left">
            {/* <span className="status-dot"></span> */}
            Quick Check-in
          </div>
          
          {/* Декоративные элементы */}
          <div className="decoration circle1"></div>
          <div className="decoration circle2"></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;