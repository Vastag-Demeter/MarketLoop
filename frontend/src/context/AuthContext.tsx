"use client";
import api from "../axios";
import { User } from "../interfaces/user";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";

interface SystemConfig {
  permissions: Record<string, string>;
  roles: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  config: SystemConfig | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isHelpDesk: boolean;
  isWorker: boolean;
  isCustomer: boolean;
  hasPermission: (persmission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user_public");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("user_public");
      }
    }

    const fetchConfig = async () => {
      try {
        const response = await api.get("/api/config");
        setConfig(response.data.data);
      } catch (error) {
        console.error("Failed to load system config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user_public", JSON.stringify(userData));
    Cookies.set("user_public", JSON.stringify(userData), {
      expires: 7,
      path: "/",
    });
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user_public");
    localStorage.clear();
    Cookies.remove("user_public");
    Cookies.remove("cart_session_id");

    try {
      await api.post("/api/logout");
    } catch (error) {
      console.error("Server-side logout failed:", error);
    } finally {
      window.location.href = "/";
    }
  };
  const isCustomer =
    user?.roles?.some(
      (role: any) =>
        role.key === config?.roles.CUSTOMER || role === config?.roles.CUSTOMER,
    ) || false;
  const isWorker =
    user?.roles?.some(
      (role: any) =>
        role.key === config?.roles.WORKER || role === config?.roles.WORKER,
    ) || false;
  const isHelpDesk =
    user?.roles?.some(
      (role: any) =>
        role.key === config?.roles.HELPDESK || role === config?.roles.HELPDESK,
    ) || false;
  const isAdmin =
    user?.roles?.some(
      (role: any) =>
        role.key === config?.roles.ADMIN || role === config?.roles.ADMIN,
    ) || false;
  const isSuperAdmin =
    user?.roles?.some(
      (role: any) =>
        role.key === config?.roles.SUPERADMIN ||
        role === config?.roles.SUPERADMIN,
    ) || false;
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    if (!user?.permissions) return false;
    return requiredPermissions.some((p) => user.permissions.includes(p));
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        config,
        login,
        logout,
        isLoading,
        isCustomer,
        isWorker,
        isHelpDesk,
        isAdmin,
        isSuperAdmin,
        hasAnyPermission,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
