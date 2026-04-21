import React, { useState, useEffect, use } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiSettings, FiCalendar, FiHelpCircle,
  FiLogOut, FiSun, FiMoon
} from 'react-icons/fi';
import { TbBed } from "react-icons/tb";
import './Sidebar-aitusa.css';
import defaultProfile from '../../../assets/images/profile-default.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      // Set initial state based on screen size
      setIsOpen(window.innerWidth >= 1024);
    };

    // Check on mount and on resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/aitusa/dashboard', name: 'Dashboard', icon: <FiHome /> },
    { path: '/aitusa/students', name: 'Students', icon: <FiUsers /> },
    { path: '/aitusa/rooms', name: 'Rooms', icon: <TbBed /> },
    { path: '/aitusa/events', name: 'Events', icon: <FiCalendar /> },
    { path: '/aitusa/support', name: 'Student Support', icon: <FiHelpCircle /> },
    // { path: '/aitusa/settings', name: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <>
      <button 
        className={`burger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span className="burger-line"></span>
        <span className="burger-line"></span>
        <span className="burger-line"></span>
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''} ${darkMode ? 'dark' : ''}`}>
        {/* Profile Section */}
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <img 
              src={defaultProfile}
              alt="Profile" 
              className="avatar-image"
            />
          </div>
          <div className="profile-info">
            <span className="profile-name">Dormitory Staff</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                  onClick={() => !isDesktop && setIsOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-actions">
          {/* <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? (
              <>
                <FiSun className="theme-icon" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <FiMoon className="theme-icon" />
                <span>Dark Mode</span>
              </>
            )}
          </button> */}
          <button className="logout-button" onClick={() => navigate('/')}>
            <FiLogOut className="logout-icon" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Overlay - Only show on mobile when sidebar is open */}
      {!isDesktop && isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;