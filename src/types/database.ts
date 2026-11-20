export type UserRole =
  | "member"
  | "state_coordinator"
  | "media_editor"
  | "national_admin";

export type PvcStatus =
  | "has_pvc"
  | "planning_pvc"
  | "no_pvc_supporter"
  | "diaspora";

export type ActionTeamId =
  | "protect_ballots"
  | "social_media"
  | "grassroots_mobilization"
  | "fundraising_outreach";

export type GeopoliticalZone =
  | "North Central"
  | "North East"
  | "North West"
  | "South East"
  | "South South"
  | "South West";

export interface SocialHandles {
  x?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export interface MemberProfile {
  id: string;
  member_number: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  gender?: "male" | "female" | "prefer_not_to_say";
  age_bracket?: "18-25" | "26-35" | "36-45" | "46-60" | "60+";
  avatar_url?: string;
  role: UserRole;
  assigned_state_id?: number | null;
  pvc_status: PvcStatus;
  state_id: number | null;
  state_name?: string;
  lga_id?: number | null;
  lga_name?: string;
  ward_id?: number | null;
  ward_name?: string;
  polling_unit_id?: number | null;
  polling_unit_name?: string;
  polling_unit_code?: string;
  custom_ward?: string;
  custom_polling_unit?: string;
  diaspora_country?: string;
  action_teams: ActionTeamId[];
  social_handles: SocialHandles;
  why_i_joined?: string;
  referral_code: string;
  referred_by?: string | null;
  recruits_count?: number;
  created_at: string;
}

export interface AnalyticsSummary {
  total_members: number;
  pvc_holders: number;
  planning_pvc: number;
  non_pvc_supporters: number;
  diaspora_supporters: number;
  protect_ballots_count: number;
  social_media_count: number;
  grassroots_mobilization_count: number;
  fundraising_outreach_count: number;
  states_covered: number;
  lgas_covered: number;
  wards_covered: number;
  polling_units_covered: number;
}

export interface StateBreakdownRow {
  state_id: number;
  state_name: string;
  state_code: string;
  geopolitical_zone: GeopoliticalZone;
  total_members: number;
  pvc_holders: number;
  non_pvc_supporters: number;
  protect_ballots: number;
  social_media: number;
  lgas_covered: number;
  wards_covered: number;
  polling_units_covered: number;
}

export interface LgaBreakdownRow {
  lga_id: number;
  lga_name: string;
  total_members: number;
  pvc_holders: number;
  non_pvc_supporters: number;
  protect_ballots: number;
  social_media: number;
  wards_covered: number;
  polling_units_covered: number;
}

export interface WardBreakdownRow {
  ward_id: number;
  ward_name: string;
  ward_code: string;
  total_members: number;
  pvc_holders: number;
  protect_ballots: number;
  social_media: number;
  polling_units_covered: number;
}

export interface PollingUnitBreakdownRow {
  polling_unit_id: number;
  pu_code: string;
  pu_name: string;
  total_members: number;
  pvc_holders: number;
  protect_ballots: number;
  social_media: number;
}

export interface FundraisingCampaign {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  location_label: string;
  target_amount_ngn: number;
  raised_amount_ngn: number;
  donor_count: number;
  cover_image_url: string;
  is_general_fund: boolean;
  is_active: boolean;
  ends_at?: string;
}

export interface DonationRecord {
  id: string;
  campaign_id: string | null;
  campaign_title?: string;
  user_id?: string | null;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount_ngn: number;
  currency: string;
  frequency: "one_time" | "monthly";
  payment_method: "paystack" | "bank_transfer";
  reference: string;
  status: "pending" | "pending_verification" | "verified" | "failed" | "rejected";
  is_anonymous: boolean;
  message?: string;
  receipt_url?: string;
  transfer_bank_name?: string;
  transfer_sender_name?: string;
  created_at: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  photographer?: string;
}

export interface GalleryAlbum {
  id: string;
  slug: string;
  title: string;
  summary: string;
  event_date: string;
  state_id: number;
  state_name: string;
  location_name: string;
  category:
    | "Community Relief"
    | "Town Hall"
    | "Grassroots Outreach"
    | "Ballot Protection Training"
    | "Youth & Women Summit"
    | "National Convention";
  cover_image_url: string;
  video_url?: string;
  is_published: boolean;
  photos: GalleryPhoto[];
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  source_attribution?: string;
  cover_image_url: string;
  author_name: string;
  published_at: string;
  is_published: boolean;
}

export interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  category: "graphic" | "talking_point" | "whatsapp_group" | "guide";
  content_text?: string;
  asset_url?: string;
  external_url?: string;
  state_name?: string;
  action_team?: ActionTeamId;
}

export interface LeadershipMember {
  id: string;
  name: string;
  title: string;
  zone_or_state: string;
  bio: string;
  photo_url?: string;
  is_featured?: boolean;
}

export interface SiteSettings {
  org_name: string;
  motto: string;
  national_chairman: string;
  secretariat_address: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_url: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  leadership: LeadershipMember[];
  social_links: {
    x?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

