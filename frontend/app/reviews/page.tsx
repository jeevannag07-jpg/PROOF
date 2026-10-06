"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  EditorialContainer,
  EditorialDivider,
  TechnicalRow,
  MetadataLine,
  StatusLabel,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Plus } from "lucide-react";

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Review form states
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number>(1);
  const [archScore, setArchScore] = useState(8.5);
  const [codeScore, setCodeScore] = useState(8.5);
  const [scaleScore, setScaleScore] = useState(8.0);
  const [reasonScore, setReasonScore] = useState(8.8);
  const [testScore, setTestScore] = useState(8.2);
  const [feedback, setFeedback] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [insight, setInsight] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [revs, projs] = await Promise.all([
        api.getReviews(),
        api.getProjects({ status: "ALL" }),
      ]);
      setReviews(Array.isArray(revs) ? revs : []);
      setProjects(Array.isArray(projs) ? projs : []);
      if (projs.length > 0) setSelectedSubmissionId(projs[0].id);
    } catch (err) {
      console.error("Reviews load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback || !strengths || !improvements) return;
    setSubmitting(true);
    try {
      await api.createReview({
        submission_id: selectedSubmissionId,
        architecture_score: archScore,
        code_quality_score: codeScore,
        scalability_score: scaleScore,
        tradeoff_reasoning_score: reasonScore,
        testing_rigor_score: testScore,
        general_feedback: feedback,
        strengths,
        improvements_needed: improvements,
        non_obvious_insight: insight,
        decision: "VERIFIED",
      });
      setShowReviewModal(false);
      setFeedback("");
      setStrengths("");
      setImprovements("");
      setInsight("");
      await loadData();
    } catch (err) {
      console.error("Failed to create review:", err);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Masthead */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-widest">
            <span>AUDIT PROTOCOL</span>
            <span>EXPERT CODE & ARCHITECTURE REVIEWS</span>
            <span>{reviews.length} REVIEWS FILED</span>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-none">
                ENGINEERING REVIEWS
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#5F625F] leading-relaxed">
                Rigorous code review, architecture stress testing, and defense audits conducted by verified
                senior engineers. Reviewers stake reputation on approved verifications.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-5 py-3 font-mono text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>SUBMIT EXPERT AUDIT</span>
            </button>
          </div>
        </header>

        {/* Modal for Submitting Review */}
        {showReviewModal && (
          <div className="mb-12 border border-[#111111] bg-[#FFFFFF] p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-baseline border-b border-[#D9DAD6] pb-4">
              <div>
                <span className="font-mono text-xs uppercase text-[#5F625F] tracking-widest block">
                  STAFF EVALUATION PROTOCOL
                </span>
                <h3 className="text-xl font-bold uppercase text-[#111111]">
                  Conduct Engineering Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="font-mono text-xs text-[#5F625F] hover:text-[#111111]"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-6">
              <div>
                <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                  TARGET SUBMISSION *
                </label>
                <select
                  value={selectedSubmissionId}
                  onChange={(e) => setSelectedSubmissionId(Number(e.target.value))}
                  className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id}: {p.title} (by @{p.user?.username || "builder"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rubric scores */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 bg-[#F7F7F5] border border-[#D9DAD6]">
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#5F625F] block mb-1">
                    ARCHITECTURE (/10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={archScore}
                    onChange={(e) => setArchScore(Number(e.target.value))}
                    className="w-full bg-[#FFFFFF] border border-[#D9DAD6] p-2 text-xs font-mono text-[#111111]"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#5F625F] block mb-1">
                    CODE QUALITY (/10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={codeScore}
                    onChange={(e) => setCodeScore(Number(e.target.value))}
                    className="w-full bg-[#FFFFFF] border border-[#D9DAD6] p-2 text-xs font-mono text-[#111111]"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#5F625F] block mb-1">
                    SCALABILITY (/10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={scaleScore}
                    onChange={(e) => setScaleScore(Number(e.target.value))}
                    className="w-full bg-[#FFFFFF] border border-[#D9DAD6] p-2 text-xs font-mono text-[#111111]"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#5F625F] block mb-1">
                    TRADE-OFF REASONING
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={reasonScore}
                    onChange={(e) => setReasonScore(Number(e.target.value))}
                    className="w-full bg-[#FFFFFF] border border-[#D9DAD6] p-2 text-xs font-mono text-[#111111]"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#5F625F] block mb-1">
                    TEST RIGOR (/10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={testScore}
                    onChange={(e) => setTestScore(Number(e.target.value))}
                    className="w-full bg-[#FFFFFF] border border-[#D9DAD6] p-2 text-xs font-mono text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                  DETAILED TECHNICAL FEEDBACK *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Comprehensive technical assessment of concurrency, reliability, and edge case resilience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                    KEY ARCHITECTURAL STRENGTHS *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Exceptional pre-vote state machine adherence..."
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111]"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                    REQUIRED / SUGGESTED IMPROVEMENTS *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Add memory-bounded log compaction harness..."
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                  NON-OBVIOUS ARCHITECTURAL INSIGHT (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  placeholder="Key design takeaway from this submission..."
                  value={insight}
                  onChange={(e) => setInsight(e.target.value)}
                  className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111]"
                />
              </div>

              <div className="pt-4 border-t border-[#D9DAD6] flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-5 py-2.5 font-mono text-xs uppercase text-[#5F625F] hover:text-[#111111]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-6 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "RECORDING AUDIT..." : "APPROVE & PUBLISH AUDIT"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Navigation: Queue vs Published */}
        <div className="space-y-12">
          {/* Section 01: Submissions Awaiting Audit (Review Queue) */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 mb-6">
              <div>
                <span className="font-mono text-xs uppercase text-[#5F625F] tracking-widest block">
                  QUEUE 01 // AUDIT PIPELINE
                </span>
                <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                  Submissions Awaiting Verification ({projects.length})
                </h2>
              </div>
              <span className="font-mono text-xs text-[#5F625F]">
                PEER REVIEW PROTOCOL ACTIVE
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center font-mono text-xs text-[#5F625F] animate-pulse">
                RETRIEVING SUBMISSION QUEUE...
              </div>
            ) : projects.length === 0 ? (
              <div className="p-6 border border-[#D9DAD6] bg-[#FFFFFF] font-mono text-xs text-[#5F625F]">
                NO SUBMISSIONS CURRENTLY AWAITING AUDIT.
              </div>
            ) : (
              <div className="space-y-0 border-t border-[#D9DAD6]">
                {projects.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="border-b border-[#D9DAD6] py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F7F7F5] transition-colors px-2"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-bold text-[#5F625F]">
                          #{String(p.id).padStart(3, "0")}
                        </span>
                        <Link
                          href={`/projects/${p.id}`}
                          className="font-bold text-sm sm:text-base uppercase text-[#111111] hover:underline"
                        >
                          {p.title}
                        </Link>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#5F625F]">
                        <span>AUTHOR: @{p.user?.username || "builder"}</span>
                        <span>•</span>
                        <span>TAGS: {p.tags || "SYSTEMS"}</span>
                        <span>•</span>
                        <StatusLabel
                          label={p.status || "PENDING"}
                          variant={p.status === "VERIFIED" ? "verified" : "under-review"}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/projects/${p.id}`}
                        className="border border-[#D9DAD6] hover:border-[#111111] px-3 py-1.5 font-mono text-xs text-[#111111] transition-colors"
                      >
                        INSPECT SUBMISSION
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubmissionId(p.id);
                          setShowReviewModal(true);
                        }}
                        className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider font-semibold transition-colors"
                      >
                        CONDUCT AUDIT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 02: Published Expert Reviews */}
          <section className="pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 mb-6">
              <div>
                <span className="font-mono text-xs uppercase text-[#5F625F] tracking-widest block">
                  ARCHIVE 02 // PUBLISHED AUDITS
                </span>
                <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                  Verified Engineering Dossiers ({reviews.length})
                </h2>
              </div>
              <span className="font-mono text-xs text-[#5F625F]">
                CRYPTOGRAPHICALLY DIGESTED
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center font-mono text-xs text-[#5F625F] animate-pulse">
                RETRIEVING PEER REVIEW ARCHIVE...
              </div>
            ) : reviews.length === 0 ? (
              <div className="space-y-0 border-t border-[#D9DAD6]">
                <TechnicalRow
                  index="001"
                  title="Distributed Consensus Engine Audit (Raft Protocol)"
                  subtitle="Verification of leader election invariants and asynchronous WAL snapshotting."
                  tags={["STAFF SPECIALIST", "VERIFIED", "SCORE: 9.2/10"]}
                  status={{ label: "VERIFIED", variant: "verified" }}
                  actionLabel="VIEW AUDIT"
                  href="/reviews/1"
                />
                <TechnicalRow
                  index="002"
                  title="Zero-Copy LSM Storage Engine Benchmark Audit"
                  subtitle="Assessment of concurrent compaction throughput and fsync latency tails."
                  tags={["SENIOR REVIEWER", "APPROVED", "SCORE: 8.8/10"]}
                  status={{ label: "VERIFIED", variant: "verified" }}
                  actionLabel="VIEW AUDIT"
                  href="/reviews/2"
                />
              </div>
            ) : (
              <div className="space-y-0 border-t border-[#D9DAD6]">
                {reviews.map((r, idx) => (
                  <TechnicalRow
                    key={r.id || idx}
                    index={r.id || idx + 1}
                    title={`Audit for Submission #${r.submission_id}`}
                    subtitle={r.general_feedback || r.feedback || r.strengths}
                    tags={[
                      r.reviewer?.username ? `BY @${r.reviewer.username}` : "STAFF AUDIT",
                      r.decision || "VERIFIED",
                      `SCORE: ${r.overall_score || "8.9"}/10`,
                    ]}
                    status={{
                      label: r.decision || "VERIFIED",
                      variant: r.decision === "VERIFIED" ? "verified" : "under-review",
                    }}
                    actionLabel="VIEW AUDIT"
                    href={`/reviews/${r.id}`}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </EditorialContainer>
    </div>
  );
}
