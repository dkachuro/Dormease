import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-contact">
          <div className="contact-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              className="contact-icon"
            >
              <path d="M4 4h16v16H4z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>aitu@astanait.edu.kz</span>
          </div>

          <div className="contact-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="contact-icon"
            >
              <path d="M8 0C5.243 0 3 2.243 3 5c0 3.86 5 11 5 11s5-7.14 5-11c0-2.757-2.243-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
            <span>Mangilik el, C1, Astana IT University</span>
          </div>

          <div className="contact-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="contact-icon"
            >
              <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.298c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 007.168 7.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-1.745.698a12.273 12.273 0 01-2.516-2.516l.697-1.745a.678.678 0 00-.122-.58L3.654 1.328z"/>
            </svg>
            <span>+7 777 777 77 77</span>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© 2024 ATU Dormitory Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;