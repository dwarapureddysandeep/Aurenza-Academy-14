import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch from session persistent storage
    const sessionUser = authService.getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.signIn(email, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name, phone) => {
    setLoading(true);
    try {
      const registeredUser = await authService.signUp(email, password, name, phone);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, updateData);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
