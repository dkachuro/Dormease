import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiUser, FiEdit, FiCalendar, FiCreditCard, 
  FiHelpCircle, FiLogOut, FiSun, FiMoon 
} from 'react-icons/fi';
import { TbBed } from "react-icons/tb";
import { IoDocumentTextOutline } from "react-icons/io5";
import './Sidebar.css';
import defaultProfile from '../../../assets/images/profile-default.png';
import { api } from '../../../services/api';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [user, setUser] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsOpen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getUserSelf();
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    };

    fetchUser();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/student', name: 'Profile', icon: <FiUser /> },
    { path: '/application', name: 'Dorm Application', icon: <FiEdit /> },
    { path: '/room-selection', name: 'Room Selection', icon: <TbBed /> },
    { path: '/events', name: 'Events', icon: <FiCalendar /> },
    { path: '/payments', name: 'Payments', icon: <FiCreditCard /> },
    { path: '/support', name: 'Student Support', icon: <FiHelpCircle /> },
    { path: '/signed', name: 'Signed Document', icon: <IoDocumentTextOutline /> },

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
            <span className="profile-name">
              {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
            </span>
            {/* <span className="profile-role">{user?.role || 'Student'}</span> */}
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
          <button className="logout-button" onClick={() => navigate('/login')}>
            <FiLogOut className="logout-icon" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

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