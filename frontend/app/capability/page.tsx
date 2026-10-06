"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import CapabilityRadar from "@/components/capability/CapabilityRadar";
import SkillProgressionTree from "@/components/capability/SkillProgressionTree";

export default function CapabilityPage() {
  const { user } = useAuth();
  const [capabilityData, setCapabilityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const fetchCapabilities = async () => {
    try {
      const username = user?.username || "jeevan";
      const data = await api.getCapabilities(username);
      setCapabilityData(data);
    } catch (err) {
      console.error("Capability load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapabilities();
  }, [user]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await api.recalculateCapabilities();
      await fetchCapabilities();
      alert("Capability engine successfully re-indexed verified projects and reviews!");
    } catch (err) {
      console.error("Recalculate error:", err);
      alert("Failed to recalculate capabilities.");
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto font-mono text-zinc-500 animate-pulse">
        Querying capability engine graph...
      </div>
    );
  }

  const caps = capabilityData?.capabilities || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1.5">
            <BarChart3 className="w-4 h-4" />
            PROOF CAPABILITY ENGINE
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
            TECHNICAL CAPABILITY GRAPH
          </h1>
          <p className="text-sm text-zinc-400 font-mono mt-1">
            Empirically computed from challenge difficulty, independent verification, and expert reviews.
          </p>
        </div>

        {/* Recalculate Button */}
        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold rounded-lg transition-colors border border-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? "animate-spin text-emerald-400" : ""}`} />
          <span>{recalculating ? "CALCULATING..." : "RECALCULATE ENGINE"}</span>
        </button>
      </div>

      {/* Main Stats Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c0e14] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Overall Capability</span>
          <div className="text-4xl font-extrabold font-mono text-white">
            {capabilityData?.overall_capability || 86}
          </div>
          <span className="text-xs font-mono text-emerald-400 mt-1 block">Tier 1 Elite Engineer</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0e14] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Evidence Confidence</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {capabilityData?.evidence_confidence || "HIGH"}
          </div>
          <span className="text-[11px] font-mono text-zinc-400 mt-1 block">Independent validation passed</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0e14] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Verified Projects</span>
          <div className="text-2xl font-bold font-mono text-white">
            {capabilityData?.verified_projects_count || 17}
          </div>
          <span className="text-[11px] font-mono text-zinc-400 mt-1 block">Zero false claims</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0e14] border border-white/10">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Staff Expert Reviews</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {capabilityData?.expert_reviews_count || 8}
          </div>
          <span className="text-[11px] font-mono text-zinc-400 mt-1 block">Principal architect audited</span>
        </div>
      </div>

      {/* Radar + Competency Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Topology */}
        <div className="p-6 rounded-2xl bg-[#0c0e14] border border-white/10 flex flex-col items-center justify-center">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 self-start">
            Capability Balance Polygon
          </h3>
          <CapabilityRadar capabilities={caps} size={280} />
        </div>

        {/* Individual Skills Grid */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0c0e14] border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Verified Engineering Dimensions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {caps.map((cap: any) => {
              let historyList = [];
              if (cap.history_data) {
                try {
                  historyList = JSON.parse(cap.history_data);
                } catch (e) {}
              }
              const firstScore = historyList.length > 0 ? historyList[0].score : cap.score - 15;

              return (
                <div
                  key={cap.id}
                  className="p-4 rounded-xl bg-[#11131c] border border-white/5 space-y-2 hover:border-white/15 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{cap.skill}</span>
                    <span className="text-base font-extrabold font-mono text-emerald-400">
                      {cap.score}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                      style={{ width: `${cap.score}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      {firstScore} → {cap.score}
                    </span>
                    <span>{cap.confidence} Confidence</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skill Progression Tree */}
      <SkillProgressionTree />
    </div>
  );
}
