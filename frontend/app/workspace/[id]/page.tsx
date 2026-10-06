"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  EditorialContainer,
  EditorialDivider,
  MetadataLine,
  StatusLabel,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import ArchitectureBuilder from "@/components/workspace/ArchitectureBuilder";
import DecisionEditor from "@/components/workspace/DecisionEditor";
import EvidenceManager from "@/components/workspace/EvidenceManager";
import DefenseInterview from "@/components/workspace/DefenseInterview";

type WorkspaceTab =
  | "PROBLEM"
  | "PLAN"
  | "BUILD"
  | "ARCHITECTURE"
  | "DECISIONS"
  | "EVIDENCE"
  | "DEFENSE"
  | "VERIFICATION";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>("PROBLEM");
  const [attemptData, setAttemptData] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Build inputs
  const [repoUrl, setRepoUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [saveStatus, setSaveStatus] = useState(false);

  // Verification state
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Plan checklist
  const [planChecklist, setPlanChecklist] = useState([
    { id: 1, text: "Analyze SLA throughput and p99 latency target", done: true },
    { id: 2, text: "Design atomic state transition mechanism without table locks", done: true },
    { id: 3, text: "Draft architecture topology & identify single points of failure", done: true },
    { id: 4, text: "Implement core algorithm and stress test race conditions", done: true },
    { id: 5, text: "Record architectural decisions with explicit trade-offs", done: true },
    { id: 6, text: "Execute automated benchmark harness (Locust / k6)", done: false },
    { id: 7, text: "Defend engineering decisions against edge cases", done: false },
  ]);

  const toggleChecklist = (id: number) => {
    setPlanChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const loadData = async () => {
    try {
      let challengeId = 1;
      if (!isNaN(Number(idOrSlug))) {
        challengeId = Number(idOrSlug);
      }

      const attemptRes = await api.startAttempt(challengeId);
      const detail = await api.getAttemptDetail(attemptRes.id);
      setAttemptData(detail);

      if (detail.submission_id) {
        const sub = await api.getSubmission(detail.submission_id);
        setSubmission(sub);
        setRepoUrl(sub.repository_url || "");
        setLiveDemoUrl(sub.live_demo_url || "");
        setProjectTitle(sub.title || "");
        setProjectDesc(sub.description || "");
        if (sub.verification) {
          setVerificationResult(sub.verification);
        }
      }
    } catch (err) {
      console.error("Workspace load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [idOrSlug]);

  const handleSaveBuild = async () => {
    if (!submission?.id) return;
    try {
      await api.updateSubmission(submission.id, {
        title: projectTitle,
        description: projectDesc,
        repository_url: repoUrl,
        live_demo_url: liveDemoUrl,
      });
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 3000);
    } catch (err) {
      console.error("Failed to update submission:", err);
      alert("Failed to save project changes.");
    }
  };

  const handleSubmitVerification = async () => {
    if (!submission?.id) return;
    setVerifying(true);
    try {
      const res = await api.submitForVerification(submission.id);
      setVerificationResult(res.verification || res);
      await loadData();
      setActiveTab("VERIFICATION");
    } catch (err) {
      console.error("Verification submit error:", err);
      alert("Failed to run verification harness.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <EditorialContainer>
          <div className="font-mono text-xs text-[#5F625F] animate-pulse">
            INITIALIZING ENGINEERING WORKSTATION...
          </div>
        </EditorialContainer>
      </div>
    );
  }

  const challenge = attemptData?.challenge || {
    id: idOrSlug,
    title: "Mission " + idOrSlug,
    domain: "SYSTEMS",
    difficulty: "ADVANCED",
    problem_statement: "Build a fault-tolerant distributed system meeting all SLA constraints.",
  };

  const formattedId =
    typeof challenge.id === "number"
      ? String(challenge.id).padStart(3, "0")
      : challenge.id;

  const tabs: WorkspaceTab[] = [
    "PROBLEM",
    "PLAN",
    "BUILD",
    "ARCHITECTURE",
    "DECISIONS",
    "EVIDENCE",
    "DEFENSE",
    "VERIFICATION",
  ];

  return (
    <div className="py-12 md:py-16">
      <EditorialContainer>
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center font-mono text-xs text-[#5F625F]">
          <Link href="/missions" className="hover:text-[#111111] transition-colors">
            ← MISSIONS ARCHIVE
          </Link>
          <span className="uppercase">
            ATTEMPT ID: #{attemptData?.id || "001"} // USER: @{user?.username || "jeevan"}
          </span>
        </div>

        {/* Workstation Header */}
        <header className="pb-6 border-b border-[#D9DAD6]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono text-xs text-[#5F625F] uppercase tracking-wider mb-2">
            <span>MISSION {formattedId} // ENGINEERING WORKSTATION</span>
            <StatusLabel
              label={submission?.status || "IN PROGRESS"}
              variant={
                submission?.status === "VERIFIED"
                  ? "verified"
                  : submission?.status === "SUBMITTED"
                  ? "under-review"
                  : "in-progress"
              }
            />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111] uppercase">
            {challenge.title}
          </h1>

          <div className="mt-4">
            <MetadataLine
              items={[
                { label: "DOMAIN", value: challenge.domain || "SYSTEMS" },
                { label: "SUBMISSION ID", value: submission?.id ? `#${submission.id}` : "UNINITIALIZED" },
                { label: "STATUS", value: submission?.status || "DRAFT" },
              ]}
            />
          </div>
        </header>

        {/* Workstation Tab Bar */}
        <div className="border-b border-[#D9DAD6] my-8 overflow-x-auto">
          <nav className="flex items-center gap-1 sm:gap-2 pb-0 font-mono text-xs whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                    : "text-[#5F625F] hover:text-[#111111] hover:bg-[#F2F2EF]"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[500px]">
          {/* TAB 1: PROBLEM */}
          {activeTab === "PROBLEM" && (
            <div className="space-y-8">
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8">
                <span className="font-mono text-xs uppercase text-[#5F625F] tracking-widest block mb-2">
                  SPECIFICATION BRIEF
                </span>
                <h3 className="text-xl font-bold uppercase text-[#111111] mb-4">
                  Problem Context & Target SLA
                </h3>
                <p className="text-sm sm:text-base text-[#111111] leading-relaxed mb-6">
                  {challenge.problem_statement || challenge.description}
                </p>

                {challenge.constraints && (
                  <div className="mt-6 pt-6 border-t border-[#D9DAD6]">
                    <span className="font-mono text-xs uppercase text-[#5F625F] tracking-wider block mb-3">
                      INVARIANTS & CONSTRAINTS
                    </span>
                    <pre className="p-4 bg-[#F7F7F5] border border-[#D9DAD6] font-mono text-xs text-[#111111] whitespace-pre-wrap">
                      {challenge.constraints}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-[#D9DAD6]">
                <span className="font-mono text-xs text-[#5F625F]">NEXT PHASE: EXECUTION PLAN</span>
                <button
                  type="button"
                  onClick={() => setActiveTab("PLAN")}
                  className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
                >
                  GO TO PLAN →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PLAN */}
          {activeTab === "PLAN" && (
            <div className="space-y-8">
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8">
                <span className="font-mono text-xs uppercase text-[#5F625F] tracking-widest block mb-2">
                  EXECUTION CHECKLIST
                </span>
                <h3 className="text-xl font-bold uppercase text-[#111111] mb-4">
                  Engineering Delivery Checklist
                </h3>
                <p className="text-xs sm:text-sm text-[#5F625F] mb-6">
                  Check off items as you design, implement, and benchmark your solution.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  {planChecklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-3 border border-[#D9DAD6] bg-[#F7F7F5] cursor-pointer hover:bg-[#F2F2EF] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleChecklist(item.id)}
                        className="w-4 h-4 rounded-none accent-[#111111]"
                      />
                      <span className={item.done ? "line-through text-[#5F625F]" : "text-[#111111] font-medium"}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-[#D9DAD6]">
                <button
                  type="button"
                  onClick={() => setActiveTab("PROBLEM")}
                  className="text-xs font-mono text-[#5F625F] hover:text-[#111111]"
                >
                  ← BACK TO PROBLEM
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("BUILD")}
                  className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
                >
                  GO TO BUILD →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BUILD */}
          {activeTab === "BUILD" && (
            <div className="space-y-8">
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8 space-y-6">
                <span className="font-mono text-xs uppercase text-[#5F625F] tracking-widest block mb-2">
                  CODE & REPOSITORY RECONCILIATION
                </span>
                <h3 className="text-xl font-bold uppercase text-[#111111]">
                  Submission Details & Source Repositories
                </h3>

                <div>
                  <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                    PROJECT TITLE *
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Distributed Consensus Engine (Raft Protocol)"
                    className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs sm:text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                    GITHUB REPOSITORY URL *
                  </label>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs sm:text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                    LIVE DEMO OR TELEMETRY ENDPOINT (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    placeholder="https://demo.domain.dev"
                    className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs sm:text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                    TECHNICAL SUMMARY / README
                  </label>
                  <textarea
                    rows={4}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Describe algorithm implementation, concurrency primitives, and test coverage..."
                    className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs sm:text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="pt-4 border-t border-[#D9DAD6] flex items-center justify-between">
                  <div className="font-mono text-xs text-[#087F5B]">
                    {saveStatus && "✓ BUILD DETAILS SAVED"}
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveBuild}
                    className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-6 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
                  >
                    SAVE BUILD ARTIFACTS
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-[#D9DAD6]">
                <button
                  type="button"
                  onClick={() => setActiveTab("PLAN")}
                  className="text-xs font-mono text-[#5F625F] hover:text-[#111111]"
                >
                  ← BACK TO PLAN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ARCHITECTURE")}
                  className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
                >
                  ARCHITECTURE BUILDER →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ARCHITECTURE */}
          {activeTab === "ARCHITECTURE" && (
            <div>
              <ArchitectureBuilder
                submissionId={submission?.id || 1}
                initialArchitecture={submission?.architecture}
                onSaved={loadData}
              />
              <div className="flex justify-between items-center pt-8 border-t border-[#D9DAD6] mt-10">
                <button
                  type="button"
                  onClick={() => setActiveTab("BUILD")}
                  className="text-xs font-mono text-[#5F625F] hover:text-[#111111]"
                >
                  ← BACK TO BUILD
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("DECISIONS")}
                  className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
                >
                  DECISION RECORDS →
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: DECISIONS */}
          {activeTab === "DECISIONS" && (
            <div>
              <DecisionEditor
                submissionId={submission?.id || 1}
                initialDecisions={submission?.decisions || []}
                onDecisionAdded={loadData}
              />
              <div className="flex justify-between items-center pt-8 border-t border-[#D9DAD6] mt-10">
                <button
                  type="button"
                  onClick={() => setActiveTab("ARCHITECTURE")}
                  className="text-xs font-mono text-[#5F625F] hover:text-[#111111]"
                >
                  ← BACK TO ARCHITECTURE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("EVIDENCE")}
                  className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
                >
                  EVIDENCE REGISTRY →
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: EVIDENCE */}
          {activeTab === "EVIDENCE" && (
            <div>
              <EvidenceManager
                submissionId={submission?.id || 1}
                initialEvidence={submission?.evidence || []}
                onEvidenceAdded={loadData}
              />
              <div className="flex justify-between items-center pt-8 border-t border-[#D9DAD6] mt-10">
                <button
                  type="button"
                  onClick={() => setActiveTab("DECISIONS")}
                  className="text-xs font-mono text-[#5F625F] hover:text-[#111111]"
                >
                  ← BACK TO DECISIONS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("DEFENSE")}
                  className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
                >
                  DEFENSE PROTOCOL →
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: DEFENSE */}
          {activeTab === "DEFENSE" && (
            <div>
              <DefenseInterview
                questions={submission?.defense_questions || [
                  { id: 1, question: "Explain how your leader election prevents split-brain during asymmetric network partitioning." },
                  { id: 2, question: "What is your fsync batching strategy for durability vs latency trade-offs?" },
                ]}
                onAnswerSaved={loadData}
              />
              <div className="flex justify-between items-center pt-8 border-t border-[#D9DAD6] mt-10">
                <button
                  type="button"
                  onClick={() => setActiveTab("EVIDENCE")}
                  className="text-xs font-mono text-[#5F625F] hover:text-[#111111]"
                >
                  ← BACK TO EVIDENCE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("VERIFICATION")}
                  className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold"
                >
                  VERIFICATION HARNESS →
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: VERIFICATION */}
          {activeTab === "VERIFICATION" && (
            <div className="space-y-8">
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8 space-y-6">
                <span className="font-mono text-xs uppercase text-[#5F625F] tracking-widest block mb-2">
                  VERIFICATION HARNESS
                </span>
                <h3 className="text-xl font-bold uppercase text-[#111111]">
                  Automated Chaos & Integrity Evaluation
                </h3>
                <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed">
                  Submitting triggers the containerized evaluation harness. Your code will be subjected to chaos partition tests, concurrency stress testing, and benchmark SLA verification.
                </p>

                {verificationResult ? (
                  <div className="p-6 bg-[#F7F7F5] border border-[#D9DAD6] font-mono text-xs space-y-4">
                    <div className="flex justify-between items-baseline border-b border-[#D9DAD6] pb-3">
                      <span className="font-bold text-[#111111]">HARNESS RESULT:</span>
                      <StatusLabel
                        label={verificationResult.status || "PASSED"}
                        variant="verified"
                      />
                    </div>
                    <div>
                      <span className="text-[#5F625F]">CONFIDENCE SCORE: </span>
                      <span className="font-bold text-[#087EA4]">
                        {verificationResult.confidence_score || 94} / 100
                      </span>
                    </div>
                    {verificationResult.eval_details && (
                      <div>
                        <span className="text-[#5F625F] block mb-1">EVALUATION DETAILS:</span>
                        <pre className="text-[#111111] whitespace-pre-wrap">
                          {verificationResult.eval_details}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-[#F7F7F5] border border-[#D9DAD6] font-mono text-xs text-[#5F625F]">
                    NO HARNESS EXECUTION RUN YET. CLICK BELOW TO TRIGGER AUTOMATED TEST HARNESS.
                  </div>
                )}

                <div className="pt-4 border-t border-[#D9DAD6] flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmitVerification}
                    disabled={verifying}
                    className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-6 py-3 font-mono text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
                  >
                    {verifying ? "RUNNING HARNESS..." : "SUBMIT FOR VERIFICATION →"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </EditorialContainer>
    </div>
  );
}
