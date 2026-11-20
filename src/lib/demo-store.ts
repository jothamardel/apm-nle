import {
  NIGERIA_STATES,
  getAllLgasForState,
  getPollingUnitsForWard,
  getWardsForLga,
} from "@/data/nigeria-states-lgas";
import {
  DEFAULT_SITE_SETTINGS,
  SEED_CAMPAIGNS,
  SEED_GALLERY_ALBUMS,
  SEED_NEWS_POSTS,
  SEED_TOOLKIT_ITEMS,
} from "@/data/reference-content";
import { generateDonationRef, generateMemberNumber, generateReferralCode } from "@/lib/format";
import type {
  ActionTeamId,
  AnalyticsSummary,
  DonationRecord,
  FundraisingCampaign,
  GalleryAlbum,
  LgaBreakdownRow,
  MemberProfile,
  NewsPost,
  PollingUnitBreakdownRow,
  PvcStatus,
  SiteSettings,
  StateBreakdownRow,
  ToolkitItem,
  UserRole,
  WardBreakdownRow,
} from "@/types/database";

const STORAGE_KEY = "nle_apm_demo_state_v1";

// Deterministic realistic base counts across all 37 states + FCT (reflecting strong Plateau/Oyo/Katsina/FCT/Lagos/Kano/Bauchi hubs)
const STATE_WEIGHTS: Record<number, number> = {
  32: 4180, // Plateau (Secretariat hub - Rayfield, Jos)
  31: 3940, // Oyo (Makinde home state)
  21: 2890, // Katsina (Daura home state)
  15: 2460, // FCT Abuja
  25: 2780, // Lagos
  20: 2150, // Kano
  5: 1920,  // Bauchi (APM Convention host)
  19: 1840, // Kaduna
  33: 1520, // Rivers
  7: 1380,  // Benue
  26: 1290, // Nasarawa
  28: 1240, // Ogun
  30: 1180, // Osun
  14: 1120, // Enugu
  24: 1050, // Kwara
  27: 980,  // Niger
  23: 940,  // Kogi
  10: 910,  // Delta
  12: 880,  // Edo
  29: 860,  // Ondo
  4: 820,   // Anambra
  3: 790,   // Akwa Ibom
  17: 770,  // Imo
  1: 740,   // Abia
  2: 710,   // Adamawa
  13: 690,  // Ekiti
  8: 660,   // Borno
  9: 640,   // Cross River
  18: 620,  // Jigawa
  34: 590,  // Sokoto
  16: 570,  // Gombe
  35: 550,  // Taraba
  22: 520,  // Kebbi
  11: 490,  // Ebonyi
  36: 460,  // Yobe
  37: 440,  // Zamfara
  6: 420,   // Bayelsa
};

