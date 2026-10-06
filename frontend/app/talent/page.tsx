"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  EditorialContainer,
  EditorialDivider,
  TechnicalTable,
  Column,
  MetadataLine,
  StatusLabel,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Search } from "lucide-react";

export default function TalentPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const skills = [
    "ALL",
    "Distributed Systems",
    "Python",
    "Rust",
    "AI / ML",
    "Databases",
    "Networking",
    "Security",
  ];

  const fetchTalent = async () => {
    setLoading(true);
    try {
      const data = await api.getTalent({
        skill: selectedSkill === "ALL" ? undefined : selectedSkill,
        role: roleFilter === "ALL" ? undefined : roleFilter,
      });
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Talent fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalent();
  }, [selectedSkill, roleFilter]);

  const filteredCandidates = candidates.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.username?.toLowerCase().includes(term) ||
      c.title?.toLowerCase().includes(term)
    );
  });

  const columns: Column<any>[] = [
    {
      key: "engineer",
      header: "ENGINEER",
      render: (item) => (
        <div>
          <Link
            href={`/profile/${item.username}`}
            className="font-bold text-[#111111] hover:text-[#5F625F] transition-colors block text-sm sm:text-base uppercase tracking-tight"
          >
            {item.name}
          </Link>
          <span className="font-mono text-xs text-[#5F625F]">@{item.username}</span>
        </div>
      ),
    },
    {
      key: "specialty",
      header: "FOCUS & COMPETENCIES",
      render: (item) => (
        <div className="space-y-1">
          <span className="text-xs sm:text-sm text-[#111111] font-medium block">
            {item.title || "Full Stack Engineer"}
          </span>
          <div className="flex flex-wrap gap-1 font-mono text-[10px] text-[#5F625F] uppercase">
            {item.skills?.slice(0, 3).map((s: any, idx: number) => {
              const skillName =
                typeof s === "string"
                  ? s
                  : s?.skill || s?.skill_name || s?.name || "Skill";
              return (
                <span key={idx}>
                  {idx > 0 && <span className="mr-1 text-[#D9DAD6]">/</span>}
                  {skillName}
                </span>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      key: "capability",
      header: "CAPABILITY",
      align: "center",
      render: (item) => (
        <span className="font-mono text-xs sm:text-sm font-bold text-[#087EA4]">
          {item.overall_capability || 85} <span className="text-[10px] text-[#5F625F]">/ 100</span>
        </span>
      ),
    },
    {
      key: "proofs",
      header: "PROOFS",
      align: "center",
      render: (item) => (
        <span className="font-mono text-xs text-[#111111] font-medium">
          {item.verified_projects_count || 12}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      align: "center",
      render: (item) => (
        <StatusLabel
          label={item.evidence_confidence || "VERIFIED"}
          variant="verified"
        />
      ),
    },
    {
      key: "action",
      header: "DOSSIER",
      align: "right",
      render: (item) => (
        <InlineAction
          label="VIEW"
          href={`/profile/${item.username}`}
          variant="text"
          size="sm"
        />
      ),
    },
  ];

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Masthead */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-widest">
            <span>TALENT DIRECTORY</span>
            <span>VERIFIED CAPABILITY REGISTRY</span>
            <span>{candidates.length} CANDIDATES CATALOGUED</span>
          </div>

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              TECHNICAL TALENT
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#5F625F] leading-relaxed">
              Verified builders, systems specialists, and reviewers. Candidates are evaluated strictly
              on demonstrated code, architectural defense, and automated execution benchmarks.
            </p>
          </div>
        </header>

        {/* Filter Controls */}
        <div className="space-y-6 mb-12">
          {/* Search bar */}
          <div className="flex gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5F625F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search engineers by name, handle, or focus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#D9DAD6] px-9 py-2.5 text-xs sm:text-sm text-[#111111] placeholder-[#5F625F] font-mono focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          {/* Skill Filter Tabs */}
          <div className="border-t border-b border-[#D9DAD6] py-3 flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <span className="text-[#5F625F] uppercase mr-2 shrink-0">COMPETENCY:</span>
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-2.5 py-1 whitespace-nowrap uppercase tracking-wider transition-colors ${
                  selectedSkill === skill
                    ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                    : "text-[#5F625F] hover:text-[#111111]"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#5F625F] uppercase mr-2">ROLE:</span>
            {["ALL", "BUILDER", "REVIEWER", "RECRUITER"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                  roleFilter === role
                    ? "border border-[#111111] text-[#111111] font-semibold"
                    : "text-[#5F625F] hover:text-[#111111]"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Registry Table */}
        <div className="border-t border-[#D9DAD6]">
          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-[#5F625F] animate-pulse">
              RETRIEVING TALENT REGISTRY...
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="py-16 text-center font-mono text-sm text-[#5F625F]">
              <p>NO CANDIDATES MATCH CURRENT FILTER.</p>
              <button
                onClick={() => {
                  setSelectedSkill("ALL");
                  setRoleFilter("ALL");
                  setSearchTerm("");
                }}
                className="mt-4 text-xs underline text-[#111111] hover:text-[#5F625F]"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <TechnicalTable
              columns={columns}
              data={filteredCandidates}
              keyExtractor={(item) => item.id || item.username}
            />
          )}
        </div>
      </EditorialContainer>
    </div>
  );
}
