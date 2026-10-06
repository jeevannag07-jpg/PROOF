"use client";

import React, { useState } from "react";
import { Plus, Check, Scale } from "lucide-react";
import { api } from "@/lib/api";

interface TechnicalDecision {
  id?: number;
  title: string;
  decision: string;
  context: string;
  alternatives: string;
  tradeoffs: string;
  result: string;
}

interface DecisionEditorProps {
  submissionId: number;
  initialDecisions?: TechnicalDecision[];
  onDecisionAdded?: () => void;
}

export default function DecisionEditor({
  submissionId,
  initialDecisions = [],
  onDecisionAdded,
}: DecisionEditorProps) {
  const [decisions, setDecisions] = useState<TechnicalDecision[]>(initialDecisions);
  const [title, setTitle] = useState("");
  const [decision, setDecision] = useState("");
  const [context, setContext] = useState("");
  const [alternatives, setAlternatives] = useState("");
  const [tradeoffs, setTradeoffs] = useState("");
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !decision || !context) return;
    setSubmitting(true);
    try {
      const payload = {
        title,
        decision,
        context,
        alternatives,
        tradeoffs,
        result,
      };
      const res = await api.addDecision(submissionId, payload);
      setDecisions([...decisions, { ...payload, id: res.id }]);
      setTitle("");
      setDecision("");
      setContext("");
      setAlternatives("");
      setTradeoffs("");
      setResult("");
      setShowForm(false);
      if (onDecisionAdded) onDecisionAdded();
    } catch (err) {
      console.error("Failed to add decision:", err);
      alert("Failed to record decision.");
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
            ARCHITECTURE DECISION RECORDS
          </span>
          <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
            Technical Decisions & Non-Trivial Trade-Offs
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="self-start sm:self-auto bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showForm ? "CANCEL" : "RECORD NEW DECISION"}</span>
        </button>
      </div>

      {/* Decision Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8 space-y-4"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block mb-2">
            NEW DECISION RECORD
          </span>
          <div>
            <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
              DECISION TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Asynchronous Snapshotting via Copy-On-Write Fork"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs sm:text-sm font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                CONTEXT & PROBLEM *
              </label>
              <textarea
                required
                rows={3}
                placeholder="What operational condition or scale boundary prompted this choice?"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                ACCEPTED DECISION *
              </label>
              <textarea
                required
                rows={3}
                placeholder="The precise technical implementation chosen."
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                DISCARDED ALTERNATIVES
              </label>
              <textarea
                rows={3}
                placeholder="What other designs or libraries were evaluated and rejected?"
                value={alternatives}
                onChange={(e) => setAlternatives(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-xs uppercase text-[#5F625F] block mb-1">
                ENGINEERING TRADE-OFFS
              </label>
              <textarea
                rows={3}
                placeholder="What latency, memory, or complexity cost was accepted?"
                value={tradeoffs}
                onChange={(e) => setTradeoffs(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-2.5 text-xs font-mono text-[#111111] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#D9DAD6] flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-6 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? "RECORDING..." : "COMMIT DECISION RECORD"}
            </button>
          </div>
        </form>
      )}

      {/* Decision Records List */}
      {decisions.length === 0 ? (
        <div className="p-12 border border-[#D9DAD6] bg-[#FFFFFF] text-center font-mono text-xs text-[#5F625F]">
          NO TECHNICAL DECISION RECORDS YET RECORDED. CLICK ABOVE TO ADD YOUR FIRST ADR.
        </div>
      ) : (
        <div className="space-y-6">
          {decisions.map((d, idx) => (
            <div
              key={d.id || idx}
              className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-3 border-b border-[#D9DAD6] gap-2 mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold text-[#5F625F]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold uppercase text-[#111111] tracking-tight">
                    {d.title}
                  </h4>
                </div>
                <span className="font-mono text-[11px] text-[#087F5B] uppercase">
                  RECORDED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <span className="font-mono text-[11px] uppercase text-[#5F625F] block mb-1">
                    CONTEXT
                  </span>
                  <p className="text-[#111111] leading-relaxed">{d.context}</p>
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase text-[#5F625F] block mb-1">
                    DECISION
                  </span>
                  <p className="text-[#111111] leading-relaxed">{d.decision}</p>
                </div>
                {d.alternatives && (
                  <div>
                    <span className="font-mono text-[11px] uppercase text-[#5F625F] block mb-1">
                      ALTERNATIVES CONSIDERED
                    </span>
                    <p className="text-[#5F625F] leading-relaxed">{d.alternatives}</p>
                  </div>
                )}
                {d.tradeoffs && (
                  <div>
                    <span className="font-mono text-[11px] uppercase text-[#5F625F] block mb-1">
                      ACCEPTED TRADE-OFFS
                    </span>
                    <p className="text-[#5F625F] leading-relaxed">{d.tradeoffs}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