function seededHash(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const SEED_MEMBERS: MemberProfile[] = [
  {
    id: "usr-admin-1",
    member_number: "NLE-APM-2026-000001",
    full_name: "Ms Nikurai Maton",
    email: "chairman@nlegrassroots.org",
    phone: "+2348030002027",
    whatsapp: "+2348030002027",
    gender: "female",
    age_bracket: "36-45",
    role: "national_admin",
    assigned_state_id: 32,
    pvc_status: "has_pvc",
    state_id: 32,
    state_name: "Plateau",
    lga_id: 3206,
    lga_name: "Jos South",
    ward_id: 320602,
    ward_name: "Du (Rayfield / Mazaram)",
    polling_unit_id: 32060202,
    polling_unit_name: "Opp. Jos City Park / Rabo Plaza Open Space",
    polling_unit_code: "PL/W02/PU-002",
    action_teams: ["protect_ballots", "grassroots_mobilization", "fundraising_outreach"],
    social_handles: { x: "@nikuraimaton", instagram: "@nlegrassroots" },
    why_i_joined: "Building a united, people-first grassroots engine to Reimagine, Reset, and Rebuild Nigeria.",
    referral_code: "NLE-NIKU2027",
    recruits_count: 148,
    created_at: "2026-08-18T09:00:00Z",
  },
  {
    id: "usr-coord-pl",
    member_number: "NLE-APM-2026-000014",
    full_name: "Danjuma Pam Gyang",
    email: "plateau.coord@nlegrassroots.org",
    phone: "+2348062214490",
    whatsapp: "+2348062214490",
    gender: "male",
    age_bracket: "26-35",
    role: "state_coordinator",
    assigned_state_id: 32,
    pvc_status: "has_pvc",
    state_id: 32,
    state_name: "Plateau",
    lga_id: 3205,
    lga_name: "Jos North",
    ward_id: 320509,
    ward_name: "Lamingo / Tudun Wada",
    polling_unit_id: 32050901,
    polling_unit_name: "Lamingo / Tudun Wada Primary School I",
    polling_unit_code: "PL/W09/PU-001",
    action_teams: ["protect_ballots", "grassroots_mobilization"],
    social_handles: { x: "@danjuma_jos" },
    why_i_joined: "Ensuring every single polling unit across Plateau's 17 LGAs has committed ballot protectors.",
    referral_code: "NLE-DANJ3102",
    recruits_count: 92,
    created_at: "2026-08-24T11:30:00Z",
  },
  {
    id: "usr-media-1",
    member_number: "NLE-APM-2026-000042",
    full_name: "Toluwanimi Adeyemi",
    email: "media@nlegrassroots.org",
    phone: "+2348148873211",
    whatsapp: "+2348148873211",
    gender: "female",
    age_bracket: "18-25",
    role: "media_editor",
    pvc_status: "no_pvc_supporter",
    state_id: 31,
    state_name: "Oyo",
    lga_id: 3106,
    lga_name: "Ibadan North",
    ward_id: 310605,
    ward_name: "Ward V (Bodija / Ashi)",
    polling_unit_id: null,
    action_teams: ["social_media", "fundraising_outreach"],
    social_handles: { x: "@tolu_resets", instagram: "@tolu.creates", tiktok: "@toluresetng" },
    why_i_joined: "I missed PVC registration during NYSC, but staying silent isn't an option. My digital reach mobilizes hundreds!",
    referral_code: "NLE-TOLU8841",
    recruits_count: 114,
    created_at: "2026-09-02T14:20:00Z",
  },
  {
    id: "usr-member-kt",
    member_number: "NLE-APM-2026-000108",
    full_name: "Sadiq Ibrahim Daura",
    email: "sadiq.daura@example.ng",
    phone: "+2348095519823",
    whatsapp: "+2348095519823",
    gender: "male",
    age_bracket: "26-35",
    role: "member",
    pvc_status: "has_pvc",
    state_id: 21,
    state_name: "Katsina",
    lga_id: 2110,
    lga_name: "Daura",
    ward_id: 211001,
    ward_name: "Kusugu",
    polling_unit_id: 21100101,
    polling_unit_name: "Kusugu Well Heritage Square I",
    polling_unit_code: "KT/W01/PU-001",
    action_teams: ["protect_ballots", "social_media"],
    social_handles: { x: "@sadiq_kt", facebook: "Sadiq Daura" },
    why_i_joined: "Security and agricultural productivity matter deeply in Katsina — the Makinde/Daura ticket brings real competence.",
    referral_code: "NLE-SADI4420",
    recruits_count: 67,
    created_at: "2026-09-14T16:10:00Z",
  },
  {
    id: "usr-member-fc",
    member_number: "NLE-APM-2026-000219",
    full_name: "Chidinma Okafor",
    email: "chidinma.ok@example.ng",
    phone: "+2348037712044",
    whatsapp: "+2348037712044",
    gender: "female",
    age_bracket: "26-35",
    role: "member",
    pvc_status: "planning_pvc",
    state_id: 15,
    state_name: "FCT Abuja",
    lga_id: 1502,
    lga_name: "Abuja Municipal (AMAC)",
    ward_id: 150212,
    ward_name: "Wuse",
    polling_unit_id: 15021201,
    polling_unit_name: "Wuse Zone 2 Primary School I",
    polling_unit_code: "FC/W12/PU-001",
    action_teams: ["social_media", "fundraising_outreach"],
    social_handles: { instagram: "@chidinma_civic", x: "@chidinma_ng" },
    why_i_joined: "Supporting community outreaches and getting more young professionals involved off the sidelines.",
    referral_code: "NLE-CHID5519",
    recruits_count: 53,
    created_at: "2026-10-01T10:05:00Z",
  },
  {
    id: "usr-member-la",
    member_number: "NLE-APM-2026-000315",
    full_name: "Babatunde Balogun",
    email: "tunde.balogun@example.ng",
    phone: "+2348024119087",
    whatsapp: "+2348024119087",
    gender: "male",
    age_bracket: "36-45",
    role: "member",
    pvc_status: "has_pvc",
    state_id: 25,
    state_name: "Lagos",
    lga_id: 2511,
    lga_name: "Ikeja",
    ward_id: 251103,
    ward_name: "GRA Ikeja",
    polling_unit_id: 25110301,
    polling_unit_name: "GRA Ikeja Primary School I",
    polling_unit_code: "LA/W03/PU-001",
    action_teams: ["protect_ballots", "fundraising_outreach"],
    social_handles: { x: "@tundebalogun" },
    why_i_joined: "We need decentralized electricity, fiscal discipline, and accountable leadership across Nigeria.",
    referral_code: "NLE-BABA7712",
    recruits_count: 41,
    created_at: "2026-10-12T08:45:00Z",
  },
  {
    id: "usr-member-diaspora",
    member_number: "NLE-APM-2026-000409",
    full_name: "Dr. Amina Bello-Sule",
    email: "amina.diaspora@example.org",
    phone: "+447700900412",
    whatsapp: "+447700900412",
    gender: "female",
    age_bracket: "36-45",
    role: "member",
    pvc_status: "diaspora",
    state_id: 19,
    state_name: "Kaduna",
    lga_id: 1909,
    lga_name: "Kaduna North",
    diaspora_country: "United Kingdom",
    action_teams: ["social_media", "fundraising_outreach"],
    social_handles: { x: "@draminabello" },
    why_i_joined: "Living in the UK means no voting booth nearby, so I fund grassroots outreaches and mobilize family back home.",
    referral_code: "NLE-AMIN9023",
    recruits_count: 38,
    created_at: "2026-10-20T18:15:00Z",
  },
];

const SEED_DONATIONS: DonationRecord[] = [
  {
    id: "don-1",
    campaign_id: "camp-general",
    campaign_title: "NLE Grassroots General Movement Fund",
    user_id: "usr-admin-1",
    donor_name: "Ms Nikurai Maton",
    donor_email: "chairman@nlegrassroots.org",
    amount_ngn: 250000,
    currency: "NGN",
    frequency: "monthly",
    payment_method: "paystack",
    reference: "NLE-882910-PAY1",
    status: "verified",
    is_anonymous: false,
    message: "For our nationwide ward coordinators and outreach volunteers.",
    created_at: "2026-11-01T10:15:00Z",
  },
  {
    id: "don-2",
    campaign_id: "camp-ballots",
    campaign_title: "Protect The Ballots — Polling Unit Training & Kits",
    user_id: "usr-member-la",
    donor_name: "Babatunde Balogun",
    donor_email: "tunde.balogun@example.ng",
    amount_ngn: 100000,
    currency: "NGN",
    frequency: "one_time",
    payment_method: "paystack",
    reference: "NLE-894122-PAY2",
    status: "verified",
    is_anonymous: false,
    message: "Equip more polling unit observers across Plateau, Oyo, and Lagos!",
    created_at: "2026-11-07T14:40:00Z",
  },
  {
    id: "don-3",
    campaign_id: "camp-jos-outreach",
    campaign_title: "Plateau & North-Central Member Support Outreach",
    user_id: "usr-member-fc",
    donor_name: "Chidinma Okafor",
    donor_email: "chidinma.ok@example.ng",
    amount_ngn: 50000,
    currency: "NGN",
    frequency: "one_time",
    payment_method: "bank_transfer",
    reference: "NLE-901204-BNK3",
    status: "pending_verification",
    is_anonymous: false,
    message: "Direct GTBank transfer for the Rayfield community welfare packs.",
    transfer_bank_name: "Guaranty Trust Bank (GTB)",
    transfer_sender_name: "CHIDINMA OKAFOR",
    receipt_url: "/images/outreach-relief.svg",
    created_at: "2026-11-18T16:05:00Z",
  },
  {
    id: "don-4",
    campaign_id: "camp-general",
    campaign_title: "NLE Grassroots General Movement Fund",
    user_id: "usr-member-diaspora",
    donor_name: "Anonymous Supporter",
    donor_email: "amina.diaspora@example.org",
    amount_ngn: 150000,
    currency: "NGN",
    frequency: "one_time",
    payment_method: "bank_transfer",
    reference: "NLE-904512-BNK4",
    status: "pending_verification",
    is_anonymous: true,
    message: "Diaspora solidarity contribution — Reimagine. Reset. Rebuild!",
    transfer_bank_name: "Access Bank",
    transfer_sender_name: "AMINA B. SULE",
    receipt_url: "/images/outreach-general.svg",
    created_at: "2026-11-19T12:22:00Z",
  },
];

export interface DemoState {
  members: MemberProfile[];
  currentUserId: string | null;
  campaigns: FundraisingCampaign[];
  donations: DonationRecord[];
  albums: GalleryAlbum[];
  news: NewsPost[];
  toolkit: ToolkitItem[];
  settings: SiteSettings;
}

export function getInitialDemoState(): DemoState {
  return {
    members: SEED_MEMBERS,
    currentUserId: null,
    campaigns: SEED_CAMPAIGNS,
    donations: SEED_DONATIONS,
    albums: SEED_GALLERY_ALBUMS,
    news: SEED_NEWS_POSTS,
    toolkit: SEED_TOOLKIT_ITEMS,
    settings: DEFAULT_SITE_SETTINGS,
  };
}

export function loadDemoState(): DemoState {
  if (typeof window === "undefined") {
    return getInitialDemoState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialDemoState();
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    const defaults = getInitialDemoState();
    return {
      members: parsed.members?.length ? parsed.members : defaults.members,
      currentUserId: parsed.currentUserId ?? null,
      campaigns: parsed.campaigns?.length ? parsed.campaigns : defaults.campaigns,
      donations: parsed.donations?.length ? parsed.donations : defaults.donations,
      albums: parsed.albums?.length ? parsed.albums : defaults.albums,
      news: parsed.news?.length ? parsed.news : defaults.news,
      toolkit: parsed.toolkit?.length ? parsed.toolkit : defaults.toolkit,
      settings: parsed.settings ?? defaults.settings,
    };
  } catch {
    return getInitialDemoState();
  }
}

export function saveDemoState(state: DemoState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("nle-demo-state-changed"));
  } catch {
    // ignore quota errors
  }
}

