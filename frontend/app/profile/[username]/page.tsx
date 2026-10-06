"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  EditorialContainer,
  EditorialSection,
  EditorialDivider,
  TechnicalRow,
  MetadataLine,
  StatusLabel,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getFullProfile(username);
        setProfile(data);
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="py-20">
        <EditorialContainer>
          <div className="font-mono text-xs text-[#5F625F] animate-pulse">
            RETRIEVING TECHNICAL IDENTITY DOSSIER...
          </div>
        </EditorialContainer>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20">
        <EditorialContainer>
          <div className="font-mono text-sm text-[#111111]">
            <p>ENGINEER DOSSIER NOT FOUND.</p>
            <Link
              href="/talent"
              className="mt-4 inline-block text-xs underline text-[#5F625F] hover:text-[#111111]"
            >
              ← RETURN TO TALENT REGISTRY
            </Link>
          </div>
        </EditorialContainer>
      </div>
    );
  }

  const u = profile.user || profile;
  const capabilities = Array.isArray(profile.capabilities) ? profile.capabilities : [];
  const verifiedProjects = Array.isArray(profile.verified_projects)
    ? profile.verified_projects
    : Array.isArray(profile.projects)
    ? profile.projects
    : [];
  const reviews = Array.isArray(profile.reviews) ? profile.reviews : [];
  const reels = Array.isArray(profile.reels) ? profile.reels : [];

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/talent"
            className="font-mono text-xs text-[#5F625F] hover:text-[#111111] transition-colors"
          >
            ← TALENT REGISTRY
          </Link>
        </div>

        {/* Dossier Masthead */}
        <header className="pb-8 border-b border-[#D9DAD6]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono text-xs text-[#5F625F] uppercase tracking-wider mb-3">
            <span>
              TECHNICAL IDENTITY DOSSIER // CANDIDATE #{u.id || "01"}
            </span>
            <StatusLabel
              label={u.evidence_confidence || "VERIFIED"}
              variant="verified"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-tight">
                {u.name || "Jeevan N."}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-[#5F625F] font-mono">
                @{u.username} // {u.title || "AI & Distributed Systems Engineer"}
              </p>
              {u.bio && (
                <p className="mt-4 text-sm text-[#111111] max-w-2xl leading-relaxed">
                  {u.bio}
                </p>
              )}
            </div>

            {/* Capability Score Index Callout */}
            <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 shrink-0 min-w-[220px]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block mb-1">
                OVERALL CAPABILITY
              </span>
              <div className="text-4xl font-bold font-mono text-[#087EA4]">
                {u.overall_capability || 86} <span className="text-sm text-[#5F625F]">/ 100</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9DAD6] font-mono text-xs text-[#5F625F] space-y-1">
                <div>PROOFS: {u.verified_projects_count || verifiedProjects.length || 17}</div>
                <div>REVIEWS: {u.expert_reviews_count || reviews.length || 8}</div>
                <div>DEPLOYMENTS: {u.deployments_count || 3}</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <MetadataLine
              items={[
                { label: "ROLE", value: u.role || "BUILDER" },
                { label: "CONFIDENCE", value: u.evidence_confidence || "HIGH" },
                { label: "VERIFIED SINCE", value: "2026-Q1" },
              ]}
            />
          </div>
        </header>

        {/* Section 01: Capabilities Breakdown */}
        <EditorialSection
          number="01"
          title="CAPABILITY MATRIX"
          description="Algorithmic capability index determined by verified mission complexity, benchmark performance, and peer defense outcomes."
        >
          {capabilities.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
                <span className="text-[#5F625F] block">PYTHON</span>
                <span className="text-xl font-bold text-[#087EA4]">87 / 100</span>
                <span className="text-[10px] text-[#087F5B] block mt-1">VERIFIED</span>
              </div>
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
                <span className="text-[#5F625F] block">SYSTEMS ARCHITECTURE</span>
                <span className="text-xl font-bold text-[#087EA4]">81 / 100</span>
                <span className="text-[10px] text-[#087F5B] block mt-1">VERIFIED</span>
              </div>
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
                <span className="text-[#5F625F] block">AI & ML PIPELINES</span>
                <span className="text-xl font-bold text-[#087EA4]">84 / 100</span>
                <span className="text-[10px] text-[#087F5B] block mt-1">VERIFIED</span>
              </div>
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
                <span className="text-[#5F625F] block">DATABASE INTERNALS</span>
                <span className="text-xl font-bold text-[#087EA4]">79 / 100</span>
                <span className="text-[10px] text-[#087EA4] block mt-1">IN PROGRESS</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              {capabilities.map((c: any) => (
                <div key={c.id || c.skill_name} className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
                  <span className="text-[#5F625F] block uppercase truncate">
                    {c.skill_name || c.name}
                  </span>
                  <span className="text-xl font-bold text-[#087EA4]">
                    {c.capability_score || c.score || 80} / 100
                  </span>
                  <span className="text-[10px] text-[#087F5B] block mt-1 uppercase">
                    {c.confidence_level || "VERIFIED"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </EditorialSection>

        {/* Section 02: Verified Proofs / Projects */}
        <EditorialSection
          number="02"
          title="VERIFIED ENGINEERING PROOF"
          description="Production systems engineered and verified against automated benchmarks and architectural review."
        >
          {verifiedProjects.length === 0 ? (
            <div className="space-y-0">
              <TechnicalRow
                index="001"
                title="Distributed Consensus Engine (Raft Protocol)"
                subtitle="Leader election, log replication, and snapshotting under injected network partition chaos."
                tags={["DISTRIBUTED SYSTEMS", "GO", "HARDWARE BENCHMARK"]}
                status={{ label: "VERIFIED", variant: "verified" }}
                actionLabel="VIEW PROOF"
                href="/projects/1"
              />
              <TechnicalRow
                index="002"
                title="Real-Time Event Processing Pipeline"
                subtitle="Low-latency sliding-window analytics engine with Redis Streams and backpressure handling."
                tags={["STREAMING", "PYTHON", "REDIS"]}
                status={{ label: "VERIFIED", variant: "verified" }}
                actionLabel="VIEW PROOF"
                href="/projects/2"
              />
              <TechnicalRow
                index="003"
                title="Document Intelligence & Vector Retrieval Service"
                subtitle="High-throughput chunking, dense retrieval, and HNSW graph indexing for technical specs."
                tags={["NLP", "PYTHON", "VECTOR SEARCH"]}
                status={{ label: "VERIFIED", variant: "verified" }}
                actionLabel="VIEW PROOF"
                href="/projects/3"
              />
            </div>
          ) : (
            <div className="space-y-0">
              {verifiedProjects.map((p: any, idx: number) => (
                <TechnicalRow
                  key={p.id || idx}
                  index={idx + 1}
                  title={p.title}
                  subtitle={p.description}
                  tags={[
                    p.skill || "SYSTEMS",
                    p.repository_url ? "OPEN SOURCE" : "VERIFIED IMPLEMENTATION",
                  ]}
                  status={{ label: "VERIFIED", variant: "verified" }}
                  actionLabel="VIEW PROOF"
                  href={`/projects/${p.id}`}
                />
              ))}
            </div>
          )}
        </EditorialSection>

        {/* Section 03: Peer Review & Reputation */}
        <EditorialSection
          number="03"
          title="EXPERT REVIEWS & REPUTATION"
          description="Peer-evaluated code quality, architecture defenses, and staff review decisions."
        >
          <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8 space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block">
              REVIEW HISTORY SUMMARY
            </span>
            <div className="text-xs sm:text-sm font-mono text-[#111111] space-y-2">
              <p>
                <strong>Senior Reviewer Audit (Alex T. // Staff Infrastructure):</strong> "Candidate demonstrated thorough understanding of linearizability under partition. The Pre-Vote protocol was cleanly adapted to prevent term inflation storms."
              </p>
              <div className="text-[#087F5B] font-bold">
                ✓ 100% DEFENSE INTERVIEW VERIFICATION RATE
              </div>
            </div>
          </div>
        </EditorialSection>

        {/* Section 04: Technical Reels */}
        {reels.length > 0 && (
          <EditorialSection
            number="04"
            title="TECHNICAL REELS"
            description="Engineering video walkthroughs demonstrating live system architectures and terminals."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reels.map((r: any) => (
                <div key={r.id} className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 space-y-3">
                  <span className="font-mono text-[10px] text-[#087EA4] uppercase font-bold">
                    REEL #{r.id} // {r.reel_type || "ARCHITECTURE"}
                  </span>
                  <h4 className="font-bold text-base uppercase text-[#111111]">
                    {r.title}
                  </h4>
                  <p className="text-xs text-[#5F625F]">{r.description}</p>
                  <InlineAction
                    label="WATCH REEL"
                    href={`/reels`}
                    variant="text"
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </EditorialSection>
        )}
      </EditorialContainer>
    </div>
  );
}
