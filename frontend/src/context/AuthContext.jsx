import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);
      } catch (error) {
        if (refreshToken) {
          try {
            const refreshResponse = await api.post("/refresh", { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            
            const userResponse = await api.get("/auth/me");
            setUser(userResponse.data.user);
          } catch (refreshError) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            setUser(null);
          }
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setUser(user);

    return user;
  };

  const register = async (name, email, password) => {
    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setUser(user);

    return user;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await api.post("/auth/logout");
      }
    } catch (error) {
      // Ignore logout errors
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}