/**
 * Compute realistic aggregate analytics across all 37 States -> 774 LGAs -> Wards -> Polling Units
 * combining deterministic nationwide baseline + live newly registered demo members!
 */
export function computeDemoAnalytics(members: MemberProfile[]): {
  summary: AnalyticsSummary;
  states: StateBreakdownRow[];
} {
  // Extra newly registered members beyond the initial 7 seed profiles increment counts live!
  const newlyAdded = members.slice(SEED_MEMBERS.length);

  const states: StateBreakdownRow[] = NIGERIA_STATES.map((s) => {
    const baseTotal = STATE_WEIGHTS[s.id] ?? 500;
    const extraInState = newlyAdded.filter((m) => m.state_id === s.id);
    const total_members = baseTotal + extraInState.length;

    const basePvc = Math.round(baseTotal * 0.68);
    const baseNonPvc = baseTotal - basePvc;
    const baseProtect = Math.round(baseTotal * 0.44);
    const baseSocial = Math.round(baseTotal * 0.56);

    const extraPvc = extraInState.filter((m) => m.pvc_status === "has_pvc").length;
    const extraNonPvc = extraInState.filter(
      (m) => m.pvc_status === "no_pvc_supporter" || m.pvc_status === "planning_pvc"
    ).length;
    const extraProtect = extraInState.filter((m) =>
      m.action_teams.includes("protect_ballots")
    ).length;
    const extraSocial = extraInState.filter((m) =>
      m.action_teams.includes("social_media")
    ).length;

    const lgasCovered = Math.min(s.lgas.length, Math.max(4, Math.round(s.lgas.length * 0.88)));
    const wardsCovered = lgasCovered * 7;
    const pusCovered = Math.round(total_members * 0.54);

    return {
      state_id: s.id,
      state_name: s.name,
      state_code: s.code,
      geopolitical_zone: s.zone,
      total_members,
      pvc_holders: basePvc + extraPvc,
      non_pvc_supporters: baseNonPvc + extraNonPvc,
      protect_ballots: baseProtect + extraProtect,
      social_media: baseSocial + extraSocial,
      lgas_covered: lgasCovered,
      wards_covered: wardsCovered,
      polling_units_covered: pusCovered,
    };
  }).sort((a, b) => b.total_members - a.total_members);

  const totalStateMembers = states.reduce((acc, s) => acc + s.total_members, 0);
  const extraDiaspora = newlyAdded.filter((m) => m.pvc_status === "diaspora").length;
  const diaspora_supporters = 1840 + extraDiaspora;
  const total_members = totalStateMembers + diaspora_supporters;

  const pvc_holders = states.reduce((acc, s) => acc + s.pvc_holders, 0);
  const nonPvcCombined = states.reduce((acc, s) => acc + s.non_pvc_supporters, 0);
  const planning_pvc = Math.round(nonPvcCombined * 0.42);
  const non_pvc_supporters = nonPvcCombined - planning_pvc;

  const summary: AnalyticsSummary = {
    total_members,
    pvc_holders,
    planning_pvc,
    non_pvc_supporters,
    diaspora_supporters,
    protect_ballots_count: states.reduce((acc, s) => acc + s.protect_ballots, 0),
    social_media_count:
      states.reduce((acc, s) => acc + s.social_media, 0) + Math.round(diaspora_supporters * 0.78),
    grassroots_mobilization_count: Math.round(total_members * 0.37),
    fundraising_outreach_count: Math.round(total_members * 0.29),
    states_covered: 37,
    lgas_covered: states.reduce((acc, s) => acc + s.lgas_covered, 0),
    wards_covered: states.reduce((acc, s) => acc + s.wards_covered, 0),
    polling_units_covered: states.reduce((acc, s) => acc + s.polling_units_covered, 0),
  };

  return { summary, states };
}

