import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const processToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      
      // --- DEBUGGING LOG ---
      console.log("Token Decoded from Backend:", decoded); 
      // ---------------------

      // Handle cases where role might be missing or named differently
      const userRole = decoded.role || decoded.authorities?.[0]?.authority || "UNKNOWN";

      setUser({ 
        sub: decoded.sub, 
        role: userRole,
        name: decoded.name // <--- ADDED: Capture Name from Token
      }); 
    } catch (e) {
      console.error("Invalid Token:", e);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) processToken(token);
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    processToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};