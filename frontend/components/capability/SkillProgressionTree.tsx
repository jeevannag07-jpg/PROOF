"use client";

import React from "react";
import { CheckCircle2, Lock, Sparkles, ChevronRight } from "lucide-react";

interface SkillNode {
  name: string;
  category: string;
  level: "Mastered" | "Proficient" | "In Progress" | "Locked";
  verifiedProjectsCount: number;
}

const TREE_DATA = [
  {
    category: "APIs & Networking",
    items: [
      { name: "RESTful Architecture", level: "Mastered", count: 12 },
      { name: "gRPC & Protocol Buffers", level: "Proficient", count: 7 },
      { name: "Zero-Allocation WebSockets", level: "Proficient", count: 4 },
      { name: "eBPF Kernel Probes", level: "In Progress", count: 2 },
    ],
  },
  {
    category: "Databases & Storage",
    items: [
      { name: "PostgreSQL & ACID Isolation", level: "Mastered", count: 14 },
      { name: "LSM-Tree Storage Engines", level: "Proficient", count: 5 },
      { name: "Consistent Hash Caching", level: "Mastered", count: 8 },
      { name: "B-Tree Page Compaction", level: "In Progress", count: 2 },
    ],
  },
  {
    category: "Distributed Systems",
    items: [
      { name: "Atomic Redis Lua Scripts", level: "Mastered", count: 9 },
      { name: "Raft / Paxos Consensus", level: "Proficient", count: 6 },
      { name: "CRDT Eventual Consistency", level: "Proficient", count: 3 },
      { name: "Fault-Tolerant Deadlock Recovery", level: "In Progress", count: 1 },
    ],
  },
];

export default function SkillProgressionTree() {
  return (
    <div className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Engineering Competency Matrix
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Verified technical progression unlocked through verified code and benchmark evidence.
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
          Tier III Senior Architect
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TREE_DATA.map((branch, idx) => (
          <div key={idx} className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider pb-1 border-b border-white/5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {branch.category}
            </h4>

            <div className="space-y-2">
              {branch.items.map((item, itemIdx) => {
                const isMastered = item.level === "Mastered";
                const isProficient = item.level === "Proficient";
                return (
                  <div
                    key={itemIdx}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isMastered
                        ? "bg-emerald-950/20 border-emerald-500/30 text-white"
                        : isProficient
                        ? "bg-[#11141c] border-white/10 text-zinc-200"
                        : "bg-[#090b0f] border-white/5 text-zinc-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {item.count} Verified Projects
                      </span>
                    </div>

                    <div className="shrink-0">
                      {isMastered ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isProficient ? (
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                          PRO
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">
                          DEV
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
