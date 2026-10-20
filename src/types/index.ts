export type Role = "super_admin" | "admin" | "user";

// Response of GET /api/me
export interface Profile {
  uid: string;
  email: string | null;
  role: Role;
  name: string | null;
  orgId: string | null;
  organization: { id: string; name: string } | null;
}

// Response items of GET /api/organizations
export interface Organization {
  id: string;
  name: string;
  adminUid: string;
  adminName: string;
  adminEmail: string;
  createdAt: number;
}

// Response items of GET /api/users
export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string | null;
  createdAt: number;
}

// Team C: AI Content Generation and Draft models
export type AIPlatform = "instagram" | "twitter" | "linkedin" | "facebook" | "general";
export type AITone = "professional" | "casual" | "excited" | "witty" | "urgent" | "informative";
export type AIContentType = "caption" | "product_description" | "hashtags" | "campaign_ideas";
export type AIDraftStatus = "draft" | "reviewed" | "scheduled" | "archived";

export interface AIPromptSettings {
  topic: string;
  contentType: AIContentType;
  platform: AIPlatform;
  tone: AITone;
  language?: string;
  targetAudience?: string;
}

export interface AIGenerateRequest {
  topic: string;
  contentType: AIContentType;
  platform?: AIPlatform;
  tone?: AITone;
  language?: string;
  targetAudience?: string;
}

export interface AIGenerateResponse {
  content: string;
  hashtags: string[];
  promptSettings: AIPromptSettings;
  provider: "gemini" | "mock";
  generatedAt: number;
}

export interface AIDraft {
  id: string;
  orgId: string;
  createdBy: string;
  title: string;
  promptSettings: AIPromptSettings;
  generatedContent: string;
  hashtags: string[];
  status: AIDraftStatus;
  media?: Array<{
    url: string;
    type: "image" | "video";
    altText?: string;
  }>;
  providerUsed: "gemini" | "mock";
  version: number;
  createdAt: number;
  updatedAt: number;
}

