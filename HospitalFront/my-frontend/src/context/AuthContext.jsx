import { createContext, useContext, useState } from "react";

// Auth context to store user login state
const AuthContext = createContext(null);

// Auth provider wraps the app and provides auth data
export const AuthProvider = ({ children }) => {
  // Initialize auth state from localStorage
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  // Save token and user data on login
  const login = (token, user) => {
    const authData = { token, user };
    localStorage.setItem("auth", JSON.stringify(authData));
    setAuth(authData);
  };

  // Clear auth data on logout
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context safely
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
