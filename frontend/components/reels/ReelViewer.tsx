"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  MessageSquare,
  Share2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  Flame,
  ArrowRight,
  Code2,
  Send,
  HelpCircle,
  Copy,
  Check,
  Plus,
  Video,
  FileCode,
  Tag
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import VideoPlayer from "./VideoPlayer";
import CreateReelModal from "./CreateReelModal";

export default function ReelViewer() {
  const { user } = useAuth();
  const [reels, setReels] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFeed, setActiveFeed] = useState("FOR_YOU");
  const [activeType, setActiveType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isTechQuestion, setIsTechQuestion] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Create Reel modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  const fetchReels = async () => {
    setLoading(true);
    try {
      const data = await api.getReels({
        feed: activeFeed,
        reel_type: activeType === "ALL" ? undefined : activeType,
      });
      setReels(data);
      setActiveIndex(0);
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, [activeFeed, activeType]);

  // Load auxiliary data for linking in modal
  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {});
    api.getChallenges().then(setChallenges).catch(() => {});
  }, []);

  const currentReel = reels[activeIndex];

  const handleNext = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex((prev) => prev + 1);
      setCommentsOpen(false);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      setCommentsOpen(false);
    }
  };

  const handleSave = async (reelId: number) => {
    try {
      const res = await api.saveReel(reelId);
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? { ...r, saves_count: res.saves_count, isSaved: res.saved }
            : r
        )
      );
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentReel) return;
    try {
      await api.addReelComment(currentReel.id, commentText.trim(), isTechQuestion);
      // Reload current reel to refresh comments
      const updated = await api.getReel(currentReel.id);
      setReels((prev) =>
        prev.map((r) => (r.id === currentReel.id ? { ...r, comments: updated.comments } : r))
      );
      setCommentText("");
      setIsTechQuestion(false);
    } catch (err) {
      console.error("Comment submit error:", err);
    }
  };

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleReelCreated = (newReel: any) => {
    setReels((prev) => [newReel, ...prev]);
    setActiveIndex(0);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header Feed Navigation Tabs & Actions */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 flex-wrap">
          {["FOR_YOU", "FOLLOWING", "CHALLENGES"].map((feed) => (
            <button
              key={feed}
              onClick={() => setActiveFeed(feed)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
                activeFeed === feed
                  ? "bg-white text-black shadow-lg"
                  : "text-zinc-400 hover:text-white bg-white/5 border border-white/5"
              }`}
            >
              {feed.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Reel Type Filters & Create Button */}
        <div className="flex items-center gap-3 flex-wrap justify-end w-full md:w-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {["ALL", "BUILD", "DECISION", "DEBUG", "ARCHITECTURE", "GROWTH"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors whitespace-nowrap ${
                  activeType === type
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>CREATE REEL</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="w-full max-w-2xl h-[560px] rounded-2xl bg-[#0e1015] border border-white/10 animate-pulse flex items-center justify-center text-zinc-600 font-mono">
          Loading engineering feed...
        </div>
      ) : reels.length === 0 ? (
        <div className="w-full max-w-2xl h-[400px] rounded-2xl bg-[#0e1015] border border-white/10 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-zinc-400 text-sm font-mono mb-3">No reels found for this filter.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveFeed("FOR_YOU");
                setActiveType("ALL");
              }}
              className="text-xs text-emerald-400 font-mono underline"
            >
              Reset Filters
            </button>
            <span className="text-zinc-600">·</span>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs text-white font-mono bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/15"
            >
              Create First Reel
            </button>
          </div>
        </div>
      ) : (
        /* Main Reel Container */
        <div className="w-full max-w-3xl flex gap-4 items-start relative">
          <div className="flex-1 bg-[#0d0f14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col justify-between min-h-[580px]">
            {/* Top Reel Meta Header */}
            <div className="p-5 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
              <div className="flex items-center justify-between mb-3">
                <Link
                  href={`/profile/${currentReel.user?.username || "jeevan"}`}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src={currentReel.user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt={currentReel.user?.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-emerald-400 transition-colors"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {currentReel.user?.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {currentReel.user?.overall_capability || 86} CAP
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">{currentReel.user?.title}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  {currentReel.media_type === "VIDEO" && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      VIDEO DEMO
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                    {currentReel.reel_type}
                  </span>
                </div>
              </div>

              {/* Title & Technical Metric Highlight */}
              <h2 className="text-lg md:text-xl font-bold text-white leading-tight mb-2">
                {currentReel.title}
              </h2>

              {currentReel.metrics_before && currentReel.metrics_after && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono mb-2">
                  <span className="text-zinc-400 line-through">{currentReel.metrics_before}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">{currentReel.metrics_after}</span>
                </div>
              )}
            </div>

            {/* Reel Content: Video, Image, or Code Presentation */}
            <div className="p-5 flex-1 space-y-4">
              {/* Conditional Media Rendering (Phase 5) */}
              {currentReel.media_type === "VIDEO" && currentReel.media_url ? (
                <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-black shadow-xl">
                  <VideoPlayer
                    src={currentReel.media_url}
                    poster={currentReel.thumbnail_url}
                    aspectRatio={currentReel.aspect_ratio || "9:16"}
                    title={currentReel.title}
                    isActive={true}
                  />
                </div>
              ) : currentReel.media_type === "IMAGE" && currentReel.media_url ? (
                <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-black flex items-center justify-center max-h-[480px]">
                  <img
                    src={currentReel.media_url}
                    alt={currentReel.title}
                    className="w-full h-auto object-contain max-h-[480px]"
                  />
                </div>
              ) : null}

              {/* Technical Hook Quote */}
              {currentReel.hook_quote && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border-l-2 border-emerald-400 border-white/5 text-sm text-zinc-300 italic font-sans leading-relaxed">
                  {currentReel.hook_quote}
                </div>
              )}

              {/* Caption / Technical Explanation */}
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                {currentReel.caption}
              </p>

              {/* Tags */}
              {currentReel.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentReel.tags.split(",").map((tag: string) => (
                    <span
                      key={tag.trim()}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-400"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Code Snippet Box (For CODE_ONLY reels, or video reels with supplementary code) */}
              {currentReel.code_snippet && (
                <div className="relative rounded-xl bg-[#07080a] border border-white/10 overflow-hidden text-xs">
                  <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      Technical Evidence Snippet
                    </span>
                    <button
                      onClick={() => copySnippet(currentReel.code_snippet)}
                      className="hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto font-mono text-zinc-300 leading-relaxed max-h-56">
                    <code>{currentReel.code_snippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Action Bar & Loop Integrations */}
            <div className="p-5 border-t border-white/10 bg-[#090b0e] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentReel.project_id && (
                  <Link
                    href={`/projects/${currentReel.project_id}`}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-semibold transition-all border border-white/10"
                  >
                    <span>EXPLORE PROJECT</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>
                )}

                {currentReel.challenge_id && (
                  <Link
                    href={`/challenges/${currentReel.challenge_id}`}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <span>TAKE THE CHALLENGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Progress counter */}
              <div className="text-xs font-mono text-zinc-500">
                {activeIndex + 1} / {reels.length}
              </div>
            </div>
          </div>

          {/* Vertical Control & Engagement Sidebar */}
          <div className="flex flex-col items-center gap-3">
            {/* Scroll Navigation */}
            <div className="flex flex-col gap-1 p-1 bg-[#101217] border border-white/10 rounded-xl">
              <button
                disabled={activeIndex === 0}
                onClick={handlePrev}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Previous Reel"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                disabled={activeIndex === reels.length - 1}
                onClick={handleNext}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Next Reel"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Social Signal: Save */}
            <button
              onClick={() => handleSave(currentReel.id)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#101217] border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white transition-all group"
              title="Save Reel"
            >
              <Bookmark className={`w-5 h-5 transition-colors ${currentReel.isSaved ? "fill-emerald-400 text-emerald-400" : "group-hover:text-emerald-400"}`} />
              <span className="text-[10px] font-mono text-zinc-500">{currentReel.saves_count || 0}</span>
            </button>

            {/* Technical Discussion / Comments */}
            <button
              onClick={() => setCommentsOpen(!commentsOpen)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl bg-[#101217] border transition-all ${
                commentsOpen ? "border-emerald-500/50 text-emerald-400" : "border-white/10 text-zinc-400 hover:text-white"
              }`}
              title="Technical Discussion"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] font-mono text-zinc-500">{currentReel.comments_count || 0}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Reel link copied to clipboard!");
              }}
              className="p-3 rounded-xl bg-[#101217] border border-white/10 text-zinc-400 hover:text-white transition-all"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Comments Panel */}
      {commentsOpen && currentReel && (
        <div className="w-full max-w-3xl mt-4 bg-[#0e1015] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white font-mono">TECHNICAL DISCUSSION</span>
            </div>
            <button
              onClick={() => setCommentsOpen(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-mono"
            >
              Close
            </button>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3 mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ask an architecture question or discuss technical trade-offs..."
              rows={2}
              className="w-full bg-[#13161d] border border-white/10 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTechQuestion}
                  onChange={(e) => setIsTechQuestion(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Tag as Technical Question</span>
              </label>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-xs font-bold font-mono transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>POST COMMENT</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {currentReel.comments && currentReel.comments.length > 0 ? (
              currentReel.comments.map((c: any) => (
                <div
                  key={c.id}
                  className={`p-3 rounded-xl border text-xs ${
                    c.is_technical_question
                      ? "bg-amber-950/20 border-amber-500/30"
                      : "bg-[#13161e] border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white font-mono">
                      {c.user?.name || "Engineer"}
                    </span>
                    {c.is_technical_question && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        Technical Question
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-300 leading-relaxed font-sans">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 font-mono text-center py-4">
                No discussion yet. Be the first engineer to ask a technical question!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Create Reel Modal */}
      <CreateReelModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleReelCreated}
        projects={projects}
        challenges={challenges}
      />
    </div>
  );
}
