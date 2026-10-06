"use client";

import React from "react";
import {
  EditorialContainer,
  EditorialSection,
  EditorialDivider,
  TechnicalRow,
  TechnicalTable,
  Column,
  MetadataLine,
  StatusLabel,
  EvidenceBlock,
  InlineAction,
} from "@/components/editorial";

interface TalentItem {
  id: string;
  name: string;
  handle: string;
  specialty: string;
  missionsCompleted: number;
  capabilityScore: number;
  confidence: "HIGH" | "VERIFIED" | "INITIAL";
}

const TALENT_REGISTRY: TalentItem[] = [
  {
    id: "01",
    name: "Jeevan N.",
    handle: "jeevan",
    specialty: "Distributed Systems & Storage",
    missionsCompleted: 17,
    capabilityScore: 86,
    confidence: "VERIFIED",
  },
  {
    id: "02",
    name: "Alex T.",
    handle: "alex_t",
    specialty: "Kernel Bypass & Low Latency Networking",
    missionsCompleted: 24,
    capabilityScore: 94,
    confidence: "VERIFIED",
  },
  {
    id: "03",
    name: "Rachel A.",
    handle: "rachel_a",
    specialty: "Machine Learning Compilers & Triton",
    missionsCompleted: 12,
    capabilityScore: 79,
    confidence: "HIGH",
  },
  {
    id: "04",
    name: "Marcus V.",
    handle: "marcus_v",
    specialty: "Formal Verification & Cryptographic Protocols",
    missionsCompleted: 9,
    capabilityScore: 91,
    confidence: "VERIFIED",
  },
];