export function computeDemoLgaBreakdown(
  stateId: number,
  members: MemberProfile[]
): LgaBreakdownRow[] {
  const lgas = getAllLgasForState(stateId);
  const stateTotal = STATE_WEIGHTS[stateId] ?? 500;
  const newlyAdded = members.slice(SEED_MEMBERS.length);

  // Distribute state total across LGAs deterministically with natural variance
  const rawWeights = lgas.map((l, idx) => {
    const isCapitalHub =
      /Jos South|Jos North|Ibadan North|Daura|Katsina|AMAC|Ikeja|Alimosho|Bauchi|Kano Municipal|Port Harcourt|Kaduna North/i.test(
        l.name
      );
    return (isCapitalHub ? 2.6 : 0.65 + seededHash(stateId * 97 + idx * 13) * 1.1);
  });
  const weightSum = rawWeights.reduce((a, b) => a + b, 0) || 1;

  return lgas
    .map((l, idx) => {
      const base = Math.max(12, Math.round((rawWeights[idx] / weightSum) * stateTotal));
      const extra = newlyAdded.filter((m) => m.lga_id === l.id);
      const total_members = base + extra.length;
      const pvc_holders =
        Math.round(base * 0.68) + extra.filter((m) => m.pvc_status === "has_pvc").length;
      const non_pvc_supporters = total_members - pvc_holders;
      const protect_ballots =
        Math.round(base * 0.44) +
        extra.filter((m) => m.action_teams.includes("protect_ballots")).length;
      const social_media =
        Math.round(base * 0.56) +
        extra.filter((m) => m.action_teams.includes("social_media")).length;
      const wards = getWardsForLga(stateId, l.id);

      return {
        lga_id: l.id,
        lga_name: l.name,
        total_members,
        pvc_holders,
        non_pvc_supporters,
        protect_ballots,
        social_media,
        wards_covered: wards.length,
        polling_units_covered: Math.min(wards.length * 6, Math.max(8, Math.round(total_members * 0.48))),
      };
    })
    .sort((a, b) => b.total_members - a.total_members);
}

