import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "admin" | "user";

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
