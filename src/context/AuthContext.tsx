import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: 'citizen' | 'staff' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: 'citizen' | 'staff' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted user
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (role: 'citizen' | 'staff' | 'admin') => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: role === 'admin' ? 'Administrator' : role === 'staff' ? 'Staff Member' : 'Citizen',
      role,
      email: `${role}@grampanchayat.local`,
      phone: '+91-XXXXXXXXXX',
      village: 'Sample Village',
    };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      userRole: user?.role || null,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