export function computeDemoWardBreakdown(
  stateId: number,
  lgaId: number,
  members: MemberProfile[]
): WardBreakdownRow[] {
  const lgaRows = computeDemoLgaBreakdown(stateId, members);
  const parentLga = lgaRows.find((r) => r.lga_id === lgaId);
  const lgaTotal = parentLga?.total_members ?? 120;
  const wards = getWardsForLga(stateId, lgaId);
  const newlyAdded = members.slice(SEED_MEMBERS.length);

  const weights = wards.map((w, idx) => {
    const isHub = /Rayfield|Mazaram|Bodija|Kusugu|Wuse|Bukuru|GRA/i.test(w.name);
    return isHub ? 2.2 : 0.7 + seededHash(lgaId * 31 + idx * 7);
  });
  const sum = weights.reduce((a, b) => a + b, 0) || 1;

  return wards
    .map((w, idx) => {
      const base = Math.max(4, Math.round((weights[idx] / sum) * lgaTotal));
      const extra = newlyAdded.filter((m) => m.ward_id === w.id);
      const total_members = base + extra.length;
      const pvc_holders =
        Math.round(base * 0.69) + extra.filter((m) => m.pvc_status === "has_pvc").length;
      const protect_ballots =
        Math.round(base * 0.45) +
        extra.filter((m) => m.action_teams.includes("protect_ballots")).length;
      const social_media =
        Math.round(base * 0.55) +
        extra.filter((m) => m.action_teams.includes("social_media")).length;
      const pus = getPollingUnitsForWard(stateId, lgaId, w.id);

      return {
        ward_id: w.id,
        ward_name: w.name,
        ward_code: w.code,
        total_members,
        pvc_holders,
        protect_ballots,
        social_media,
        polling_units_covered: pus.length,
      };
    })
    .sort((a, b) => b.total_members - a.total_members);
}

