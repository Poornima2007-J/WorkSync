import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dayflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('dayflow_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('dayflow_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Failed to fetch user session:', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('dayflow_token', data.token);
    localStorage.setItem('dayflow_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const data = res.data;
    localStorage.setItem('dayflow_token', data.token);
    localStorage.setItem('dayflow_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
    setUser(null);
  };

  const updateUserProfile = (updatedProfile) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedProfile };
      localStorage.setItem('dayflow_user', JSON.stringify(next));
      return next;
    });
  };

  // Hackathon Quick Demo Switcher
  const quickDemoLogin = async (roleType) => {
    if (roleType === 'harshavardhan' || roleType === 'admin') {
      return login('harsha@dayflow.in', 'Password@123');
    } else if (roleType === 'lavanya') {
      return login('lavanya@dayflow.in', 'Password@123');
    } else if (roleType === 'poornima') {
      return login('poornima@dayflow.in', 'Password@123');
    } else {
      return login('manimegalai@dayflow.in', 'Password@123');
    }
  };

  const isHR = user?.role === 'HR' || user?.role === 'Admin';
  const isEmployee = user?.role === 'Employee';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        quickDemoLogin,
        isHR,
        isEmployee
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