export default function DesignSystemPage() {
  const tableColumns: Column<TalentItem>[] = [
    {
      key: "engineer",
      header: "ENGINEER",
      render: (item) => (
        <div>
          <span className="font-semibold text-[#111111] block">{item.name}</span>
          <span className="font-mono text-[11px] text-[#5F625F]">@{item.handle}</span>
        </div>
      ),
    },
    {
      key: "specialty",
      header: "SPECIALTY",
      render: (item) => (
        <span className="text-xs sm:text-sm text-[#111111]">{item.specialty}</span>
      ),
    },
    {
      key: "missionsCompleted",
      header: "VERIFIED MISSIONS",
      align: "center",
      render: (item) => (
        <span className="font-mono text-xs text-[#111111] font-medium">
          {item.missionsCompleted}
        </span>
      ),
    },
    {
      key: "capabilityScore",
      header: "CAPABILITY",
      align: "center",
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-[#087EA4]">
          {item.capabilityScore} / 100
        </span>
      ),
    },
    {
      key: "confidence",
      header: "STATUS",
      align: "center",
      render: (item) => (
        <StatusLabel
          label={item.confidence}
          variant={item.confidence === "VERIFIED" ? "verified" : "in-progress"}
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
          href={`/profile/${item.handle}`}
          variant="text"
          size="sm"
        />
      ),
    },
  ];

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Publication Masthead */}
        <header className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-widest">
            <span>PROOF SPECIFICATION</span>
            <span>REFERENCE DESIGN SYSTEM V2.0</span>
            <span>STANDARDS // FOUNDATION</span>
          </div>

          <div className="mt-8 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              DEMONSTRATED TECHNICAL CAPABILITY
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#5F625F] leading-relaxed max-w-2xl font-normal">
              An editorial engineering platform where technical ability is proven
              through production-grade missions, architectural defense, and verifiable execution evidence.
            </p>

            <div className="mt-6">
              <MetadataLine
                items={[
                  { label: "GRID", value: "12-COL EDITORIAL" },
                  { label: "CANVAS", value: "#F7F7F5" },
                  { label: "SURFACE", value: "#FFFFFF" },
                  { label: "TYPE", value: "INTER + ROBOTO MONO" },
                ]}
              />
            </div>
          </div>
        </header>

        {/* Section 01: Typographic Scale */}
        <EditorialSection
          number="01"
          title="TYPOGRAPHY SYSTEM"
          description="High-contrast editorial typography utilizing Inter for clear prose and hierarchy, with Roboto Mono dedicated to technical metadata, identifiers, and telemetry."
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline py-4 border-b border-[#D9DAD6]">
            <div className="md:col-span-3 font-mono text-xs text-[#5F625F] uppercase tracking-wider">
              DISPLAY HEADING
            </div>
            <div className="md:col-span-9">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] uppercase tracking-tight">
                Architectural Invariance & Distributed Consensus
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline py-4 border-b border-[#D9DAD6]">
            <div className="md:col-span-3 font-mono text-xs text-[#5F625F] uppercase tracking-wider">
              SECTION HEADING
            </div>
            <div className="md:col-span-9">
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] uppercase tracking-tight">
                009 // Distributed Consensus Engine
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline py-4 border-b border-[#D9DAD6]">
            <div className="md:col-span-3 font-mono text-xs text-[#5F625F] uppercase tracking-wider">
              EDITORIAL PROSE
            </div>
            <div className="md:col-span-9 text-base text-[#111111] leading-relaxed max-w-2xl">
              Software engineering capability cannot be captured by superficial interview questions
              or static resume bullet points. PROOF provides isolated, containerized environments
              subjected to real-world chaos engineering, benchmark suites, and peer code defense.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline py-4 border-b border-[#D9DAD6]">
            <div className="md:col-span-3 font-mono text-xs text-[#5F625F] uppercase tracking-wider">
              TECHNICAL METADATA
            </div>
            <div className="md:col-span-9">
              <MetadataLine
                items={[
                  "MISSION 009",
                  "MANUFACTURING",
                  "ADVANCED",
                  "SUBMISSION 018",
                  "LATENCY P99: 4.2MS",
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline py-4">
            <div className="md:col-span-3 font-mono text-xs text-[#5F625F] uppercase tracking-wider">
              CAPTION / FOOTNOTE
            </div>
            <div className="md:col-span-9 text-xs text-[#5F625F] font-mono leading-normal">
              EVIDENCE VERIFIED BY LAB TEST SUITE V4.18 // ALL ARTIFACTS CRYPTOGRAPHICALLY DIGESTED
            </div>
          </div>
        </EditorialSection>

        {/* Section 02: Technical Rows */}
        <EditorialSection
          number="02"
          title="TECHNICAL ROWS"
          description="Information density achieved through typography, horizontal dividers, and precise tabular alignment — eliminating bloated cards."
          action={
            <InlineAction
              label="EXPLORE ALL MISSIONS"
              href="/missions"
              variant="outline"
              size="sm"
            />
          }
        >
          <div className="space-y-0">
            <TechnicalRow
              index="009"
              title="Distributed Consensus Engine (Raft Protocol)"
              subtitle="Implement leader election, log replication, and asynchronous snapshotting under network partitions."
              tags={["DISTRIBUTED SYSTEMS", "GO", "HARDWARE-IN-LOOP", "ADVANCED"]}
              status={{ label: "VERIFIED", variant: "verified" }}
              actionLabel="START MISSION"
              href="/missions/9"
            />

            <TechnicalRow
              index="014"
              title="Zero-Copy LSM Storage Engine with Concurrent Compaction"
              subtitle="Build a high-throughput key-value storage engine using memory-mapped SSTables and leveled compaction."
              tags={["STORAGE", "RUST", "IO_URING", "EXPERT"]}
              status={{ label: "IN PROGRESS", variant: "in-progress" }}
              actionLabel="CONTINUE"
              href="/workspace/14"
            />

            <TechnicalRow
              index="018"
              title="Predict Equipment Maintenance Requirements"
              subtitle="Real-time multi-sensor telemetry pipeline detecting mechanical degradation before bearing failure."
              tags={["MANUFACTURING", "PYTHON", "PYTORCH", "INTERMEDIATE"]}
              status={{ label: "UNDER REVIEW", variant: "under-review" }}
              actionLabel="VIEW PROOF"
              href="/projects/18"
            />

            <TechnicalRow
              index="022"
              title="Kernel-Bypass Packet Processing Pipeline (eBPF/XDP)"
              subtitle="Filter and route 10Gbps line-rate network traffic with sub-microsecond latency guarantees."
              tags={["NETWORKING", "C", "EBPF", "ADVANCED"]}
              status={{ label: "SUBMITTED", variant: "submitted" }}
              actionLabel="VIEW PROOF"
              href="/projects/22"
            />
          </div>
        </EditorialSection>

        {/* Section 03: Evidence Block */}
        <EditorialSection
          number="03"
          title="EVIDENCE BLOCK"
          description="Restrained containment utilized only when structured technical proof requires architectural isolation, decision records, or reviewer verification."
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <EvidenceBlock
                category="ARCHITECTURE DECISION RECORD // MISSION 009"
                title="Leader Election Under Asymmetric Network Partitioning"
                metadata={[
                  { label: "AUTHOR", value: "Jeevan N." },
                  { label: "STATUS", value: "VERIFIED BY REVIEWER" },
                  { label: "PROTOCOL", value: "RAFT V1.4" },
                ]}
                footer={
                  <>
                    <span>ARTIFACT ID: ADR-009-ELEC</span>
                    <span>CRYPTOGRAPHIC SIGNATURE: 0x82f9...c41a</span>
                  </>
                }
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-xs uppercase text-[#5F625F] tracking-wider mb-1">
                      Context & Problem Statement
                    </h4>
                    <p className="text-sm leading-relaxed">
                      In a 5-node cluster, a partitioned leader could continue broadcasting heartbeats to a subset of nodes,
                      while the minority partition triggers uncoordinated election cycles that disrupt term increment monotonicity.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase text-[#5F625F] tracking-wider mb-1">
                      Design Decision
                    </h4>
                    <p className="text-sm leading-relaxed">
                      Implemented a Pre-Vote phase (Ongaro §9.6). Before incrementing its local currentTerm, a candidate node
                      broadcasts a PreVote RPC. Peers only grant PreVote if the candidate’s log is up-to-date and the peer has not
                      received a heartbeat within minimum election timeout (150ms).
                    </p>
                  </div>

                  <div className="bg-[#F7F7F5] border border-[#D9DAD6] p-4 font-mono text-xs text-[#111111]">
                    <div className="text-[#5F625F] mb-2">// Chaos Verification Test Suite: 500 Iterations</div>
                    <div>test_asymmetric_partition_prevote ... <span className="text-[#087F5B] font-bold">PASSED (0.42s)</span></div>
                    <div>test_split_brain_prevention          ... <span className="text-[#087F5B] font-bold">PASSED (0.88s)</span></div>
                    <div>test_snapshot_compaction_recovery    ... <span className="text-[#087F5B] font-bold">PASSED (1.14s)</span></div>
                    <div className="text-[#5F625F] mt-2">Zero lost state machine transitions across 10,000 injected partition events.</div>
                  </div>
                </div>
              </EvidenceBlock>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6">
                <span className="font-mono text-[10px] text-[#5F625F] uppercase tracking-widest block mb-2">
                  VERIFICATION CRITERIA
                </span>
                <h4 className="font-bold text-sm uppercase text-[#111111] mb-4">
                  Expert Review Checklist
                </h4>
                <ul className="space-y-3 font-mono text-xs text-[#5F625F]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#087F5B] rounded-full shrink-0"></span>
                    <span className="text-[#111111]">Deterministic State Machine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#087F5B] rounded-full shrink-0"></span>
                    <span className="text-[#111111]">Pre-Vote Phase Adherence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#087F5B] rounded-full shrink-0"></span>
                    <span className="text-[#111111]">Disk Fsync Durability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#087F5B] rounded-full shrink-0"></span>
                    <span className="text-[#111111]">Defense Questioning Passed</span>
                  </li>
                </ul>
              </div>

              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6">
                <span className="font-mono text-[10px] text-[#5F625F] uppercase tracking-widest block mb-2">
                  CAPABILITY GAIN
                </span>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold font-mono text-[#087EA4]">+12 INDEX</span>
                  <span className="font-mono text-xs text-[#A16207]">+450 XP</span>
                </div>
                <p className="text-xs text-[#5F625F] leading-relaxed">
                  Advances distributed systems capability score towards Tier 1 Verified Senior status.
                </p>
              </div>
            </div>
          </div>
        </EditorialSection>

        {/* Section 04: Status & Actions */}
        <EditorialSection
          number="04"
          title="STATUS LABELS & INLINE ACTIONS"
          description="Restrained semantic colors and publication-style arrow triggers. No glowing badges, no gradient buttons, no neon borders."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Status Labels */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase text-[#5F625F] tracking-wider mb-4">
                Semantic Status Indicators
              </h4>
              <div className="flex flex-wrap gap-4 items-center">
                <StatusLabel label="VERIFIED" variant="verified" />
                <StatusLabel label="IN PROGRESS" variant="in-progress" />
                <StatusLabel label="UNDER REVIEW" variant="under-review" />
                <StatusLabel label="SUBMITTED" variant="submitted" />
                <StatusLabel label="CAPABILITY 86" variant="capability" />
                <StatusLabel label="XP +450" variant="xp" />
                <StatusLabel label="FAILED RUNNER" variant="error" />
                <StatusLabel label="ARCHIVED" variant="neutral" />
              </div>
            </div>

            {/* Inline Actions */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase text-[#5F625F] tracking-wider mb-4">
                Editorial Action Triggers
              </h4>
              <div className="flex flex-wrap items-center gap-6">
                <InlineAction label="START MISSION" href="#" variant="text" />
                <InlineAction label="VIEW PROOF" href="#" variant="text" />
                <InlineAction label="CONTINUE" href="#" variant="solid" />
                <InlineAction label="DOWNLOAD DOSSIER" href="#" variant="outline" />
              </div>
            </div>
          </div>
        </EditorialSection>

        {/* Section 05: Technical Table / Registry */}
        <EditorialSection
          number="05"
          title="TECHNICAL REGISTRY"
          description="Tabular engineering registry for verified talent, project audits, and benchmark results."
        >
          <TechnicalTable
            columns={tableColumns}
            data={TALENT_REGISTRY}
            keyExtractor={(item) => item.id}
          />
        </EditorialSection>

        {/* Publication Colophon / Footer */}
        <footer className="mt-20 pt-8 border-t border-[#D9DAD6] font-mono text-xs text-[#5F625F] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span>PROOF © 2026 // ALL RIGHTS RESERVED</span>
          </div>
          <div className="flex gap-6">
            <span>CANVAS: #F7F7F5</span>
            <span>SURFACE: #FFFFFF</span>
            <span>TEXT: #111111</span>
          </div>
        </footer>
      </EditorialContainer>
    </div>
  );
}
