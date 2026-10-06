"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  EditorialContainer,
  EditorialDivider,
  TechnicalRow,
  TechnicalTable,
  Column,
  MetadataLine,
  StatusLabel,
  InlineAction,
} from "@/components/editorial";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOpps = async () => {
    setLoading(true);
    try {
      const data = await api.getOpportunities();
      setOpportunities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Opportunities load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpps();
  }, [user]);

  const columns: Column<any>[] = [
    {
      key: "role",
      header: "ROLE",
      render: (item) => (
        <div>
          <span className="font-bold text-[#111111] uppercase tracking-tight block text-sm sm:text-base">
            {item.title}
          </span>
          <span className="font-mono text-xs text-[#5F625F]">
            {item.description ? item.description.slice(0, 60) + "..." : "Systems Engineering"}
          </span>
        </div>
      ),
    },
    {
      key: "organization",
      header: "ORGANIZATION",
      render: (item) => (
        <span className="text-xs sm:text-sm text-[#111111] font-medium font-mono uppercase">
          {item.company || "Enterprise Infrastructure Labs"}
        </span>
      ),
    },
    {
      key: "type",
      header: "TYPE",
      align: "center",
      render: (item) => (
        <span className="font-mono text-xs text-[#111111] font-medium uppercase">
          {item.type || item.commitment || "FULL-TIME"}
        </span>
      ),
    },
    {
      key: "compensation",
      header: "COMPENSATION",
      align: "center",
      render: (item) => (
        <span className="font-mono text-xs text-[#087EA4] font-semibold">
          {item.salary_range || "$180K – $240K"}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      align: "center",
      render: (item) => (
        <StatusLabel
          label={item.status || "OPEN"}
          variant={item.status === "FILLED" ? "neutral" : "verified"}
        />
      ),
    },
    {
      key: "action",
      header: "ACTION",
      align: "right",
      render: (item) => (
        <InlineAction
          label="DETAILS"
          href={`/talent`}
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
            <span>DIRECT ENGAGEMENT</span>
            <span>TECHNICAL ROLES & STAFF REVIEW POSITIONS</span>
            <span>{opportunities.length} POSTINGS ACTIVE</span>
          </div>

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-none">
              OPPORTUNITIES
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#5F625F] leading-relaxed">
              Engineering positions, staff reviewer openings, and research contracts with teams hiring
              directly on proven technical capability.
            </p>
          </div>
        </header>

        {/* Technical Registry Table */}
        <div className="border-t border-[#D9DAD6]">
          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-[#5F625F] animate-pulse">
              RETRIEVING OPPORTUNITY INDEX...
            </div>
          ) : opportunities.length === 0 ? (
            <div className="space-y-0">
              <TechnicalRow
                index="001"
                title="Senior Distributed Systems Engineer"
                subtitle="Design and operate geo-replicated consensus clusters and low-latency storage engines."
                tags={["HORIZON LABS", "FULL-TIME", "$190K–$240K + EQUITY", "MIN CAPABILITY: 85"]}
                status={{ label: "OPEN", variant: "verified" }}
                actionLabel="INQUIRE"
                href="/talent"
              />
              <TechnicalRow
                index="002"
                title="Staff Verification & Security Reviewer"
                subtitle="Review cryptographic proofs, chaos tests, and technical submissions on PROOF platform."
                tags={["PROOF FOUNDATION", "CONTRACT / PART-TIME", "$150/HR", "STAFF LEVEL"]}
                status={{ label: "OPEN", variant: "capability" }}
                actionLabel="INQUIRE"
                href="/talent"
              />
              <TechnicalRow
                index="003"
                title="Machine Learning Systems Compiler Engineer"
                subtitle="Optimize tensor kernel performance with Triton, CUDA, and specialized hardware accelerators."
                tags={["NEURAL HARDWARE CORP", "FULL-TIME", "$210K–$270K", "MIN CAPABILITY: 88"]}
                status={{ label: "OPEN", variant: "verified" }}
                actionLabel="INQUIRE"
                href="/talent"
              />
            </div>
          ) : (
            <TechnicalTable
              columns={columns}
              data={opportunities}
              keyExtractor={(item) => item.id}
            />
          )}
        </div>
      </EditorialContainer>
    </div>
  );
}
