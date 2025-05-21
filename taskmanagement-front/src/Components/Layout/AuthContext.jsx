import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
       

        const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || null;
        const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
        const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
        const isAdmin = roles.some(r => r.toLowerCase() === "admin");

        setUser({
          token,
          email,
          roles,
          isAdmin,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token on login:", decoded);

      const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || null;
      const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
      const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
      const isAdmin = roles.some(r => r.toLowerCase() === "admin");

      setUser({
        token,
        email,
        roles,
        isAdmin,
      });
    } catch (error) {
      console.error("Invalid token:", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
