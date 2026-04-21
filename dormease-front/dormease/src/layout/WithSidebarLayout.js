import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/SidebarUser/Sidebar';
import './WithSidebarLayout.css';

const WithSidebarLayout = () => {
  return (
    <div className="with-sidebar-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default WithSidebarLayout;
