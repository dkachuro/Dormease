import React, { createContext, useState, useEffect } from 'react';
import { axiosInstance, endpoints } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // здесь будет объект с ролью и остальными данными
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(endpoints.USER_PROFILE_LIST);
        setUser(res.data.user); // предполагается, что роль хранится в user.role
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
