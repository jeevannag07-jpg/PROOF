"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, User, Mail, Lock, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUILDER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register({
        name,
        username,
        email,
        password,
        role,
        bio: `Software Engineer on PROOF focused on verifiable capability.`,
      });
      // Automatically log in
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0e14] border border-white/10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-lg flex items-center justify-center mx-auto">
            P
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">
            CREATE PROOF ACCOUNT
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Build, document, verify, and review engineering capabilities.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Jeevan N."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#12151d] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Username</label>
            <input
              type="text"
              required
              placeholder="e.g. jeevan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#12151d] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="engineer@proof.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#12151d] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#12151d] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Primary Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#12151d] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="BUILDER">Builder / Developer</option>
              <option value="REVIEWER">Reviewer / Staff Expert</option>
              <option value="RECRUITER">Recruiter / Hiring Team</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            {loading ? "CREATING PROFILE..." : "CREATE ACCOUNT →"}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-zinc-500 pt-2">
          Already registered?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
