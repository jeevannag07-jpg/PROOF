"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  EditorialContainer,
  EditorialSection,
  EditorialDivider,
  TechnicalRow,
  MetadataLine,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";

export default function HomePage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await api.getChallenges({ sort: "POPULAR" });
        setMissions(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err) {
        console.error("Failed to load featured challenges:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Editorial Masthead */}
        <header className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-widest">
            <span>PROOF // ENGINEERING PUBLICATION</span>
            <span>ISSUE 001 // REPUTATION ARCHITECTURE</span>
            <span>VERIFIED CAPABILITY NETWORK</span>
          </div>

          <div className="mt-10 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              CAPABILITY<br />
              IS DEMONSTRATED,<br />
              NOT CLAIMED.
            </h1>

            <p className="mt-8 text-base sm:text-xl text-[#5F625F] leading-relaxed max-w-2xl font-normal">
              PROOF evaluates software engineering capability through containerized production missions,
              architectural defense, and verifiable execution evidence.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <InlineAction
                label="EXPLORE MISSIONS"
                href="/missions"
                variant="solid"
                size="md"
              />
              <InlineAction
                label="VIEW TALENT REGISTRY"
                href="/talent"
                variant="outline"
                size="md"
              />
            </div>

            <div className="mt-12">
              <MetadataLine
                items={[
                  { label: "STANDARD", value: "EVIDENCE-DRIVEN VERIFICATION" },
                  { label: "DOMAINS", value: "DISTRIBUTED SYSTEMS / ML / EMBEDDED" },
                  { label: "CONSENSUS", value: "PEER & HARDWARE BENCHMARKS" },
                ]}
              />
            </div>
          </div>
        </header>

        {/* Working Archive Section */}
        <EditorialSection
          number="01"
          title="WORKING ARCHIVE"
          description="Active technical missions currently open for solution, architectural documentation, and verification."
          action={
            <InlineAction
              label="ALL MISSIONS"
              href="/missions"
              variant="text"
              size="sm"
            />
          }
        >
          {loading ? (
            <div className="py-12 font-mono text-xs text-[#5F625F] animate-pulse">
              LOADING TECHNICAL ARCHIVE...
            </div>
          ) : missions.length > 0 ? (
            <div className="space-y-0">
              {missions.map((m, idx) => (
                <TechnicalRow
                  key={m.id}
                  index={idx + 1}
                  title={m.title}
                  subtitle={m.problem_statement || m.description}
                  tags={[
                    m.domain || "SYSTEMS",
                    m.difficulty || "INTERMEDIATE",
                    m.estimated_time || "4–6H",
                  ]}
                  status={{
                    label: m.difficulty === "ADVANCED" ? "ADVANCED" : "OPEN",
                    variant: m.difficulty === "ADVANCED" ? "xp" : "verified",
                  }}
                  actionLabel="VIEW BRIEF"
                  href={`/missions/${m.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              <TechnicalRow
                index="001"
                title="Distributed Consensus Engine (Raft Protocol)"
                subtitle="Implement leader election, log replication, and asynchronous snapshotting under network partitions."
                tags={["DISTRIBUTED SYSTEMS", "GO", "HARDWARE-IN-LOOP"]}
                status={{ label: "VERIFIED", variant: "verified" }}
                actionLabel="VIEW PROOF"
                href="/missions/1"
              />
              <TechnicalRow
                index="002"
                title="Real-Time Event Processing Pipeline"
                subtitle="Build a low-latency sliding-window analytics engine with Redis Streams and backpressure management."
                tags={["STREAMING", "PYTHON", "REDIS"]}
                status={{ label: "UNDER REVIEW", variant: "under-review" }}
                actionLabel="VIEW"
                href="/missions/2"
              />
              <TechnicalRow
                index="003"
                title="Document Intelligence & Vector Search Pipeline"
                subtitle="High-throughput chunking, dense retrieval, and HNSW graph indexing for technical documentation."
                tags={["NLP", "PYTHON", "VECTOR SEARCH"]}
                status={{ label: "VERIFIED", variant: "verified" }}
                actionLabel="VIEW PROOF"
                href="/missions/3"
              />
            </div>
          )}
        </EditorialSection>

        {/* Product Loop: 01 BUILD -> 02 PROVE -> 03 VERIFY -> 04 SHOW -> 05 DISCOVER */}
        <EditorialSection
          number="02"
          title="THE VERIFICATION METHODOLOGY"
          description="How technical capability moves from raw engineering effort to verified reputation."
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-4">
            <div className="border-t border-[#D9DAD6] pt-4">
              <span className="font-mono text-xs text-[#5F625F] block mb-2">01 // BUILD</span>
              <h3 className="font-bold text-base text-[#111111] uppercase mb-2">SOLVE MISSIONS</h3>
              <p className="text-xs text-[#5F625F] leading-relaxed">
                Take on concrete engineering problems with real SLAs, hardware constraints, and failure modes.
              </p>
            </div>

            <div className="border-t border-[#D9DAD6] pt-4">
              <span className="font-mono text-xs text-[#5F625F] block mb-2">02 // PROVE</span>
              <h3 className="font-bold text-base text-[#111111] uppercase mb-2">RECORD EVIDENCE</h3>
              <p className="text-xs text-[#5F625F] leading-relaxed">
                Document architecture decisions, record benchmark logs, and explain non-trivial trade-offs.
              </p>
            </div>

            <div className="border-t border-[#D9DAD6] pt-4">
              <span className="font-mono text-xs text-[#5F625F] block mb-2">03 // VERIFY</span>
              <h3 className="font-bold text-base text-[#111111] uppercase mb-2">DEFEND CODE</h3>
              <p className="text-xs text-[#5F625F] leading-relaxed">
                Undergo rigorous automated stress testing and technical defense review from verified domain peers.
              </p>
            </div>

            <div className="border-t border-[#D9DAD6] pt-4">
              <span className="font-mono text-xs text-[#5F625F] block mb-2">04 // SHOW</span>
              <h3 className="font-bold text-base text-[#111111] uppercase mb-2">TECHNICAL REELS</h3>
              <p className="text-xs text-[#5F625F] leading-relaxed">
                Share concise video walk-throughs demonstrating system architecture, live terminals, and design decisions.
              </p>
            </div>

            <div className="border-t border-[#D9DAD6] pt-4">
              <span className="font-mono text-xs text-[#5F625F] block mb-2">05 // DISCOVER</span>
              <h3 className="font-bold text-base text-[#111111] uppercase mb-2">TALENT REGISTRY</h3>
              <p className="text-xs text-[#5F625F] leading-relaxed">
                Engineering teams and founders identify candidates based strictly on demonstrated technical proof.
              </p>
            </div>
          </div>
        </EditorialSection>

        {/* Final Editorial Call to Action */}
        <div className="mt-20 pt-16 pb-12 border-t border-[#D9DAD6]">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-3">
              GET INVOLVED
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] uppercase leading-tight mb-4">
              BUILD SOMETHING WORTH VERIFYING.
            </h2>
            <p className="text-sm sm:text-base text-[#5F625F] leading-relaxed mb-8">
              Explore open engineering missions or review existing verified architectures.
            </p>
            <InlineAction
              label="EXPLORE MISSIONS"
              href="/missions"
              variant="solid"
              size="md"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-[#D9DAD6] font-mono text-xs text-[#5F625F] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>PROOF © 2026 // DEMONSTRATED TECHNICAL CAPABILITY</div>
          <div className="flex gap-6">
            <Link href="/missions" className="hover:text-[#111111]">MISSIONS</Link>
            <Link href="/talent" className="hover:text-[#111111]">TALENT</Link>
            <Link href="/reels" className="hover:text-[#111111]">REELS</Link>
            <Link href="/design-system" className="hover:text-[#111111]">DESIGN SYSTEM</Link>
          </div>
        </footer>
      </EditorialContainer>
    </div>
  );
}
