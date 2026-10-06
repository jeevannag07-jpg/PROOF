const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("proof_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (userData: any) =>
    apiRequest("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  getMe: () => apiRequest("/auth/me"),

  // Users & Capability Profiles
  getUser: (username: string) => apiRequest(`/users/${username}`),
  getFullProfile: (username: string) => apiRequest(`/users/${username}/profile-full`),
  getCapabilities: (username: string) => apiRequest(`/capabilities/${username}`),
  recalculateCapabilities: () => apiRequest("/capabilities/recalculate", { method: "POST" }),

  // Challenges
  getChallenges: (params?: {
    domain?: string;
    category?: string;
    difficulty?: string;
    challenge_type?: string;
    search?: string;
    skill?: string;
    sort?: string;
  }) => {
    const cleanParams: any = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "" && v !== "ALL") {
          cleanParams[k] = v;
        }
      });
    }
    const q = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/challenges${q ? `?${q}` : ""}`);
  },
  getChallenge: (idOrSlug: string) => apiRequest(`/challenges/${idOrSlug}`),
  startMission: (idOrSlug: string | number) =>
    apiRequest(`/challenges/${idOrSlug}/start`, { method: "POST" }),
  startAttempt: (challengeId: number) =>
    apiRequest("/attempts", { method: "POST", body: JSON.stringify({ challenge_id: challengeId }) }),
  getAttemptDetail: (id: string | number) => apiRequest(`/attempts/${id}`),
  getUserAttempts: () => apiRequest("/attempts/user"),

  // Workspace & Submissions
  getSubmission: (id: string | number) => apiRequest(`/submissions/${id}`),
  updateSubmission: (id: string | number, data: any) =>
    apiRequest(`/submissions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  saveArchitecture: (id: string | number, data: any) =>
    apiRequest(`/submissions/${id}/architecture`, { method: "POST", body: JSON.stringify(data) }),
  addDecision: (id: string | number, data: any) =>
    apiRequest(`/submissions/${id}/decisions`, { method: "POST", body: JSON.stringify(data) }),
  addEvidence: (id: string | number, data: any) =>
    apiRequest(`/submissions/${id}/evidence`, { method: "POST", body: JSON.stringify(data) }),
  answerDefenseQuestion: (questionId: number, answer: string) =>
    apiRequest(`/submissions/defense/${questionId}/answer`, { method: "PUT", body: JSON.stringify({ answer }) }),
  submitForVerification: (id: string | number) =>
    apiRequest(`/submissions/${id}/submit`, { method: "POST" }),

  // Projects
  getProjects: (params?: { skill?: string; search?: string; status?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return apiRequest(`/projects${q ? `?${q}` : ""}`);
  },
  getProject: (id: string | number) => apiRequest(`/projects/${id}`),

  // Reviews
  getReviews: (params?: { submission_id?: number; reviewer_id?: number }) => {
    const q = new URLSearchParams(params as any).toString();
    return apiRequest(`/reviews${q ? `?${q}` : ""}`);
  },
  getReview: (id: string | number) => apiRequest(`/reviews/${id}`),
  createReview: (reviewData: any) =>
    apiRequest("/reviews", { method: "POST", body: JSON.stringify(reviewData) }),

  // Reels (Social Engineering Layer)
  getReels: (params?: { feed?: string; reel_type?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return apiRequest(`/reels${q ? `?${q}` : ""}`);
  },
  getReel: (id: string | number) => apiRequest(`/reels/${id}`),
  createReel: (data: any) => apiRequest("/reels", { method: "POST", body: JSON.stringify(data) }),
  saveReel: (id: string | number) => apiRequest(`/reels/${id}/save`, { method: "POST" }),
  addReelComment: (id: string | number, text: string, is_technical_question = false) =>
    apiRequest(`/reels/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ text, is_technical_question }),
    }),
  requestUploadUrl: (data: { filename: string; content_type: string; size: number }) =>
    apiRequest<{ upload_url: string; media_path: string; public_url: string; media_type: string }>(
      "/reels/upload-url",
      { method: "POST", body: JSON.stringify(data) }
    ),
  requestThumbnailUploadUrl: (data: { filename: string; content_type: string; size: number }) =>
    apiRequest<{ upload_url: string; media_path: string; public_url: string; media_type: string }>(
      "/reels/thumbnail-upload-url",
      { method: "POST", body: JSON.stringify(data) }
    ),

  // Talent & Recruiter Search
  getTalent: (params?: {
    role?: string;
    min_capability?: number;
    skill?: string;
    confidence?: string;
    min_projects?: number;
    expert_reviewed_only?: boolean;
    sort_by?: string;
  }) => {
    const cleanParams: any = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "" && v !== "ALL") {
          cleanParams[k] = v;
        }
      });
    }
    const q = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/talent${q ? `?${q}` : ""}`);
  },

  // Opportunities
  getOpportunities: () => apiRequest("/opportunities"),
  createOpportunity: (data: any) =>
    apiRequest("/opportunities", { method: "POST", body: JSON.stringify(data) }),
  updateOpportunityStatus: (id: number, status: string) =>
    apiRequest(`/opportunities/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};
