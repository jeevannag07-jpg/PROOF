"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";

export interface CurrentUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: "BUILDER" | "REVIEWER" | "RECRUITER" | "ADMIN";
  avatar_url?: string;
  title?: string;
  bio?: string;
  overall_capability?: number;
  evidence_confidence?: string;
  verified_projects_count?: number;
  expert_reviews_count?: number;
  deployments_count?: number;
}

interface AuthContextType {
  user: CurrentUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchRolePersona: (username: "jeevan" | "alex_t" | "rachel_a") => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  switchRolePersona: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (targetUsername = "jeevan") => {
    try {
      const data = await api.getUser(targetUsername);
      setUser(data);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      // Fallback default demo user
      setUser({
        id: 1,
        name: "Jeevan N.",
        username: "jeevan",
        email: "jeevan@proof.dev",
        role: "BUILDER",
        title: "AI / Backend Engineer",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        overall_capability: 86,
        evidence_confidence: "HIGH",
        verified_projects_count: 17,
        expert_reviews_count: 8,
        deployments_count: 3
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("proof_active_username") || "jeevan";
    fetchProfile(savedUser);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password: pass });
      localStorage.setItem("proof_token", res.access_token);
      localStorage.setItem("proof_active_username", res.user.username);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("proof_token");
    localStorage.removeItem("proof_active_username");
    setUser(null);
  };

  const switchRolePersona = async (username: "jeevan" | "alex_t" | "rachel_a") => {
    setLoading(true);
    try {
      localStorage.setItem("proof_active_username", username);
      await fetchProfile(username);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRolePersona }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
