import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";  // note default import

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read raw query string (no router needed)
    const params = new URLSearchParams(window.location.search);

    // 1) Skip-login flow: ?skipLogin=true&testToken=...
    if (params.get("skipLogin") === "true") {
      const token = params.get("testToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const email = decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ] || null;
          const roleClaim = decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || [];
          const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
          const isAdmin = roles.some((r) => r.toLowerCase() === "admin");

          // Persist token and set user state
          localStorage.setItem("token", token);
          setUser({ token, email, roles, isAdmin });
        } catch (err) {
          console.error("Invalid testToken provided:", err);
        }
      }
      return; // skip normal auth loading
    }

    // 2) Normal load from localStorage
    const stored = localStorage.getItem("token");
    if (stored) {
      try {
        const decoded = jwtDecode(stored);
        const email = decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] || null;
        const roleClaim = decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || [];
        const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
        const isAdmin = roles.some((r) => r.toLowerCase() === "admin");

        setUser({ token: stored, email, roles, isAdmin });
      } catch (err) {
        console.error("Invalid token in localStorage:", err);
        setUser(null);
      }
    }
  }, []); // run once on mount

  // Standard login function (stores token & updates state)
  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      const email = decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] || null;
      const roleClaim = decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] || [];
      const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
      const isAdmin = roles.some((r) => r.toLowerCase() === "admin");

      setUser({ token, email, roles, isAdmin });
    } catch (err) {
      console.error("Invalid token on login:", err);
      setUser(null);
    }
  };

  // Standard logout
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