export function computeDemoPuBreakdown(
  stateId: number,
  lgaId: number,
  wardId: number,
  members: MemberProfile[]
): PollingUnitBreakdownRow[] {
  const wards = computeDemoWardBreakdown(stateId, lgaId, members);
  const parentWard = wards.find((w) => w.ward_id === wardId);
  const wardTotal = parentWard?.total_members ?? 30;
  const pus = getPollingUnitsForWard(stateId, lgaId, wardId);
  const newlyAdded = members.slice(SEED_MEMBERS.length);

  const weights = pus.map((p, idx) => {
    const isHub = /Rabo Plaza|City Park|Primary School I|Heritage/i.test(p.name);
    return isHub ? 2.0 : 0.65 + seededHash(wardId * 19 + idx * 11);
  });
  const sum = weights.reduce((a, b) => a + b, 0) || 1;

  return pus
    .map((pu, idx) => {
      const base = Math.max(1, Math.round((weights[idx] / sum) * wardTotal));
      const extra = newlyAdded.filter((m) => m.polling_unit_id === pu.id);
      const total_members = base + extra.length;
      return {
        polling_unit_id: pu.id,
        pu_code: pu.pu_code,
        pu_name: pu.name,
        total_members,
        pvc_holders:
          Math.round(base * 0.72) + extra.filter((m) => m.pvc_status === "has_pvc").length,
        protect_ballots:
          Math.round(base * 0.48) +
          extra.filter((m) => m.action_teams.includes("protect_ballots")).length,
        social_media:
          Math.round(base * 0.52) +
          extra.filter((m) => m.action_teams.includes("social_media")).length,
      };
    })
    .sort((a, b) => b.total_members - a.total_members);
}

