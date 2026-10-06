"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";

interface Question {
  id: number;
  question: string;
  answer?: string;
}

interface DefenseInterviewProps {
  questions: Question[];
  onAnswerSaved?: () => void;
}

export default function DefenseInterview({
  questions = [],
  onAnswerSaved,
}: DefenseInterviewProps) {
  const [answers, setAnswers] = useState<Record<number, string>>(
    questions.reduce((acc, q) => {
      acc[q.id] = q.answer || "";
      return acc;
    }, {} as Record<number, string>)
  );

  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  const handleSaveAnswer = async (qId: number) => {
    setSavingId(qId);
    try {
      await api.answerDefenseQuestion(qId, answers[qId]);
      setSavedId(qId);
      if (onAnswerSaved) onAnswerSaved();
      setTimeout(() => setSavedId(null), 2500);
    } catch (err) {
      console.error("Save defense error:", err);
      alert("Failed to save answer.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notice Banner */}
      <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block mb-1">
          PROTOCOL NOTE
        </span>
        <h4 className="font-bold text-sm uppercase text-[#111111] mb-2">
          Technical Defense & Engineering Invariance
        </h4>
        <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed">
          Demonstrated capability requires that you deeply understand, debug, modify, and defend every engineering trade-off in your submitted architecture. Reviewers evaluate your reasoning under edge cases and failure modes.
        </p>
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="p-12 border border-[#D9DAD6] bg-[#FFFFFF] text-center font-mono text-xs text-[#5F625F]">
          DEFENSE QUESTIONS WILL GENERATE ONCE INITIAL ARCHITECTURE RECORD IS COMMITTED.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 space-y-4"
            >
              <div className="flex items-baseline justify-between border-b border-[#D9DAD6] pb-3">
                <span className="font-mono text-xs font-bold text-[#5F625F]">
                  QUESTION {String(idx + 1).padStart(2, "0")}
                </span>
                {savedId === q.id && (
                  <span className="font-mono text-xs text-[#087F5B] font-bold">
                    ✓ DEFENSE ANSWER SAVED
                  </span>
                )}
              </div>

              <p className="font-mono text-xs sm:text-sm font-semibold text-[#111111] leading-relaxed">
                {q.question}
              </p>

              <div>
                <textarea
                  rows={4}
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  placeholder="Detail your architectural reasoning, invariants, and fallback mechanisms..."
                  className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs sm:text-sm font-mono text-[#111111] placeholder-[#5F625F] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveAnswer(q.id)}
                  disabled={savingId === q.id}
                  className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-5 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {savingId === q.id ? "SAVING..." : "SAVE ANSWER"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
