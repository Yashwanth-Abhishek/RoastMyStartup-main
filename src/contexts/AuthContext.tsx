import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, User } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isValid = await authService.verifyToken();
        if (isValid) {
          setUser(authService.getUser());
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const isValid = await authService.verifyToken();
      if (isValid) {
        setUser(authService.getUser());
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("User refresh error:", error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}