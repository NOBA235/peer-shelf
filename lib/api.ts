// Central API client — all components use these functions
// Swap the base URL for production deployment

const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Request failed");
  return data.data as T;
}

// ── Listings ───────────────────────────────────────────────
export interface ListingFilters {
  subject?: string;
  city?: string;
  board?: string;
  type?: string;
  search?: string;
  sortBy?: string;
}

export function fetchListings(filters: ListingFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  const qs = params.toString();
  return request<ListingDoc[]>(`${BASE}/listings${qs ? `?${qs}` : ""}`);
}

export function fetchListing(id: string) {
  return request<ListingDoc>(`${BASE}/listings/${id}`);
}

export function createListing(body: Partial<ListingDoc>) {
  return request<ListingDoc>(`${BASE}/listings`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function saveListing(id: string) {
  return request<ListingDoc>(`${BASE}/listings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ $inc: { saves: 1 } }),
  });
}

export interface RequestDoc {
  _id: string;
  listingId: string;
  listingTitle: string;
  requesterName: string;
  sellerName: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export function createResourceRequest(listingId: string) {
  return request<RequestDoc>(`${BASE}/requests`, {
    method: "POST",
    body: JSON.stringify({ listingId }),
  });
}

// ── Mentors ────────────────────────────────────────────────
export interface MentorFilters {
  subject?: string;
  location?: string;
  search?: string;
}

export function fetchMentors(filters: MentorFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  const qs = params.toString();
  return request<MentorDoc[]>(`${BASE}/mentors${qs ? `?${qs}` : ""}`);
}

export function fetchMentor(id: string) {
  return request<MentorDoc>(`${BASE}/mentors/${id}`);
}

// ── Wishlist ───────────────────────────────────────────────
export interface WishlistPayload {
  title: string;
  subject: string;
  curriculum: string;
  grade: string;
}

export function fetchWishlist() {
  return request<WishlistDoc[]>(`${BASE}/wishlist`);
}

export function createWishlistItem(body: WishlistPayload) {
  return request<WishlistDoc>(`${BASE}/wishlist`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function deleteWishlistItem(id: string) {
  return request<{ message: string }>(`${BASE}/wishlist?id=${id}`, {
    method: "DELETE",
  });
}

// ── Notifications ──────────────────────────────────────────
export function fetchNotifications() {
  return request<NotificationDoc[]>(`${BASE}/notifications`);
}

export function markAllNotificationsRead() {
  return request<null>(`${BASE}/notifications`, { method: "PATCH" });
}

// ── Document types (lean MongoDB docs) ────────────────────
export interface ListingDoc {
  _id: string;
  title: string;
  author: string;
  subject: string;
  curriculum: string;
  board: string;
  grade: string;
  price: number;
  originalPrice: number;
  condition: string;
  location: string;
  city: string;
  notes: boolean;
  mentor: boolean;
  donated: boolean;
  exchange: boolean;
  image: string;
  color: string;
  seller: string;
  sellerInitials: string;
  rating: number;
  saves: number;
  type: string;
  description: string;
  included: string[];
  meetupPoint: string;
  listedDaysAgo: number;
  createdAt: string;
}

export interface MentorDoc {
  _id: string;
  name: string;
  initials: string;
  grade: string;
  achievement: string;
  subject: string;
  rating: number;
  reviews: number;
  location: string;
  books: string[];
  bio: string;
  sessions: number;
  notesShared: number;
  studentsHelped: number;
  subjects: string[];
  board: string;
  quote: string;
}

export interface WishlistDoc {
  _id: string;
  title: string;
  subject: string;
  curriculum: string;
  grade: string;
  status: "searching" | "potential" | "match";
  matchName?: string;
  matchDistance?: string;
  matchCount?: number;
  addedDaysAgo: number;
  createdAt: string;
}

export interface NotificationDoc {
  _id: string;
  type: "match" | "mentor" | "save" | "review" | "system";
  text: string;
  time: string;
  read: boolean;
}

// ── Scanner ────────────────────────────────────────────────
export interface ScanResult {
  rawText: string;
  isbn: string | null;
  title: string | null;
  author: string | null;
  edition: string | null;
  publisher: string | null;
  subjects: string[];
  source: "google-vision" | "open-library" | "combined";
}

export async function scanBookImage(base64Image: string): Promise<ScanResult> {
  const res = await fetch(`${BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Scan failed");
  return data.data as ScanResult;
}
