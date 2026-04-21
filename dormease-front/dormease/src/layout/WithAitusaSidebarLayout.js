import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/SidebarAitusa/Sidebar-aitusa';
import './WithSidebarLayout.css';

const WithAitusaSidebarLayout = () => {
  return (
    <div className="with-sidebar-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default WithAitusaSidebarLayout;
