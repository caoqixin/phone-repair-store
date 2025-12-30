import { useState, useEffect } from "react";
import {
  clearTokens,
  getCurrentUser,
  isAuthenticated,
  login,
  logout,
} from "../services/auth.service";

export function useAuth() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const result = await getCurrentUser();
        if (result.success && result.data) {
          setUser(result.data.user);
          setIsAuth(true);
        } else {
          setIsAuth(false);
          clearTokens();
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success && result.data) {
        setUser(result.data.user);
        setIsAuth(true);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated: isAuth,
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
  };
}
