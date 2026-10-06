"use client";

import React, { useState } from "react";
import { Plus, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";

interface EvidenceItem {
  id?: number;
  type: string;
  title: string;
  url?: string;
  description?: string;
  verification_status?: string;
  metrics_data?: string;
}

interface EvidenceManagerProps {
  submissionId: number;
  initialEvidence?: EvidenceItem[];
  onEvidenceAdded?: () => void;
}

const EVIDENCE_TYPES = [
  "BENCHMARK",
  "REPOSITORY",
  "TEST",
  "DEPLOYMENT",
  "LIVE_DEMO",
  "ARCHITECTURE",
  "SCREENSHOT",
];

export default function EvidenceManager({
  submissionId,
  initialEvidence = [],
  onEvidenceAdded,
}: EvidenceManagerProps) {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(initialEvidence);
  const [type, setType] = useState("BENCHMARK");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [metrics, setMetrics] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);
    try {
      const payload = {
        type,
        title,
        url,
        description,
        metrics_data: metrics,
      };
      const res = await api.addEvidence(submissionId, payload);
      setEvidenceList([...evidenceList, { ...payload, id: res.id, verification_status: "RECORDED" }]);
      setTitle("");
      setUrl("");
      setDescription("");
      setMetrics("");
      setShowForm(false);
      if (onEvidenceAdded) onEvidenceAdded();
    } catch (err) {
      console.error("Failed to add evidence:", err);
      alert("Failed to submit evidence record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2">
        <div>
          <span className="font-mono text-xs uppercase text-[#5F625F] tracking-widest block">
            VERIFIABLE TECHNICAL ARTIFACTS
          </span>
          <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
            Evidence Registry & Benchmarks
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="self-start sm:self-auto bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showForm ? "CANCEL" : "ATTACH EVIDENCE"}</span>
        </button>
      </div>

      {/* Evidence Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8 space-y-4"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block mb-2">
            ATTACH NEW EVIDENCE ARTIFACT
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                EVIDENCE TYPE
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111]"
              >
                {EVIDENCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                TITLE / ARTIFACT LABEL *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Locust Chaos Benchmark (5000 QPS Sustained)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
              RESOURCE URL / REPO COMMIT
            </label>
            <input
              type="text"
              placeholder="https://github.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
              BENCHMARK METRICS / LOG SNIPPET
            </label>
            <textarea
              rows={4}
              placeholder="Paste terminal stdout, p99 latency stats, or benchmark output..."
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
              DESCRIPTIVE CONTEXT
            </label>
            <textarea
              rows={2}
              placeholder="Summary of benchmark harness conditions and verification methodology..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#D9DAD6] flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-6 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? "RECORDING..." : "COMMIT EVIDENCE ARTIFACT"}
            </button>
          </div>
        </form>
      )}

      {/* Evidence List */}
      {evidenceList.length === 0 ? (
        <div className="p-12 border border-[#D9DAD6] bg-[#FFFFFF] text-center font-mono text-xs text-[#5F625F]">
          NO EVIDENCE ATTACHED YET. ATTACH BENCHMARK LOGS, REPOSITORY COMMITS, OR TEST OUTPUTS ABOVE.
        </div>
      ) : (
        <div className="space-y-4">
          {evidenceList.map((e, idx) => (
            <div
              key={e.id || idx}
              className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#D9DAD6] pb-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[#087EA4] uppercase font-bold">
                    [{e.type}]
                  </span>
                  <h4 className="text-base font-bold uppercase text-[#111111]">
                    {e.title}
                  </h4>
                </div>
                {e.url && (
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-[#111111] hover:text-[#5F625F] inline-flex items-center gap-1 underline"
                  >
                    <span>OPEN LINK</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {e.description && (
                <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed">
                  {e.description}
                </p>
              )}

              {e.metrics_data && (
                <div className="p-3 bg-[#F7F7F5] border border-[#D9DAD6] font-mono text-xs text-[#111111] overflow-x-auto whitespace-pre-wrap">
                  {e.metrics_data}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
