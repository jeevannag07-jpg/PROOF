"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRolePersona } = useAuth();
  const [email, setEmail] = useState("jeevan@proof.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = async (username: "jeevan" | "alex_t" | "rachel_a") => {
    await switchRolePersona(username);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0e14] border border-white/10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-lg flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            P
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">
            SIGN IN TO PROOF
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Access your demonstrated capability profile.
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
            <label className="block text-xs font-mono text-zinc-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#12151d] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#12151d] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN →"}
          </button>
        </form>

        {/* Quick Demo Logins for instant evaluation */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block text-center">
            One-Click Instant Persona Sign-in:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickPersona("jeevan")}
              className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/40 text-[11px] font-mono transition-colors"
            >
              Jeevan (Builder)
            </button>
            <button
              onClick={() => handleQuickPersona("alex_t")}
              className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/40 text-[11px] font-mono transition-colors"
            >
              Alex (Reviewer)
            </button>
            <button
              onClick={() => handleQuickPersona("rachel_a")}
              className="p-2 rounded-lg bg-purple-950/20 border border-purple-500/20 text-purple-400 hover:bg-purple-950/40 text-[11px] font-mono transition-colors"
            >
              Rachel (Recruiter)
            </button>
          </div>
        </div>

        <p className="text-center text-xs font-mono text-zinc-500 pt-2">
          Don't have an account?{" "}
          <Link href="/register" className="text-emerald-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
