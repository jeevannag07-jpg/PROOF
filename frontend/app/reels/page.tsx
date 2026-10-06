"use client";

import React, { useState, useEffect } from "react";
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
import VideoPlayer from "@/components/reels/VideoPlayer";
import CreateReelModal from "@/components/reels/CreateReelModal";
import { Bookmark, Send, HelpCircle, Plus, ExternalLink } from "lucide-react";

export default function ReelsPage() {
  const { user } = useAuth();
  const [reels, setReels] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeType, setActiveType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isTechQuestion, setIsTechQuestion] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const reelTypes = [
    "ALL",
    "ARCHITECTURE",
    "CODE_WALKTHROUGH",
    "BENCHMARK",
    "LIVE_DEMO",
    "DEFENSE",
  ];

  const fetchReels = async () => {
    setLoading(true);
    try {
      const data = await api.getReels({
        reel_type: activeType === "ALL" ? undefined : activeType,
      });
      setReels(Array.isArray(data) ? data : []);
      setActiveIndex(0);
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, [activeType]);

  const currentReel = reels[activeIndex] || null;

  const handleSaveReel = async () => {
    if (!currentReel?.id) return;
    try {
      await api.saveReel(currentReel.id);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2500);
    } catch (err) {
      console.error("Save reel error:", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReel?.id || !commentText.trim()) return;
    try {
      const newComment = await api.addReelComment(
        currentReel.id,
        commentText.trim(),
        isTechQuestion
      );
      if (currentReel.comments) {
        currentReel.comments.push(newComment);
      } else {
        currentReel.comments = [newComment];
      }
      setCommentText("");
      setIsTechQuestion(false);
    } catch (err) {
      console.error("Add comment error:", err);
      alert("Failed to submit technical question.");
    }
  };

  return (
    <div className="py-12 md:py-20">
      <EditorialContainer>
        {/* Masthead */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9DAD6] gap-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-widest">
            <span>TECHNICAL PROOF ARCHIVE</span>
            <span>VIDEO DEMONSTRATIONS & DEFENSES</span>
            <span>{reels.length} DEMONSTRATIONS</span>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] uppercase leading-none">
                TECHNICAL REELS
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#5F625F] leading-relaxed">
                Short-form video demonstrations of real-world architecture, terminal telemetry,
                and engineering defenses. Prioritizing technical proof over social metrics.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-5 py-3 font-mono text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>RECORD NEW REEL</span>
            </button>
          </div>
        </header>

        {/* Type Filter Bar */}
        <div className="border-t border-b border-[#D9DAD6] py-3 mb-10 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#5F625F] uppercase mr-2 shrink-0">TOPIC:</span>
            {reelTypes.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-2.5 py-1 whitespace-nowrap uppercase tracking-wider transition-colors ${
                  activeType === t
                    ? "bg-[#111111] text-[#FFFFFF] font-semibold"
                    : "text-[#5F625F] hover:text-[#111111]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area: 12-Column Grid */}
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#5F625F] animate-pulse">
            RETRIEVING TECHNICAL DEMONSTRATIONS...
          </div>
        ) : !currentReel ? (
          <div className="py-20 text-center font-mono text-sm text-[#5F625F] border border-[#D9DAD6] bg-[#FFFFFF]">
            <p>NO TECHNICAL REELS CURRENTLY IN THIS CATEGORY.</p>
            <button
              onClick={() => setActiveType("ALL")}
              className="mt-4 text-xs underline text-[#111111]"
            >
              VIEW ALL REELS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Player & Technical Case Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Video Player */}
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-2">
                <div className="aspect-video bg-[#111111] relative overflow-hidden flex items-center justify-center">
                  <VideoPlayer
                    src={currentReel.video_url || currentReel.media_url}
                    poster={currentReel.thumbnail_url}
                    title={currentReel.title}
                    isActive={true}
                    aspectRatio="16:9"
                  />
                </div>
              </div>

              {/* Technical Description & Architecture */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#D9DAD6] pb-4">
                  <div>
                    <span className="font-mono text-xs text-[#087EA4] uppercase font-bold block mb-1">
                      {currentReel.reel_type || "SYSTEMS WALKTHROUGH"}
                    </span>
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">
                      {currentReel.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveReel}
                      className="border border-[#D9DAD6] hover:border-[#111111] px-3 py-1.5 font-mono text-xs text-[#111111] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{savedStatus ? "SAVED" : "SAVE"}</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#111111] leading-relaxed">
                  {currentReel.description}
                </p>

                {currentReel.code_snippet && (
                  <div>
                    <span className="font-mono text-xs uppercase text-[#5F625F] block mb-2">
                      CODE / CONFIGURATION SNIPPET
                    </span>
                    <pre className="p-4 bg-[#F7F7F5] border border-[#D9DAD6] font-mono text-xs text-[#111111] overflow-x-auto whitespace-pre-wrap">
                      {currentReel.code_snippet}
                    </pre>
                  </div>
                )}

                {/* Metadata Line */}
                <div className="pt-4 border-t border-[#D9DAD6]">
                  <MetadataLine
                    items={[
                      { label: "AUTHOR", value: currentReel.author?.name || "ENGINEER" },
                      { label: "MISSION", value: currentReel.challenge_id ? `#${currentReel.challenge_id}` : "INDEPENDENT" },
                      { label: "STATUS", value: "VERIFIED" },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Q&A Discussion & Stream Index (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Technical Q&A / Peer Reviews */}
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block mb-1">
                    PEER SCRUTINY
                  </span>
                  <h3 className="font-bold text-base uppercase text-[#111111]">
                    Technical Discussion & Questions
                  </h3>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Ask a specific architectural question or request trade-off details..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-[#F7F7F5] border border-[#D9DAD6] p-3 text-xs font-mono text-[#111111] placeholder-[#5F625F] focus:outline-none focus:border-[#111111]"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[#5F625F]">
                      <input
                        type="checkbox"
                        checked={isTechQuestion}
                        onChange={(e) => setIsTechQuestion(e.target.checked)}
                        className="rounded-none accent-[#111111]"
                      />
                      <span>Flag as Architecture Question</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-40 inline-flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SUBMIT</span>
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="border-t border-[#D9DAD6] pt-4 space-y-4 max-h-[300px] overflow-y-auto">
                  {!currentReel.comments || currentReel.comments.length === 0 ? (
                    <p className="font-mono text-xs text-[#5F625F]">
                      NO TECHNICAL INQUIRIES FILED YET. SUBMIT THE FIRST SCRUTINY QUESTION ABOVE.
                    </p>
                  ) : (
                    currentReel.comments.map((c: any, idx: number) => (
                      <div key={c.id || idx} className="border-b border-[#D9DAD6] pb-3 text-xs space-y-1">
                        <div className="flex justify-between font-mono text-[11px] text-[#5F625F]">
                          <span className="font-bold text-[#111111]">@{c.author_username || "engineer"}</span>
                          {c.is_technical_question && (
                            <span className="text-[#A16207] uppercase">[QUESTION]</span>
                          )}
                        </div>
                        <p className="text-[#111111] leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Up Next in Stream */}
              <div className="border border-[#D9DAD6] bg-[#FFFFFF] p-6 space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F625F] block">
                  TECHNICAL DEMONSTRATION STREAM
                </span>
                <div className="space-y-2">
                  {reels.map((r, idx) => (
                    <button
                      key={r.id || idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`w-full text-left p-3 border transition-colors flex items-center justify-between ${
                        activeIndex === idx
                          ? "border-[#111111] bg-[#F7F7F5]"
                          : "border-[#D9DAD6] hover:bg-[#F2F2EF]"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-mono text-[10px] text-[#5F625F] uppercase block">
                          REEL {String(idx + 1).padStart(2, "0")} // {r.reel_type || "DEMO"}
                        </span>
                        <h5 className="font-bold text-xs uppercase text-[#111111] truncate">
                          {r.title}
                        </h5>
                      </div>
                      <span className="font-mono text-xs text-[#5F625F] shrink-0">
                        {activeIndex === idx ? "▶ ACTIVE" : "PLAY →"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for recording / uploading new reel */}
        {isCreateOpen && (
          <CreateReelModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={() => {
              setIsCreateOpen(false);
              fetchReels();
            }}
          />
        )}
      </EditorialContainer>
    </div>
  );
}
