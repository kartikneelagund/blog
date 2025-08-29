// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // full user object from backend

  // Load user on app start if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
      });
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);

    // Fetch full user info from backend
    api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Login fetch failed:", err));
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

export const useAuth = () => useContext(AuthContext);
