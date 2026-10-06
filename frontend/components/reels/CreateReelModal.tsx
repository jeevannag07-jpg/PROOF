"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Video,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Code2,
  Loader2,
  FileVideo,
  Image as ImageIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReel: any) => void;
  projects?: any[];
  challenges?: any[];
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export default function CreateReelModal({
  isOpen,
  onClose,
  onSuccess,
  projects = [],
  challenges = [],
}: CreateReelModalProps) {
  const { user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [reelType, setReelType] = useState("BUILD");
  const [metricsBefore, setMetricsBefore] = useState("");
  const [metricsAfter, setMetricsAfter] = useState("");
  const [hookQuote, setHookQuote] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [tags, setTags] = useState("Backend,Performance");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");

  // Upload status states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [previewUrl, thumbnailPreview]);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setErrorMessage("");

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum size is 50 MB.`);
      return;
    }

    // Validate MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
      // Check extension fallback
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["mp4", "webm", "mov"].includes(ext || "")) {
        setErrorMessage("Unsupported file format. Please upload MP4, WebM, or QuickTime MOV.");
        return;
      }
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // Auto-generate thumbnail at 0.5 seconds
    generateThumbnail(localUrl);
  };

  const generateThumbnail = (videoSrc: string) => {
    const video = document.createElement("video");
    video.src = videoSrc;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 0.5;

    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 711; // 9:16 portrait ratio
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                setThumbnailBlob(blob);
                const thumbUrl = URL.createObjectURL(blob);
                setThumbnailPreview(thumbUrl);
              }
            },
            "image/webp",
            0.85
          );
        }
        setVideoDuration(video.duration || 0);
      } catch (err) {
        console.warn("Could not capture automatic canvas thumbnail:", err);
      }
    };
  };

  // Direct upload handler using XMLHttpRequest for precise progress events
  const uploadBinary = (uploadUrl: string, blobOrFile: Blob | File, contentType: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", contentType);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Direct upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Direct upload network error"));
      xhr.send(blobOrFile);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) {
      setErrorMessage("Please fill in both a title and technical explanation.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage("");

    try {
      let finalMediaUrl: string | null = null;
      let finalMediaPath: string | null = null;
      let finalThumbnailUrl: string | null = null;
      let finalMediaType = "CODE_ONLY";

      // If user provided a video file, upload via direct storage ticket
      if (selectedFile) {
        // Step 1: Request signed upload ticket from FastAPI
        const tokenData = await api.requestUploadUrl({
          filename: selectedFile.name,
          content_type: selectedFile.type || "video/mp4",
          size: selectedFile.size,
        });

        // Step 2: Upload video binary directly to storage
        await uploadBinary(tokenData.upload_url, selectedFile, selectedFile.type || "video/mp4");

        finalMediaUrl = tokenData.public_url;
        finalMediaPath = tokenData.media_path;
        finalMediaType = "VIDEO";

        // Step 3: If thumbnail was extracted, upload it too
        if (thumbnailBlob) {
          try {
            const thumbToken = await api.requestThumbnailUploadUrl({
              filename: "thumb.webp",
              content_type: "image/webp",
              size: thumbnailBlob.size,
            });
            await uploadBinary(thumbToken.upload_url, thumbnailBlob, "image/webp");
            finalThumbnailUrl = thumbToken.public_url;
          } catch (tErr) {
            console.warn("Thumbnail upload notice:", tErr);
          }
        }
      }

      // Step 4: Create Reel record in Supabase PostgreSQL
      const created = await api.createReel({
        title: title.trim(),
        caption: caption.trim(),
        reel_type: reelType,
        metrics_before: metricsBefore.trim() || null,
        metrics_after: metricsAfter.trim() || null,
        hook_quote: hookQuote.trim() || null,
        code_snippet: codeSnippet.trim() || null,
        tags: tags.trim() || "Backend,Performance",
        project_id: selectedProject ? Number(selectedProject) : null,
        challenge_id: selectedChallenge ? Number(selectedChallenge) : null,
        media_url: finalMediaUrl,
        media_path: finalMediaPath,
        media_type: finalMediaType,
        thumbnail_url: finalThumbnailUrl,
        aspect_ratio: "9:16",
        duration_seconds: videoDuration ? Math.round(videoDuration) : null,
      });

      onSuccess(created);
      onClose();
    } catch (err: any) {
      console.error("Reel creation error:", err);
      setErrorMessage(err.message || "Failed to upload video or create reel. Please check file size and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0d0f14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">CREATE ENGINEERING REEL</h2>
              <p className="text-xs text-zinc-400 font-sans">Share demonstrated technical work with direct project links</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-sans">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Video File Upload & Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-300">
              DEMONSTRATION VIDEO <span className="text-zinc-500 font-normal">(Optional — MP4, WebM, MOV up to 50 MB)</span>
            </label>

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                }}
                className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/[0.01] hover:bg-emerald-500/[0.02] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white font-mono">Drag video here or click to browse</p>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">MP4, WebM, MOV (Max 50 MB)</p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-12 h-16 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 flex-shrink-0">
                      <FileVideo className="w-6 h-6" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white font-mono truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {videoDuration ? `${Math.round(videoDuration)}s duration` : "Video selected"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Ready for direct Supabase upload
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                    setThumbnailBlob(null);
                    setThumbnailPreview("");
                  }}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors text-xs font-mono"
                >
                  Change
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
              }}
            />
          </div>

          {/* Section 2: Title & Reel Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono text-zinc-300">
                TITLE <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How I Reduced Redis Latency from 900ms → 3.8ms"
                className="w-full bg-[#13161e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-300">REEL TYPE</label>
              <select
                value={reelType}
                onChange={(e) => setReelType(e.target.value)}
                className="w-full bg-[#13161e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
              >
                <option value="BUILD">BUILD</option>
                <option value="DECISION">DECISION</option>
                <option value="DEBUG">DEBUG</option>
                <option value="ARCHITECTURE">ARCHITECTURE</option>
                <option value="GROWTH">GROWTH</option>
                <option value="CHALLENGE">CHALLENGE</option>
              </select>
            </div>
          </div>

          {/* Section 3: Empirical Metrics Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400">METRIC BEFORE (Optional)</label>
              <input
                type="text"
                value={metricsBefore}
                onChange={(e) => setMetricsBefore(e.target.value)}
                placeholder="e.g. 900ms p99"
                className="w-full bg-[#13161e] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400">METRIC AFTER (Optional)</label>
              <input
                type="text"
                value={metricsAfter}
                onChange={(e) => setMetricsAfter(e.target.value)}
                placeholder="e.g. 3.8ms p99"
                className="w-full bg-[#13161e] border border-white/10 rounded-xl px-3 py-2 text-xs text-emerald-400 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>
          </div>

          {/* Section 4: Technical Hook Quote */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300">TECHNICAL HOOK QUOTE</label>
            <input
              type="text"
              value={hookQuote}
              onChange={(e) => setHookQuote(e.target.value)}
              placeholder="“I discovered Redis transactions were creating a silent network stampede. Here is how Lua scripts fixed it.”"
              className="w-full bg-[#13161e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans"
            />
          </div>

          {/* Section 5: Caption Explanation */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-300">
              TECHNICAL EXPLANATION / CAPTION <span className="text-emerald-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Explain the architectural root cause, the trade-off accepted, and how the solution was benchmarked."
              className="w-full bg-[#13161e] border border-white/10 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans leading-relaxed"
            />
          </div>

          {/* Section 6: Code Snippet (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-400">CODE SNIPPET (Optional)</label>
            <textarea
              rows={3}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="-- Paste relevant code snippet, SQL query, or architecture definition"
              className="w-full bg-[#090b0e] border border-white/10 rounded-xl p-3 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          {/* Section 7: Link Project & Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400">LINK VERIFIED PROJECT</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-[#13161e] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50 font-mono"
              >
                <option value="">No Project Linked</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} {p.title.slice(0, 38)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400">LINK CHALLENGE</label>
              <select
                value={selectedChallenge}
                onChange={(e) => setSelectedChallenge(e.target.value)}
                className="w-full bg-[#13161e] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50 font-mono"
              >
                <option value="">No Challenge Linked</option>
                {challenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title.slice(0, 38)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  Streaming media directly to Supabase Storage...
                </span>
                <span className="font-bold text-emerald-400">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !title.trim() || !caption.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>UPLOADING REEL...</span>
                </>
              ) : (
                <>
                  <span>PUBLISH TECHNICAL REEL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
