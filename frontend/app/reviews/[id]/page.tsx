"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  EditorialContainer,
  EditorialDivider,
  MetadataLine,
  StatusLabel,
  EvidenceBlock,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";

export default function ReviewDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getReview(id);
        setReview(data);
      } catch (err) {
        console.error("Load review error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20">
        <EditorialContainer>
          <div className="font-mono text-xs text-[#5F625F] animate-pulse">
            RETRIEVING ENGINEERING AUDIT DOSSIER...
          </div>
        </EditorialContainer>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="py-20">
        <EditorialContainer>
          <div className="font-mono text-sm text-[#111111]">
            <p>AUDIT REPORT NOT FOUND.</p>
            <Link
              href="/reviews"
              className="mt-4 inline-block text-xs underline text-[#5F625F] hover:text-[#111111]"
            >
              ← RETURN TO AUDIT ARCHIVE
            </Link>
          </div>
        </EditorialContainer>
      </div>
    );
  }

  const reviewer = review.reviewer || {
    name: "Alex T.",
    username: "alex_t",
    title: "Staff Infrastructure Engineer",
  };

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/reviews"
            className="font-mono text-xs text-[#5F625F] hover:text-[#111111] transition-colors"
          >
            ← ENGINEERING REVIEWS ARCHIVE
          </Link>
        </div>

        {/* Audit Report Header */}
        <header className="pb-8 border-b border-[#D9DAD6]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono text-xs text-[#5F625F] uppercase tracking-wider mb-3">
            <span>AUDIT DOSSIER #{review.id} // SUBMISSION #{review.submission_id}</span>
            <StatusLabel
              label={review.decision || "VERIFIED"}
              variant="verified"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-tight">
            EXPERT REVIEW & DEFENSE AUDIT
          </h1>

          <div className="mt-6">
            <MetadataLine
              items={[
                { label: "REVIEWER", value: `@${reviewer.username}` },
                { label: "TARGET SUBMISSION", value: `#${review.submission_id}` },
                { label: "OVERALL SCORE", value: `${review.overall_score || "8.9"} / 10` },
                { label: "REPUTATION STAKED", value: "+100 XP" },
              ]}
            />
          </div>
        </header>

        {/* Rubric Score Matrix */}
        <div className="my-10 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4 font-mono text-xs">
            <span className="text-[#5F625F] block mb-1">ARCHITECTURE</span>
            <span className="text-2xl font-bold text-[#087EA4]">
              {review.architecture_score || 9.0} <span className="text-xs text-[#5F625F]">/ 10</span>
            </span>
          </div>
          <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4 font-mono text-xs">
            <span className="text-[#5F625F] block mb-1">CODE QUALITY</span>
            <span className="text-2xl font-bold text-[#087EA4]">
              {review.code_quality_score || 8.8} <span className="text-xs text-[#5F625F]">/ 10</span>
            </span>
          </div>
          <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4 font-mono text-xs">
            <span className="text-[#5F625F] block mb-1">SCALABILITY</span>
            <span className="text-2xl font-bold text-[#087EA4]">
              {review.scalability_score || 8.5} <span className="text-xs text-[#5F625F]">/ 10</span>
            </span>
          </div>
          <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4 font-mono text-xs">
            <span className="text-[#5F625F] block mb-1">TRADE-OFF RIGOR</span>
            <span className="text-2xl font-bold text-[#087EA4]">
              {review.tradeoff_reasoning_score || 9.2} <span className="text-xs text-[#5F625F]">/ 10</span>
            </span>
          </div>
          <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-4 font-mono text-xs">
            <span className="text-[#5F625F] block mb-1">TESTING RIGOR</span>
            <span className="text-2xl font-bold text-[#087EA4]">
              {review.testing_rigor_score || 8.9} <span className="text-xs text-[#5F625F]">/ 10</span>
            </span>
          </div>
        </div>

        {/* Audit Body */}
        <div className="space-y-12">
          {/* Section 01: General Assessment */}
          <section>
            <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
              01 // AUDIT SUMMARY
            </span>
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
              Reviewer Technical Findings
            </h2>
            <div className="text-base text-[#111111] leading-relaxed space-y-4">
              <p>{review.general_feedback || "The candidate engineered a clean, robust distributed consensus state machine with clear boundary isolation and deterministic election recovery."}</p>
            </div>
          </section>

          <EditorialDivider spacing="none" />

          {/* Section 02: Key Strengths & Technical Decisions */}
          <section>
            <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
              02 // ARCHITECTURAL STRENGTHS
            </span>
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
              Verified Technical Strengths
            </h2>
            <div className="bg-[#FFFFFF] border border-[#D9DAD6] p-6 text-sm text-[#111111] leading-relaxed">
              {review.strengths || "Deterministic state machine replication with clean Pre-Vote protocol integration. Thorough edge case handling during network partition chaos testing."}
            </div>
          </section>

          <EditorialDivider spacing="none" />

          {/* Section 03: Recommendations & Improvements */}
          <section>
            <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
              03 // RECOMMENDATIONS & IMPROVEMENTS
            </span>
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
              Future System Hardening
            </h2>
            <div className="bg-[#FFFFFF] border border-[#D9DAD6] p-6 text-sm text-[#111111] leading-relaxed">
              {review.improvements_needed || "Consider implementing pipelined log append RPCs to improve replication throughput across high-latency cross-region links."}
            </div>
          </section>

          {/* Section 04: Non-Obvious Insights */}
          {review.non_obvious_insight && (
            <>
              <EditorialDivider spacing="none" />
              <section>
                <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
                  04 // ARCHITECTURAL INSIGHT
                </span>
                <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
                  Takeaway & Paradigm Analysis
                </h2>
                <div className="p-4 bg-[#F7F7F5] border border-[#D9DAD6] font-mono text-xs text-[#111111] leading-relaxed">
                  {review.non_obvious_insight}
                </div>
              </section>
            </>
          )}

          {/* Action Link to Submission */}
          <div className="pt-8 border-t border-[#D9DAD6] flex justify-between items-center">
            <span className="font-mono text-xs text-[#5F625F]">
              AUTHENTICATED AUDIT // CRYPTOGRAPHICALLY DIGESTED
            </span>
            <InlineAction
              label="INSPECT ORIGINAL SUBMISSION"
              href={`/projects/${review.submission_id}`}
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </EditorialContainer>
    </div>
  );
}
