"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import api, { TOKEN_STORAGE_KEY } from "./api";
import type { User } from "@/types/task";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthResponse {
  token: string;
  user: User;
}

// Non-sensitive cookie that only signals "a token exists". It never holds the
// JWT itself (that stays in localStorage) - middleware reads it to decide
// whether a route should redirect, before the page even renders.
const AUTH_COOKIE = "todo_app_auth";

function setAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        clearAuthCookie();
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      setAuthCookie();

      try {
        const res = await api.get<{ user: User }>("/auth/me");
        setUser(res.data.user);
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        clearAuthCookie();
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
    setAuthCookie();
    setToken(res.data.token);
    setUser(res.data.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/register", { email, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
    setAuthCookie();
    setToken(res.data.token);
    setUser(res.data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    clearAuthCookie();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
