"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  User,
  Key,
  CheckCircle2,
  AlertTriangle,
  Save
} from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Jeevan N.");
  const [title, setTitle] = useState(user?.title || "AI / Backend Engineer");
  const [bio, setBio] = useState(
    user?.bio || "Building high-throughput distributed systems and LLM inference pipelines."
  );
  const [githubUser, setGithubUser] = useState("jeevan-eng");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-extrabold text-white font-mono uppercase tracking-tight">
          System & Profile Settings
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Manage your demonstrated identity, GitHub integrations, and developer preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-[#0c0e14] border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            Engineering Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#12151d] border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Primary Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#12151d] border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#12151d] border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* GitHub Integration Abstraction */}
        <div className="p-6 rounded-2xl bg-[#0c0e14] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-emerald-400" />
              GitHub Integration Abstraction
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Verified Public Repos Active
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            PROOF never fakes GitHub credentials. When real OAuth is connected, private repositories can be indexed. In demo mode, PROOF uses public repository inspection and simulated sandboxes.
          </p>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Connected GitHub Handle</label>
            <input
              type="text"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              placeholder="e.g. jeevan-eng"
              className="w-full bg-[#12151d] border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 max-w-md"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && <span className="text-xs font-mono text-emerald-400">✓ Settings successfully committed</span>}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold rounded-lg transition-colors ml-auto shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE PREFERENCES</span>
          </button>
        </div>
      </form>
    </div>
  );
}
