import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // Можно заменить на спиннер
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBasedRoute;
