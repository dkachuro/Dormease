import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/SidebarAdmin/Sidebar-admin';
import './WithSidebarLayout.css';

const WithAdminSidebarLayout = () => {
  return (
    <div className="with-sidebar-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default WithAdminSidebarLayout;
