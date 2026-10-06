"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  EditorialContainer,
  EditorialSection,
  EditorialDivider,
  MetadataLine,
  StatusLabel,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;
  const { user } = useAuth();

  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [userAttempt, setUserAttempt] = useState<any>(null);

  useEffect(() => {
    async function loadMission() {
      try {
        const data = await api.getChallenge(idOrSlug);
        setChallenge(data);

        if (user) {
          api
            .getUserAttempts()
            .then((attempts) => {
              if (Array.isArray(attempts)) {
                const attempt = attempts.find(
                  (a: any) => String(a.challenge_id) === String(data.id)
                );
                if (attempt) setUserAttempt(attempt);
              }
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error("Failed to load mission:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMission();
  }, [idOrSlug, user]);

  const handleStartMission = async () => {
    if (!challenge) return;
    setStarting(true);
    try {
      await api.startMission(challenge.id);
      router.push(`/workspace/${challenge.id}`);
    } catch (err) {
      console.warn("Start mission call returned, proceeding to workspace:", err);
      router.push(`/workspace/${challenge.id}`);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <EditorialContainer>
          <div className="font-mono text-xs text-[#5F625F] animate-pulse">
            RETRIEVING ENGINEERING BRIEF...
          </div>
        </EditorialContainer>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="py-20">
        <EditorialContainer>
          <div className="font-mono text-sm text-[#111111]">
            <p>MISSION SPECIFICATION NOT FOUND.</p>
            <Link
              href="/missions"
              className="mt-4 inline-block text-xs underline text-[#5F625F] hover:text-[#111111]"
            >
              ← RETURN TO ARCHIVE
            </Link>
          </div>
        </EditorialContainer>
      </div>
    );
  }

  const constraintsList = challenge.constraints
    ? typeof challenge.constraints === "string"
      ? challenge.constraints.split("\n").filter(Boolean)
      : Array.isArray(challenge.constraints)
      ? challenge.constraints
      : []
    : [
        "Zero data corruption under injected SIGKILL partition events.",
        "p99 latency must not exceed 10ms at 5,000 req/sec sustained throughput.",
        "Linearizable read consistency verified by Jepsen-style automated test harness.",
      ];

  const skillsList = (challenge.skills_required || challenge.skills || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const formattedId =
    typeof challenge.id === "number"
      ? String(challenge.id).padStart(3, "0")
      : challenge.id;

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/missions"
            className="font-mono text-xs text-[#5F625F] hover:text-[#111111] transition-colors"
          >
            ← MISSIONS ARCHIVE
          </Link>
        </div>

        {/* Engineering Brief Masthead */}
        <header className="pb-8 border-b border-[#D9DAD6]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono text-xs text-[#5F625F] uppercase tracking-wider mb-4">
            <span>
              MISSION {formattedId} // {challenge.domain || "SYSTEMS"}
            </span>
            <StatusLabel
              label={challenge.difficulty || "INTERMEDIATE"}
              variant={
                challenge.difficulty === "ADVANCED"
                  ? "xp"
                  : challenge.difficulty === "INTERMEDIATE"
                  ? "capability"
                  : "verified"
              }
            />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-tight">
            {challenge.title}
          </h1>

          <div className="mt-6">
            <MetadataLine
              items={[
                { label: "DOMAIN", value: challenge.domain || "ENGINEERING" },
                { label: "DIFFICULTY", value: challenge.difficulty || "INTERMEDIATE" },
                { label: "ESTIMATED TIME", value: challenge.estimated_time || "4–6 HOURS" },
                { label: "STATUS", value: userAttempt ? "IN PROGRESS" : "AVAILABLE" },
              ]}
            />
          </div>
        </header>

        {/* 12-Column Editorial Grid: Brief on Left, Specs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          {/* Main Brief Content (8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Section 01: Problem Statement */}
            <section>
              <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
                01 // PROBLEM STATEMENT
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
                The Engineering Challenge
              </h2>
              <div className="text-base text-[#111111] leading-relaxed space-y-4">
                <p>{challenge.problem_statement || challenge.description}</p>
                {challenge.real_world_context && (
                  <p className="text-[#5F625F] text-sm leading-relaxed border-l-2 border-[#D9DAD6] pl-4">
                    {challenge.real_world_context}
                  </p>
                )}
              </div>
            </section>

            <EditorialDivider spacing="none" />

            {/* Section 02: Constraints */}
            <section>
              <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
                02 // HARDWARE & ARCHITECTURAL CONSTRAINTS
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
                System Invariants
              </h2>
              <div className="space-y-3 font-mono text-xs text-[#111111]">
                {constraintsList.map((c: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 py-2 border-b border-[#D9DAD6]">
                    <span className="text-[#5F625F] shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>
            </section>

            <EditorialDivider spacing="none" />

            {/* Section 03: Expected Capability & Skills */}
            <section>
              <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
                03 // EXPECTED CAPABILITY GAINS
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
                Verified Competencies
              </h2>
              <p className="text-sm text-[#5F625F] leading-relaxed mb-4">
                Successful defense and verification of this mission directly updates your public capability score in:
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {skillsList.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="border border-[#D9DAD6] bg-[#FFFFFF] px-3 py-1 text-[#111111] uppercase tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <EditorialDivider spacing="none" />

            {/* Section 04: Evaluation Criteria */}
            <section>
              <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
                04 // EVALUATION CRITERIA
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
                Reviewer Rubric
              </h2>
              <div className="bg-[#FFFFFF] border border-[#D9DAD6] p-6 space-y-4 font-mono text-xs text-[#5F625F]">
                <div>
                  <span className="text-[#111111] font-bold block mb-1">
                    1. DETERMINISTIC SYSTEM BEHAVIOR
                  </span>
                  Zero unhandled edge-case panics; clean recovery after process crash.
                </div>
                <div>
                  <span className="text-[#111111] font-bold block mb-1">
                    2. ARCHITECTURE DECISION QUALITY
                  </span>
                  Clear articulation of trade-offs, consensus invariants, and concurrency safety.
                </div>
                <div>
                  <span className="text-[#111111] font-bold block mb-1">
                    3. DEFENSE RIGOR
                  </span>
                  Candidate can defend algorithm selections during peer reviewer questioning.
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Specs Action Panel (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block mb-4">
                MISSION DOSSIER
              </span>

              <div className="space-y-4 font-mono text-xs pb-6 border-b border-[#D9DAD6]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#5F625F]">MISSION ID:</span>
                  <span className="text-[#111111] font-bold">{formattedId}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#5F625F]">DIFFICULTY:</span>
                  <span className="text-[#111111]">{challenge.difficulty || "INTERMEDIATE"}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#5F625F]">TIME EST:</span>
                  <span className="text-[#111111]">{challenge.estimated_time || "4–6 HOURS"}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#5F625F]">XP REWARD:</span>
                  <span className="text-[#A16207] font-bold">+450 XP</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#5F625F]">CAPABILITY GAIN:</span>
                  <span className="text-[#087EA4] font-bold">+12 INDEX</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleStartMission}
                  disabled={starting}
                  className="w-full bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] font-mono text-xs uppercase tracking-widest py-3 px-4 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {starting ? (
                    "INITIALIZING WORKSPACE..."
                  ) : userAttempt ? (
                    "CONTINUE WORKSPACE →"
                  ) : (
                    "START MISSION →"
                  )}
                </button>
              </div>

              <p className="mt-4 text-[11px] font-mono text-[#5F625F] text-center">
                Initializes isolated workspace repository and automated review harness.
              </p>
            </div>

            {/* Secondary Advice */}
            <div className="border border-[#D9DAD6] p-6 text-xs font-mono text-[#5F625F]">
              <span className="uppercase text-[#111111] font-bold block mb-2">SUBMISSION NOTE</span>
              All submissions require a recorded Architecture Decision Record (ADR), execution evidence logs, and passing the automated chaos test runner.
            </div>
          </div>
        </div>
      </EditorialContainer>
    </div>
  );
}
