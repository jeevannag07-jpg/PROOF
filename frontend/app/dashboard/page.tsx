"use client";

import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [userAttempts, setUserAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const username = user?.username || "jeevan";
        const [prof, chals, attempts] = await Promise.all([
          api.getFullProfile(username).catch(() => null),
          api.getChallenges().catch(() => []),
          api.getUserAttempts().catch(() => []),
        ]);
        setProfileData(prof);
        setChallenges(Array.isArray(chals) ? chals : []);
        setUserAttempts(Array.isArray(attempts) ? attempts : []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  const activeUser = profileData?.user || user || {
    name: "Jeevan N.",
    username: "jeevan",
    role: "BUILDER",
    overall_capability: 86,
  };

  const verifiedProjects = Array.isArray(profileData?.verified_projects)
    ? profileData.verified_projects
    : [];

  const capabilities = Array.isArray(profileData?.capabilities)
    ? profileData.capabilities
    : [];

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Operational Hub Masthead */}
        <header className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-widest">
            <span>OPERATIONAL HUB</span>
            <span>ENGINEERING TELEMETRY & SUBMISSIONS</span>
            <span>PERSPECTIVE: {activeUser.role || "BUILDER"}</span>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-tight">
                OPERATIONAL WORKSTATION
              </h1>
              <p className="mt-2 text-base sm:text-lg text-[#5F625F] font-mono">
                @{activeUser.username} // {activeUser.name}
              </p>
            </div>

            {/* Next Action Callout */}
            <div className="border border-[#111111] bg-[#FFFFFF] p-5 shrink-0 max-w-sm">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block mb-1">
                RECOMMENDED ACTION
              </span>
              <p className="text-xs sm:text-sm font-semibold uppercase text-[#111111] mb-3">
                Continue Mission #009: Raft Protocol
              </p>
              <InlineAction
                label="RESUME WORKSPACE"
                href="/workspace/1"
                variant="solid"
                size="sm"
              />
            </div>
          </div>

          <div className="mt-8">
            <MetadataLine
              items={[
                { label: "OVERALL CAPABILITY", value: `${activeUser.overall_capability || 86}/100` },
                { label: "CONFIDENCE", value: "HIGH" },
                { label: "ACTIVE MISSIONS", value: userAttempts.length || 1 },
                { label: "VERIFIED PROOFS", value: verifiedProjects.length || 17 },
              ]}
            />
          </div>
        </header>

        {/* Section 01: Active Engineering Workspaces */}
        <EditorialSection
          number="01"
          title="ACTIVE WORKSPACES"
          description="In-progress mission implementations, architectural decision drafts, and benchmark harnesses."
          action={
            <InlineAction
              label="EXPLORE ALL MISSIONS"
              href="/missions"
              variant="text"
              size="sm"
            />
          }
        >
          {loading ? (
            <div className="py-12 font-mono text-xs text-[#5F625F] animate-pulse">
              RETRIEVING ACTIVE WORKSPACES...
            </div>
          ) : userAttempts.length === 0 ? (
            <div className="space-y-0">
              <TechnicalRow
                index="009"
                title="Distributed Consensus Engine (Raft Protocol)"
                subtitle="Leader election, log replication, and snapshotting under injected network partition chaos."
                tags={["DISTRIBUTED SYSTEMS", "GO", "IN PROGRESS"]}
                status={{ label: "IN PROGRESS", variant: "in-progress" }}
                actionLabel="RESUME WORKSPACE"
                href="/workspace/1"
              />
              <TechnicalRow
                index="014"
                title="Zero-Copy LSM Storage Engine with Compaction"
                subtitle="High-throughput key-value engine using memory-mapped SSTables."
                tags={["STORAGE", "RUST", "DRAFT"]}
                status={{ label: "DRAFT", variant: "neutral" }}
                actionLabel="RESUME WORKSPACE"
                href="/workspace/14"
              />
            </div>
          ) : (
            <div className="space-y-0">
              {userAttempts.map((att, idx) => (
                <TechnicalRow
                  key={att.id || idx}
                  index={att.challenge_id || idx + 1}
                  title={att.challenge?.title || `Mission #${att.challenge_id}`}
                  subtitle={`Attempt #${att.id} // Status: ${att.status || "IN_PROGRESS"}`}
                  tags={[
                    att.challenge?.domain || "SYSTEMS",
                    att.challenge?.difficulty || "INTERMEDIATE",
                  ]}
                  status={{
                    label: att.status || "IN PROGRESS",
                    variant: att.status === "VERIFIED" ? "verified" : "in-progress",
                  }}
                  actionLabel="RESUME WORKSPACE"
                  href={`/workspace/${att.challenge_id || att.id}`}
                />
              ))}
            </div>
          )}
        </EditorialSection>

        {/* Section 02: Verified Proofs & Submissions */}
        <EditorialSection
          number="02"
          title="VERIFIED PROOF REPOSITORY"
          description="Completed missions audited and approved by peer reviewers with recorded cryptographic artifacts."
          action={
            <InlineAction
              label="VIEW ALL PROOFS"
              href="/projects"
              variant="text"
              size="sm"
            />
          }
        >
          {verifiedProjects.length === 0 ? (
            <div className="space-y-0">
              <TechnicalRow
                index="001"
                title="Fault-Tolerant Distributed Rate Limiter"
                subtitle="Sliding window token bucket with Redis replication and local circuit breaker fallback."
                tags={["NETWORKING", "GO", "VERIFIED"]}
                status={{ label: "VERIFIED", variant: "verified" }}
                actionLabel="VIEW PROOF"
                href="/projects/1"
              />
              <TechnicalRow
                index="002"
                title="Document Intelligence & Vector Retrieval Engine"
                subtitle="High-throughput chunking, dense retrieval, and HNSW graph indexing for technical specs."
                tags={["NLP", "PYTHON", "VECTOR SEARCH"]}
                status={{ label: "VERIFIED", variant: "verified" }}
                actionLabel="VIEW PROOF"
                href="/projects/2"
              />
            </div>
          ) : (
            <div className="space-y-0">
              {verifiedProjects.slice(0, 4).map((p: any, idx: number) => (
                <TechnicalRow
                  key={p.id || idx}
                  index={idx + 1}
                  title={p.title}
                  subtitle={p.description}
                  tags={[
                    p.skill || "SYSTEMS",
                    p.repository_url ? "OPEN SOURCE" : "INTERNAL",
                  ]}
                  status={{ label: "VERIFIED", variant: "verified" }}
                  actionLabel="VIEW PROOF"
                  href={`/projects/${p.id}`}
                />
              ))}
            </div>
          )}
        </EditorialSection>

        {/* Section 03: Capability Telemetry */}
        <EditorialSection
          number="03"
          title="CAPABILITY TELEMETRY"
          description="Verified competency scores calculated across automated chaos benchmarks and peer reviews."
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
              <span className="text-[#5F625F] block mb-1">SYSTEMS ARCHITECTURE</span>
              <span className="text-2xl font-bold text-[#087EA4]">88 / 100</span>
              <span className="text-[10px] text-[#087F5B] block mt-1">VERIFIED</span>
            </div>
            <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
              <span className="text-[#5F625F] block mb-1">CONCURRENCY & PROTOCOLS</span>
              <span className="text-2xl font-bold text-[#087EA4]">85 / 100</span>
              <span className="text-[10px] text-[#087F5B] block mt-1">VERIFIED</span>
            </div>
            <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
              <span className="text-[#5F625F] block mb-1">DATA PIPELINES</span>
              <span className="text-2xl font-bold text-[#087EA4]">81 / 100</span>
              <span className="text-[10px] text-[#087F5B] block mt-1">VERIFIED</span>
            </div>
            <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4">
              <span className="text-[#5F625F] block mb-1">STORAGE INTERNALS</span>
              <span className="text-2xl font-bold text-[#087EA4]">78 / 100</span>
              <span className="text-[10px] text-[#087EA4] block mt-1">IN PROGRESS</span>
            </div>
          </div>
        </EditorialSection>
      </EditorialContainer>
    </div>
  );
}
