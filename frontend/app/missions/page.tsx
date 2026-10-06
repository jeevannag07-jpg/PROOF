"use client";

import React, { useState, useEffect } from "react";
import {
  EditorialContainer,
  EditorialDivider,
  TechnicalRow,
  MetadataLine,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";
import { Search } from "lucide-react";

const DOMAINS = [
  "ALL",
  "AI & Automation",
  "Healthcare",
  "Education",
  "Agriculture",
  "Finance & Small Business",
  "Climate & Sustainability",
  "Mobility & Smart Cities",
  "Industry & Manufacturing",
  "Cybersecurity & Digital Safety",
  "Community & Accessibility",
];

const DIFFICULTIES = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function MissionsPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeDomain, setActiveDomain] = useState("ALL");
  const [activeDifficulty, setActiveDifficulty] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const data = await api.getChallenges({
        domain: activeDomain === "ALL" ? undefined : activeDomain,
        difficulty: activeDifficulty === "ALL" ? undefined : activeDifficulty,
        search: searchTerm.trim() || undefined,
        challenge_type: "MISSION",
      });
      setChallenges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading missions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [activeDomain, activeDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchChallenges();
  };

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Masthead */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-widest">
            <span>ENGINEERING ARCHIVE</span>
            <span>SYSTEM SPECIFICATIONS // OPEN CALLS</span>
            <span>{challenges.length} MISSIONS CATALOGUED</span>
          </div>

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              TECHNICAL MISSIONS
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#5F625F] leading-relaxed">
              Real-world engineering problems with verifiable constraints. Solve, document architectural decisions,
              and prove your capability through automated evaluation and peer review.
            </p>
          </div>
        </header>

        {/* Filter and Search Bar */}
        <div className="space-y-6 mb-12">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5F625F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search missions, protocols, tools (e.g. Raft, eBPF, PyTorch)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#D9DAD6] px-9 py-2.5 text-xs sm:text-sm text-[#111111] placeholder-[#5F625F] font-mono focus:outline-none focus:border-[#111111] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#333333] transition-colors"
            >
              FILTER
            </button>
          </form>

          {/* Domain Tabs */}
          <div className="border-t border-b border-[#D9DAD6] py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
              <span className="text-[#5F625F] uppercase mr-2 shrink-0">DOMAIN:</span>
              {DOMAINS.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setActiveDomain(domain)}
                  className={`px-2.5 py-1 whitespace-nowrap uppercase tracking-wider transition-colors ${
                    activeDomain === domain
                      ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                      : "text-[#5F625F] hover:text-[#111111]"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#5F625F] uppercase mr-2">DIFFICULTY:</span>
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                  activeDifficulty === diff
                    ? "border border-[#111111] text-[#111111] font-semibold"
                    : "text-[#5F625F] hover:text-[#111111]"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Rows Archive */}
        <div className="border-t border-[#D9DAD6]">
          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-[#5F625F] animate-pulse">
              RETRIEVING SPECIFICATION ARCHIVE...
            </div>
          ) : challenges.length === 0 ? (
            <div className="py-16 text-center font-mono text-sm text-[#5F625F]">
              <p>NO MISSIONS MATCH SPECIFIED CRITERIA.</p>
              <button
                onClick={() => {
                  setActiveDomain("ALL");
                  setActiveDifficulty("ALL");
                  setSearchTerm("");
                }}
                className="mt-4 text-xs underline text-[#111111] hover:text-[#5F625F]"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {challenges.map((c) => (
                <TechnicalRow
                  key={c.id}
                  index={c.id}
                  title={c.title}
                  subtitle={c.problem_statement || c.description}
                  tags={[
                    c.domain || c.category || "SYSTEMS",
                    c.difficulty || "INTERMEDIATE",
                    c.estimated_time || c.estimated_hours || "4–6H",
                    ...(c.skills_required || c.skills || "")
                      .split(",")
                      .filter(Boolean)
                      .slice(0, 2),
                  ]}
                  status={{
                    label: c.difficulty || "OPEN",
                    variant:
                      c.difficulty === "ADVANCED"
                        ? "xp"
                        : c.difficulty === "INTERMEDIATE"
                        ? "capability"
                        : "verified",
                  }}
                  actionLabel="OPEN BRIEF"
                  href={`/missions/${c.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </EditorialContainer>
    </div>
  );
}