export function registerDemoMember(input: {
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  gender?: "male" | "female" | "prefer_not_to_say";
  age_bracket?: "18-25" | "26-35" | "36-45" | "46-60" | "60+";
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
  social_handles: MemberProfile["social_handles"];
  why_i_joined?: string;
  referred_by_code?: string;
}): MemberProfile {
  const state = loadDemoState();
  const existing = state.members.find(
    (m) => m.email.toLowerCase() === input.email.trim().toLowerCase()
  );
  if (existing) {
    state.currentUserId = existing.id;
    saveDemoState(state);
    return existing;
  }

  let referrerId: string | null = null;
  if (input.referred_by_code) {
    const refMember = state.members.find(
      (m) => m.referral_code.toUpperCase() === input.referred_by_code!.trim().toUpperCase()
    );
    if (refMember) {
      referrerId = refMember.id;
      refMember.recruits_count = (refMember.recruits_count ?? 0) + 1;
    }
  }

  const profile: MemberProfile = {
    id: `usr-${Date.now()}`,
    member_number: generateMemberNumber(500 + state.members.length),
    full_name: input.full_name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    whatsapp: input.whatsapp?.trim() || input.phone.trim(),
    gender: input.gender,
    age_bracket: input.age_bracket,
    role: "member",
    pvc_status: input.pvc_status,
    state_id: input.state_id,
    state_name: input.state_name,
    lga_id: input.lga_id ?? null,
    lga_name: input.lga_name,
    ward_id: input.ward_id ?? null,
    ward_name: input.ward_name,
    polling_unit_id: input.polling_unit_id ?? null,
    polling_unit_name: input.polling_unit_name,
    polling_unit_code: input.polling_unit_code,
    custom_ward: input.custom_ward,
    custom_polling_unit: input.custom_polling_unit,
    diaspora_country: input.diaspora_country,
    action_teams: input.action_teams,
    social_handles: input.social_handles,
    why_i_joined: input.why_i_joined,
    referral_code: generateReferralCode(input.full_name),
    referred_by: referrerId,
    recruits_count: 0,
    created_at: new Date().toISOString(),
  };

  state.members.push(profile);
  state.currentUserId = profile.id;
  saveDemoState(state);
  return profile;
}

export function signInDemoUser(email: string, quickRole?: UserRole): MemberProfile | null {
  const state = loadDemoState();
  let match: MemberProfile | undefined;
  if (quickRole) {
    match = state.members.find((m) => m.role === quickRole);
  } else {
    match = state.members.find(
      (m) => m.email.toLowerCase() === email.trim().toLowerCase()
    );
  }
  if (!match) return null;
  state.currentUserId = match.id;
  saveDemoState(state);
  return match;
}

export function signOutDemoUser(): void {
  const state = loadDemoState();
  state.currentUserId = null;
  saveDemoState(state);
}

export function recordDemoDonation(input: {
  campaign_id: string | null;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount_ngn: number;
  frequency: "one_time" | "monthly";
  payment_method: "paystack" | "bank_transfer";
  is_anonymous: boolean;
  message?: string;
  transfer_bank_name?: string;
  transfer_sender_name?: string;
  receipt_url?: string;
}): DonationRecord {
  const state = loadDemoState();
  const campaign = state.campaigns.find((c) => c.id === input.campaign_id);
  const status = input.payment_method === "paystack" ? "verified" : "pending_verification";

  const record: DonationRecord = {
    id: `don-${Date.now()}`,
    campaign_id: input.campaign_id,
    campaign_title: campaign?.title ?? "NLE Grassroots General Movement Fund",
    user_id: state.currentUserId,
    donor_name: input.is_anonymous ? "Anonymous Supporter" : input.donor_name.trim(),
    donor_email: input.donor_email.trim(),
    donor_phone: input.donor_phone?.trim(),
    amount_ngn: input.amount_ngn,
    currency: "NGN",
    frequency: input.frequency,
    payment_method: input.payment_method,
    reference: generateDonationRef(input.payment_method === "paystack" ? "PAY" : "BNK"),
    status,
    is_anonymous: input.is_anonymous,
    message: input.message?.trim(),
    transfer_bank_name: input.transfer_bank_name?.trim(),
    transfer_sender_name: input.transfer_sender_name?.trim(),
    receipt_url: input.receipt_url,
    created_at: new Date().toISOString(),
  };

  state.donations.unshift(record);
  if (status === "verified" && campaign) {
    campaign.raised_amount_ngn += record.amount_ngn;
    campaign.donor_count += 1;
  }
  saveDemoState(state);
  return record;
}

