"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface AuthUser {
  name: string;
  role: "admin" | "user";
}

const AuthContext = createContext<AuthUser>({ name: "", role: "user" });

export function AuthProvider({ children, user }: { children: ReactNode; user: AuthUser }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
