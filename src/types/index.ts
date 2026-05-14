// ─── MT生成JSON の型 ───────────────────────────

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  category: string;
  publishedAt: string;   // ISO8601
  excerpt: string;
}

export interface EventItem {
  id: string;
  title: string;
  url: string;
  startDate: string;     // "2027-04-01"
  endDate: string;
  startTime?: string;    // "10:00"
  venue: string;
  category: string;
  imageUrl?: string;
  isFree: boolean;
  excerpt: string;
}

export interface FlowerItem {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  bloomStart: string;    // "03-20"
  bloomEnd: string;
  peakStart: string;
  peakEnd: string;
  location: string;
  description: string;
  tip: string;
  sortOrder: number;
}

export interface FacilityItem {
  id: string;
  name: string;
  type: "food" | "toilet" | "rest" | "firstaid" | "shop" | "mobility";
  area: string;
  openHours?: string;
  priceRange?: string;
  vegetarianMenu?: boolean;
  accessible: boolean;
  babyroom?: boolean;
  note?: string;
}

export interface FacilitiesData {
  food: FacilityItem[];
  facilities: FacilityItem[];
  firstaid: FacilityItem[];
}

export interface CourseStep {
  order: number;
  spot: string;
  duration: string;
  tip: string;
}

export interface CourseItem {
  id: string;
  name: string;
  duration: string;      // "約2時間"
  distance: string;      // "約2km"
  targetAudience: string;
  emoji: string;
  tags: string[];
  steps: CourseStep[];
}

export interface CongestionGate {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  waitMinutes: number;
}

export interface CongestionData {
  lastUpdated: string;   // ISO8601
  isMock: boolean;
  overall: 1 | 2 | 3 | 4 | 5;
  overallLabel: string;
  gates: Record<string, CongestionGate>;
  hotspots: Array<{ name: string; level: 1 | 2 | 3 | 4 | 5; label: string }>;
  forecast: Array<{ time: string; level: 1 | 2 | 3 | 4 | 5 }>;
}

// ─── 記録帳の型 ───────────────────────────────

export type NoteTag = "flower" | "tree" | "scenery" | "food" | "other";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;     // ISO8601
}

// ─── 共通フックの型 ───────────────────────────

export type FetchStatus = "idle" | "loading" | "success" | "error" | "fallback";

export interface UseFetchResult<T> {
  data: T | null;
  status: FetchStatus;
  lastFetchedAt: Date | null;
  refetch: () => void;
}

// ─── 天気の型 ─────────────────────────────────

export interface WeatherDaily {
  date: string;
  weathercode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
}

export interface WeatherData {
  daily: WeatherDaily[];
  fetchedAt: number;
}
