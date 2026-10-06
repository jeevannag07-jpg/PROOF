"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Compass,
  FolderGit2,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Flame,
  Code
} from "lucide-react";
import { api } from "@/lib/api";

export default function DiscoverPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [c, p] = await Promise.all([
          api.getChallenges(),
          api.getProjects({ status: "VERIFIED" })
        ]);
        setChallenges(c);
        setProjects(p);
      } catch (err) {
        console.error("Discover load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredChallenges = challenges.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1.5">
            <Layers className="w-4 h-4" />
            ENGINEERING KNOWLEDGE GRAPH
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
            DISCOVER TECHNICAL SYSTEMS
          </h1>
          <p className="text-sm text-zinc-400 font-mono mt-1">
            Explore verified codebases, architectures, and open challenges.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search across all systems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#11131a] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Featured Missions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            Trending Technical Missions
          </h2>
          <Link href="/challenges" className="text-xs font-mono text-emerald-400 hover:underline">
            View All ({challenges.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredChallenges.slice(0, 3).map((chal) => (
            <Link
              key={chal.id}
              href={`/challenges/${chal.id}`}
              className="p-5 rounded-2xl bg-[#0d0f15] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {chal.difficulty}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">{chal.estimated_hours}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {chal.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans line-clamp-2">{chal.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>{chal.category}</span>
                <span className="text-emerald-400 flex items-center gap-1">Take Mission →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Verified Projects */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            Recently Audited Projects
          </h2>
          <Link href="/projects" className="text-xs font-mono text-cyan-400 hover:underline">
            View All ({projects.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProjects.slice(0, 3).map((proj) => (
            <Link
              key={proj.id}
              href={`/projects/${proj.id}`}
              className="p-5 rounded-2xl bg-[#0d0f15] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Work
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans line-clamp-2">{proj.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>{proj.user?.name || "Engineer"}</span>
                <span className="text-cyan-400 flex items-center gap-1">Deep Profile →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
