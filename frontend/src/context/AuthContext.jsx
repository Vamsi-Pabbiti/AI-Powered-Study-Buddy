import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    if (token && name) setUser({ name });
  }, [token]);

  const login = (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user_name", data.user_name);
    setToken(data.access_token);
    setUser({ name: data.user_name });
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);