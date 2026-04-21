import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiEdit, FiUsers, FiSettings, FiLogOut, FiSun, FiMoon
} from 'react-icons/fi';
import { TbBed } from "react-icons/tb";
import { IoDocumentTextOutline } from "react-icons/io5";
import './Sidebar-admin.css';
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
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FiHome /> },
    { path: '/admin/application', name: 'Dorm Applications', icon: <FiEdit /> },
    { path: '/students', name: 'Students', icon: <FiUsers /> },
    { path: '/rooms', name: 'Rooms', icon: <TbBed/> },
    { path: '/admin/contracts', name: 'Contracts', icon: <IoDocumentTextOutline/> },

    // { path: '/admin/settings', name: 'Settings', icon: <FiSettings /> },
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
            <span className="profile-name">Administrator</span>
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