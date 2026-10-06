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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeSkill, setActiveSkill] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const skills = ["ALL", "Backend", "System Design", "Python", "AI/ML", "Databases", "DevOps"];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects({
        skill: activeSkill === "ALL" ? undefined : activeSkill,
        search: search.trim() || undefined,
        status: "VERIFIED",
      });
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeSkill]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Masthead */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-widest">
            <span>TECHNICAL DOSSIERS</span>
            <span>VERIFIED CASE STUDY ARCHIVE</span>
            <span>{projects.length} PROOFS CATALOGUED</span>
          </div>

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              VERIFIED ENGINEERING PROOF
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#5F625F] leading-relaxed">
              In-depth architectural case studies, chaos engineering logs, and defended implementations
              verified by senior engineering reviewers.
            </p>
          </div>
        </header>

        {/* Filter and Search Bar */}
        <div className="space-y-6 mb-12">
          <form onSubmit={handleSearchSubmit} className="flex gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5F625F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search verified case studies by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#D9DAD6] px-9 py-2.5 text-xs sm:text-sm text-[#111111] placeholder-[#5F625F] font-mono focus:outline-none focus:border-[#111111]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#333333] transition-colors"
            >
              SEARCH
            </button>
          </form>

          {/* Skill Tabs */}
          <div className="border-t border-b border-[#D9DAD6] py-3 flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <span className="text-[#5F625F] uppercase mr-2 shrink-0">COMPETENCY:</span>
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => setActiveSkill(skill)}
                className={`px-2.5 py-1 whitespace-nowrap uppercase tracking-wider transition-colors ${
                  activeSkill === skill
                    ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                    : "text-[#5F625F] hover:text-[#111111]"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Rows Listing */}
        <div className="border-t border-[#D9DAD6]">
          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-[#5F625F] animate-pulse">
              RETRIEVING VERIFIED PROOF ARCHIVE...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center font-mono text-sm text-[#5F625F]">
              <p>NO VERIFIED PROJECTS MATCH CURRENT FILTER.</p>
              <button
                onClick={() => {
                  setActiveSkill("ALL");
                  setSearch("");
                }}
                className="mt-4 text-xs underline text-[#111111] hover:text-[#5F625F]"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {projects.map((p) => (
                <TechnicalRow
                  key={p.id}
                  index={p.id}
                  title={p.title}
                  subtitle={p.description}
                  tags={[
                    p.skill || "SYSTEMS",
                    p.user?.name ? `BY @${p.user.username || p.user.name}` : "BUILDER",
                    p.repository_url ? "OPEN SOURCE" : "INTERNAL REPO",
                  ]}
                  status={{
                    label: "VERIFIED",
                    variant: "verified",
                  }}
                  actionLabel="VIEW PROOF"
                  href={`/projects/${p.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </EditorialContainer>
    </div>
  );
}
