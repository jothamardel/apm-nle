import type {
  ActionTeamId,
  FundraisingCampaign,
  GalleryAlbum,
  NewsPost,
  SiteSettings,
  ToolkitItem,
} from "@/types/database";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  org_name: "NLE Makinde/Daura APM Grassroots Support Network",
  motto: "Reimagine. Reset. Rebuild",
  national_chairman: "Ms Nikurai Maton",
  secretariat_address:
    "No. 8 Rabo House Plaza, opp. Jos City Park, Mazaram Rayfield, Jos, Plateau State",
  contact_email: "info@nlegrassroots.org",
  contact_phone: "+234 (0) 803 000 2027",
  whatsapp_url: "https://chat.whatsapp.com/NLEGrassrootsNetworkOfficial",
  bank_name: "Zenith Bank Plc (Update in Admin Settings)",
  bank_account_name: "NLE Makinde/Daura APM Grassroots Support Network",
  bank_account_number: "1234567890",
  leadership: [
    {
      id: "ldr-1",
      name: "Ms Nikurai Maton",
      title: "National Chairman",
      zone_or_state: "National Secretariat — Rayfield, Jos",
      bio: "Leading the NLE Makinde/Daura APM Grassroots Support Network nationwide to mobilize everyday Nigerians across all 36 states and the FCT, protect every ballot, and channel community outreaches directly to party supporters.",
      is_featured: true,
    },
    {
      id: "ldr-2",
      name: "National Organizing Secretary",
      title: "Director of Grassroots & Polling Unit Operations",
      zone_or_state: "National Secretariat — Editable in Admin",
      bio: "Coordinates State, LGA, Ward, and Polling Unit captains across Nigeria's 176,846 polling units for the Protect The Ballots network.",
    },
    {
      id: "ldr-3",
      name: "Director of Digital & Media Strategy",
      title: "Social Media Team Coordinator",
      zone_or_state: "Nationwide & Diaspora — Editable in Admin",
      bio: "Equips thousands of young Nigerians—PVC holders and non-voters alike—with factual Reset Agenda messaging, rapid response graphics, and state-level digital hubs.",
    },
    {
      id: "ldr-4",
      name: "National Treasurer & Outreach Lead",
      title: "Fundraising & Member Welfare Directorate",
      zone_or_state: "National Secretariat — Editable in Admin",
      bio: "Oversees transparent grassroots fundraising drives, relief outreaches, and member support interventions across local chapters.",
    },
  ],
  social_links: {
    x: "https://x.com/nlegrassroots",
    instagram: "https://instagram.com/nlegrassroots",
    facebook: "https://facebook.com/nlegrassroots",
    youtube: "https://youtube.com/@nlegrassroots",
  },
};

export const ACTION_TEAMS: Record<
  ActionTeamId,
  {
    id: ActionTeamId;
    title: string;
    badge: string;
    tagline: string;
    description: string;
    nonPvcFriendly: boolean;
    commitments: string[];
  }
> = {
  protect_ballots: {
    id: "protect_ballots",
    title: "Protect The Ballots",
    badge: "Polling Unit Defense",
    tagline: "Stand guard where democracy actually happens — your Polling Unit.",
    description:
      "Trained community observers, ward situation-room volunteers, and polling unit agents ensuring transparent accreditation, peaceful voting, and verified results across all 176,846 INEC polling units.",
    nonPvcFriendly: true,
    commitments: [
      "Monitor accreditation, voting, and open counting at your ward or polling unit",
      "Document official EC8A result sheets for rapid situation-room collation",
      "Support peaceful voter turnout, accessibility, and logistics on election day",
    ],
  },
  social_media: {
    id: "social_media",
    title: "Social Media Team",
    badge: "Digital Vanguard",
    tagline: "No PVC? Abroad? Working election day? Your voice still shifts millions.",
    description:
      "Turn sidelines into frontline momentum. Amplify Governor Seyi Makinde and Alhaji Lawal Musa Daura's Reset Agenda 2027, counter misinformation in real time, and mobilize communities across WhatsApp, X, TikTok, Instagram, and Facebook.",
    nonPvcFriendly: true,
    commitments: [
      "Share verified Reset Nigeria talking points, outreach photos, and infographics",
      "Counter disinformation in community WhatsApp groups and local forums",
      "Recruit supporters into State and Ward digital mobilization rooms",
    ],
  },
  grassroots_mobilization: {
    id: "grassroots_mobilization",
    title: "Grassroots Mobilization",
    badge: "Door-to-Door Network",
    tagline: "Build unstoppable ward-by-ward presence in every LGA.",
    description:
      "Host town halls, market engagements, youth dialogues, and neighbor-to-neighbor voter education across urban centers and rural wards.",
    nonPvcFriendly: true,
    commitments: [
      "Coordinate ward meetings and community listening sessions",
      "Assist first-time voters with INEC PVC registration and collection awareness",
      "Grow verified membership across every street in your LGA",
    ],
  },
  fundraising_outreach: {
    id: "fundraising_outreach",
    title: "Fundraising & Outreach",
    badge: "Community Support",
    tagline: "Support party members and lift vulnerable communities together.",
    description:
      "Organize micro-fundraising drives, medical & food outreaches, and member welfare initiatives that demonstrate APM's people-first politics before election day.",
    nonPvcFriendly: true,
    commitments: [
      "Plan and volunteer at local charity, empowerment, and party-member outreaches",
      "Champion transparent grassroots micro-donations within your network",
      "Document outreach impact for the NLE public gallery",
    ],
  },
};

export const RESET_AGENDA_PILLARS = [
  {
    number: "01",
    title: "Economy — Broad-Based Growth & Productivity",
    source: "Adapted from The Reset Agenda 2027 (seyimakinde.com)",
    summary:
      "Lower the structural cost of doing business, unlock decentralized electricity markets and domestic refining capacity, boost agribusiness and food production, and translate macroeconomic stability directly into household incomes and jobs.",
    highlights: [
      "Decentralized power & hybrid energy frameworks proven in Oyo State",
      "Targeted agricultural production to bring down food & transport inflation",
      "Public-private partnerships (PPPs) empowering MSMEs and the informal sector",
    ],
  },
  {
    number: "02",
    title: "Security — Intelligence-Led & Accountable Protection",
    source: "Makinde / Daura Joint Mandate",
    summary:
      "Shift from reactive crisis response to proactive, intelligence-led prevention combining Alhaji Lawal Musa Daura's 30+ years of national intelligence leadership with Engr. Seyi Makinde's sub-national community security record.",
    highlights: [
      "Early-warning intelligence integrated with local community communication networks",
      "Seamless inter-agency coordination and rapid-response accountability",
      "Strengthening state & community security frameworks modeled on successful regional patrols",
    ],
  },
  {
    number: "03",
    title: "Education — Capabilities Over Credentials",
    source: "Adapted from The Reset Agenda 2027 (seyimakinde.com)",
    summary:
      "Rebuild public education around functional skills, productivity, and regional context—ensuring every child acquires real-world capabilities, not just certificates.",
    highlights: [
      "Free basic public education access backed by school grants and learning materials",
      "Technical, digital, and vocational capability tracks aligned with modern jobs",
      "Prompt teacher & civil servant welfare so educators focus on excellence",
    ],
  },
  {
    number: "04",
    title: "Socio-Political Reform — A Restructured, Accountable Federation",
    source: "APM Manifesto & Reset Nigeria Blueprint (apm.org.ng)",
    summary:
      "Devolve authority and matching fiscal responsibility away from an overburdened center to federating units, enforce rule of law, and bind public officials to measurable citizen performance contracts.",
    highlights: [
      "True federalism & institutional devolution empowering states and LGAs",
      "APM citizen performance bonds enforcing integrity, sacrifice, and service",
      "Placing everyday and marginalized Nigerians at the center of public policy",
    ],
  },
];

export const PRINCIPALS_BIO = {
  makinde: {
    name: "Engr. Oluseyi Abiodun Makinde, FNSE",
    role: "APM Presidential Candidate — The Reset Agenda 2027",
    headline: "Engineer. Entrepreneur. Two-Term Governor of Oyo State.",
    source: "Sourced from seyimakinde.com & public records",
    summary:
      "Born in Ibadan on December 25, 1967, Seyi Makinde is an Electrical Engineering graduate of the University of Lagos (UNILAG) with executive training at MIT and Lagos Business School. Starting as an engineer with Shell before founding the Makon Group at age 29, he brought private-sector discipline into governance as Executive Governor of Oyo State (2019–present).",
    trackRecord: [
      "Consistent year-on-year Internally Generated Revenue (IGR) growth driven by structural economic & agribusiness reforms",
      "Prompt monthly payment of civil servant salaries and settlement of legacy retiree pensions",
      "Major multi-modal bus terminals, dualized inter-city highways, and the 'Light Up Oyo' infrastructure drive",
      "Foundational leadership in establishing regional community security ('Operation Amotekun') and sub-national electricity frameworks",
      "Abolition of public school fees alongside direct grants and primary healthcare expansion across rural communities",
    ],
  },
  daura: {
    name: "Alhaji Lawal Musa Daura, mni",
    role: "APM Vice-Presidential Candidate",
    headline: "Veteran National Security Strategist & Intelligence Administrator.",
    source: "Sourced from seyimakinde.org & APM Convention records",
    summary:
      "Born in Daura, Katsina State, Alhaji Lawal Musa Daura is an alumnus of Ahmadu Bello University (ABU), Zaria, and the prestigious National Institute for Policy and Strategic Studies (NIPSS), Kuru, Jos (mni). Unveiled as the APM Vice-Presidential running mate at the August 13, 2026 APM National Convention in Bauchi, he brings over three decades of frontline national security leadership—from joining state intelligence in 1982 to serving as State Director of Security across multiple states and Director-General of the DSS (2015–2018).",
    trackRecord: [
      "Over 35 years of strategic experience in national intelligence, threat prevention, and public administration",
      "Alumnus of NIPSS Kuru, Jos — deep institutional grounding in Nigerian policy and federal governance",
      "Anchor for Pillar II of The Reset Agenda 2027: Intelligence-led early warning and accountable inter-agency security coordination",
    ],
  },
  apm: {
    name: "Allied Peoples Movement (APM)",
    slogan: "APM — Nigeria First",
    motto: "Integrity, Sacrifice, Service",
    colors: "White, Green, and Gold",
    nationalSecretariat:
      "Plot 232, No. 2 Leventis Building, Samuel Adesujo Ademulegun Street, Central Business District (CBD), Abuja, FCT",
    nationalChairman: "Yusuf Mamman Dantalle",
    nationalSecretary: "Oyadeyi Adebayo Ayodele",
    officialWebsite: "https://apm.org.ng",
    membershipPortal: "https://members-register.apm.org.ng",
    mission:
      "To promote good governance, empower citizens, and build a better future for all Nigerians.",
    vision:
      "To build a united, peaceful, and prosperous Nigeria driven by good leadership, equality, and sustainable development.",
  },
};

export const NON_PVC_CALLOUT_POINTS = [
  {
    title: "Staying on the Sidelines Hands the Incumbent an Automatic Win",
    body: "Political apathy is never neutral. Every citizen who says 'I don't have a PVC' or 'I won't vote' leaves the field uncontested. You are still a Nigerian with a stake in the country's future — and this movement has a frontline role built specifically for you.",
  },
  {
    title: "Power the Digital & Social Media Frontline",
    body: "You don't need a PVC to join our Social Media Team. One well-informed WhatsApp broadcast, TikTok explainer, or X thread convinces ten neighbors who DO have PVCs to show up and vote for a real reset.",
  },
  {
    title: "Support Grassroots Welfare & Outreaches",
    body: "Help organize local food drives, community dialogues, town halls, and micro-fundraising outreaches that show Nigerians what compassionate, people-first governance looks like right now.",
  },
  {
    title: "Observe, Document & Protect Democracy",
    body: "Help coordinate ward logistics, transport elderly voters, track official announcements, and share real-time citizen reports to keep every polling unit transparent and peaceful.",
  },
];

export const SEED_CAMPAIGNS: FundraisingCampaign[] = [
  {
    id: "camp-general",
    slug: "general-movement-fund",
    title: "NLE Grassroots General Movement Fund",
    summary:
      "Sustain nationwide ward organizing, digital mobilization tools, and member welfare across all 36 states & FCT.",
    description:
      "Your contribution to the General Movement Fund powers day-to-day grassroots operations from our Mazaram Rayfield National Secretariat across all 774 LGAs—funding town halls, voter education flyers, ward coordination, and rapid community outreach interventions.",
    location_label: "Nationwide (36 States + FCT)",
    target_amount_ngn: 25000000,
    raised_amount_ngn: 14850000,
    donor_count: 618,
    cover_image_url: "/images/outreach-general.svg",
    is_general_fund: true,
    is_active: true,
  },
  {
    id: "camp-ballots",
    slug: "protect-the-ballots-fund",
    title: "Protect The Ballots — Polling Unit Training & Kits",
    summary:
      "Equip and train grassroots polling unit observers and ward situation rooms across key states.",
    description:
      "Help train, accredit, and equip community observers with polling unit handbooks, communication airtime, and situation-room tools so every single vote cast for the Makinde/Daura APM ticket is counted and protected.",
    location_label: "All 176,846 Polling Units Target",
    target_amount_ngn: 18000000,
    raised_amount_ngn: 11240000,
    donor_count: 429,
    cover_image_url: "/images/outreach-ballots.svg",
    is_general_fund: false,
    is_active: true,
    ends_at: "2027-01-10",
  },
  {
    id: "camp-jos-outreach",
    slug: "plateau-north-central-welfare-outreach",
    title: "Plateau & North-Central Member Support Outreach",
    summary:
      "Direct food relief, micro-business support, and healthcare outreach for grassroots party members and families.",
    description:
      "Anchored from Jos South & Jos North in Plateau State and expanding across Benue, Nasarawa, Niger, Kogi, and Kwara, this fundraising outreach directly supports vulnerable families, women traders, and youth artisans within our party chapters.",
    location_label: "Jos, Plateau State & North Central",
    target_amount_ngn: 8500000,
    raised_amount_ngn: 6320000,
    donor_count: 274,
    cover_image_url: "/images/outreach-relief.svg",
    is_general_fund: false,
    is_active: true,
    ends_at: "2026-12-20",
  },
];

export const SEED_GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: "alb-1",
    slug: "rayfield-jos-secretariat-inauguration",
    title: "Rayfield National Secretariat Commissioning & Mobilization Launch",
    summary:
      "National Chairman Ms Nikurai Maton commissioned the NLE Makinde/Daura APM Grassroots Support Network Secretariat at No. 8 Rabo House Plaza, Mazaram Rayfield, Jos, welcoming delegates from 19 states.",
    event_date: "2026-10-18",
    state_id: 32,
    state_name: "Plateau",
    location_name: "Mazaram Rayfield, Jos South LGA",
    category: "Grassroots Outreach",
    cover_image_url: "/images/gallery-jos-launch.svg",
    is_published: true,
    photos: [
      {
        id: "ph-1",
        url: "/images/gallery-jos-launch.svg",
        caption:
          "Ribbon cutting and grassroots delegates gathered outside No. 8 Rabo House Plaza, Mazaram Rayfield, Jos.",
        photographer: "NLE Media Team",
      },
      {
        id: "ph-2",
        url: "/images/outreach-relief.svg",
        caption:
          "Ms Nikurai Maton addressing Plateau State Ward Captains and Youth Coordinators on the Reimagine. Reset. Rebuild vision.",
        photographer: "NLE Media Team",
      },
      {
        id: "ph-3",
        url: "/images/outreach-general.svg",
        caption:
          "Live enrollment desk onboarding first-time volunteers into Protect The Ballots and the Social Media Team.",
        photographer: "NLE Media Team",
      },
    ],
  },
  {
    id: "alb-2",
    slug: "bauchi-apm-convention-delegation",
    title: "APM National Convention Solidarity — Bauchi Delegation",
    summary:
      "NLE Grassroots coordinators mobilized in full White, Green, and Gold at Rilwanu Adamu Square in Bauchi as Engr. Seyi Makinde and Alhaji Lawal Musa Daura were unveiled as APM's 2027 standard-bearers.",
    event_date: "2026-08-13",
    state_id: 5,
    state_name: "Bauchi",
    location_name: "Rilwanu Adamu Square, Bauchi",
    category: "National Convention",
    cover_image_url: "/images/gallery-bauchi-convention.svg",
    is_published: true,
    photos: [
      {
        id: "ph-4",
        url: "/images/gallery-bauchi-convention.svg",
        caption:
          "Grassroots banners celebrating the Makinde/Daura APM presidential ticket in Bauchi.",
        photographer: "APM Convention Press",
      },
      {
        id: "ph-5",
        url: "/images/outreach-ballots.svg",
        caption:
          "Cross-regional unity meeting between North-Central, North-West, and South-West NLE coordinators.",
        photographer: "NLE Media Team",
      },
    ],
  },
  {
    id: "alb-3",
    slug: "ibadan-youth-social-media-bootcamp",
    title: "Oyo Youth & Social Media Team Bootcamp — 'No PVC? Still Part of the Cause'",
    summary:
      "Over 450 young creators, students, and community organizers gathered in Ibadan to launch the NLE Digital Vanguard and share Reset Agenda 2027 stories.",
    event_date: "2026-09-26",
    state_id: 31,
    state_name: "Oyo",
    location_name: "Ibadan North LGA, Oyo State",
    category: "Youth & Women Summit",
    cover_image_url: "/images/gallery-oyo-youth.svg",
    is_published: true,
    photos: [
      {
        id: "ph-6",
        url: "/images/gallery-oyo-youth.svg",
        caption:
          "Social Media Team volunteers producing local-language video explainers on Pillar I (Economy) and Pillar III (Education).",
        photographer: "Oyo Digital Hub",
      },
      {
        id: "ph-7",
        url: "/images/outreach-general.svg",
        caption:
          "Interactive breakout session welcoming young Nigerians without PVCs into digital and ward support roles.",
        photographer: "Oyo Digital Hub",
      },
    ],
  },
  {
    id: "alb-4",
    slug: "katsina-daura-community-relief-outreach",
    title: "Katsina & Daura Market Women Welfare & Town Hall Outreach",
    summary:
      "Funded entirely through NLE member micro-donations, our North-West outreach delivered essential household packs and hosted a grassroots listening dialogue on security and agriculture.",
    event_date: "2026-10-05",
    state_id: 21,
    state_name: "Katsina",
    location_name: "Daura & Katsina LGA",
    category: "Community Relief",
    cover_image_url: "/images/outreach-relief.svg",
    is_published: true,
    photos: [
      {
        id: "ph-8",
        url: "/images/outreach-relief.svg",
        caption:
          "Grassroots welfare distribution supporting party members and market women associations in Daura.",
        photographer: "Katsina Chapter Media",
      },
      {
        id: "ph-9",
        url: "/images/gallery-jos-launch.svg",
        caption:
          "Community town hall discussing intelligence-led rural security under the Makinde/Daura ticket.",
        photographer: "Katsina Chapter Media",
      },
    ],
  },
  {
    id: "alb-5",
    slug: "abuja-protect-the-ballots-training",
    title: "FCT Protect The Ballots — Polling Unit Captain Workshop",
    summary:
      "Hands-on civic training in Abuja Municipal (AMAC) preparing Ward and Polling Unit coordinators on lawful election observation, EC8A verification, and voter assistance.",
    event_date: "2026-11-02",
    state_id: 15,
    state_name: "FCT Abuja",
    location_name: "AMAC, FCT Abuja",
    category: "Ballot Protection Training",
    cover_image_url: "/images/outreach-ballots.svg",
    is_published: true,
    photos: [
      {
        id: "ph-10",
        url: "/images/outreach-ballots.svg",
        caption:
          "Ward captains reviewing Polling Unit coverage dashboards and lawful observation checklists.",
        photographer: "FCT Media Desk",
      },
    ],
  },
];

export const SEED_NEWS_POSTS: NewsPost[] = [
  {
    id: "news-1",
    slug: "nle-grassroots-launches-digital-network-and-analytics",
    title:
      "Ms Nikurai Maton Unveils NLE Digital Grassroots Portal Covering All 774 LGAs & 176,846 Polling Units",
    excerpt:
      "Speaking from Mazaram Rayfield in Jos, the National Chairman called on every Nigerian—including those without a PVC—to step off the sidelines and join the Reset Nigeria movement.",
    body: `From our National Secretariat at No. 8 Rabo House Plaza, Mazaram Rayfield, Jos, National Chairman Ms Nikurai Maton has officially launched the NLE Makinde/Daura APM Grassroots Support Network digital platform (www.nlegrassroots.org).

The platform brings full transparency and precision to grassroots mobilization by enabling supporters in every State, Local Government Area, Ward, and Polling Unit to register, download their digital membership card, join Action Teams, and fund community outreaches directly.

"Too many Nigerians tell themselves, 'I don't have a PVC' or 'I won't go and vote,' and stay on the sidelines—which automatically hands the incumbent a win," Ms Maton emphasized. "You are Nigerian whether you hold a PVC today or not. Join our Social Media Team, support our community outreaches, mobilize your family, or help Protect The Ballots. Every single hand counts as we Reimagine, Reset, and Rebuild Nigeria under the Makinde/Daura APM ticket."`,
    category: "Official Statement",
    source_attribution: "NLE National Secretariat, Jos",
    cover_image_url: "/images/gallery-jos-launch.svg",
    author_name: "NLE National Media Directorate",
    published_at: "2026-11-12",
    is_published: true,
  },
  {
    id: "news-2",
    slug: "reset-agenda-2027-four-pillars-explained",
    title:
      "Inside The Reset Agenda 2027: How Engr. Seyi Makinde & Alhaji Lawal Daura Plan to Rebuild Institutions",
    excerpt:
      "Anchored on four interconnected pillars—Economy, Intelligence-Led Security, Functional Education, and Socio-Political Reform—the blueprint prioritizes practical problem-solving over politics as usual.",
    body: `Unveiled under the banner "Reset Nigeria: Nigeria First, The People Always," The Reset Agenda 2027 outlines a three-year structural implementation roadmap rooted in verifiable governance performance.

Drawing directly on Governor Seyi Makinde's two-term record in Oyo State—where disciplined IGR growth, prompt worker and pensioner welfare, decentralized electricity legislation, and agribusiness transformation delivered measurable gains—and paired with Alhaji Lawal Musa Daura's three decades of national security leadership, the agenda tackles Nigeria's hardest challenges systematically:

1. Economy: Unlocking domestic production, power sector decentralization, and agricultural output to bring down the cost of living.
2. Security: Moving from reactive crisis response to intelligence-led early warning and accountable inter-agency protection.
3. Education: Reforming learning around practical capabilities and productivity rather than paper credentials alone.
4. Socio-Political Reform: Devolving power and fiscal responsibility to federating states while holding public officers to APM's citizen performance bonds.`,
    category: "Policy & Vision",
    source_attribution: "Adapted from seyimakinde.com & apm.org.ng",
    cover_image_url: "/images/gallery-bauchi-convention.svg",
    author_name: "Policy & Research Desk",
    published_at: "2026-11-04",
    is_published: true,
  },
  {
    id: "news-3",
    slug: "protect-the-ballots-recruitment-crosses-36-states",
    title:
      "Protect The Ballots & Social Media Vanguard Expand Across 36 States Ahead of 2027 Polls",
    excerpt:
      "State Coordinators report surging sign-ups from youth, women groups, and diaspora advocates committing to lawful polling unit defense and fact-based digital mobilization.",
    body: `Grassroots sign-ups for NLE's twin flagship Action Calls—Protect The Ballots and the Social Media Team—have reached every geopolitical zone across Nigeria's 36 states and the FCT.

Through the new live Analytics Explorer on www.nlegrassroots.org, coordinators and everyday supporters can now track real aggregate coverage from State down to LGA, Ward, and Polling Unit—identifying where additional mobilization and outreach support are needed most.

Supporters can also contribute directly to the Protect The Ballots Training Fund or local community relief outreaches via Paystack or verified bank transfer.`,
    category: "Grassroots Mobilization",
    source_attribution: "NLE Organizing Directorate",
    cover_image_url: "/images/outreach-ballots.svg",
    author_name: "Grassroots Organizing Desk",
    published_at: "2026-10-28",
    is_published: true,
  },
];

export const SEED_TOOLKIT_ITEMS: ToolkitItem[] = [
  {
    id: "tk-1",
    title: "Official National WhatsApp Mobilization Hub",
    description:
      "Join verified national announcements, weekly outreach briefings, and rapid-response campaign updates.",
    category: "whatsapp_group",
    external_url: "https://chat.whatsapp.com/NLEGrassrootsNetworkOfficial",
    action_team: "grassroots_mobilization",
  },
  {
    id: "tk-2",
    title: "Social Media Team Rapid-Response Telegram & WhatsApp Room",
    description:
      "Get daily Reset Agenda 2027 graphics, short-form video scripts, and trending hashtag schedules.",
    category: "whatsapp_group",
    external_url: "https://t.me/NLE_APM_SocialMediaVanguard",
    action_team: "social_media",
  },
  {
    id: "tk-3",
    title: "WhatsApp Broadcast Copy — 'No PVC? Don't Stay on the Sidelines'",
    description:
      "Ready-to-share message for friends and family groups encouraging non-voters and youth to join the cause.",
    category: "talking_point",
    action_team: "social_media",
    content_text:
      "Even if you don't have a PVC yet, staying silent hands the incumbent an automatic win. You're still a Nigerian and your voice matters! Join the NLE Makinde/Daura APM Grassroots Support Network Social Media Team or Community Outreach today — Reimagine. Reset. Rebuild: https://www.nlegrassroots.org/join",
  },
  {
    id: "tk-4",
    title: "Reset Agenda 2027 — 4 Pillars Elevator Pitch",
    description:
      "Concise talking points summarizing Engr. Seyi Makinde & Alhaji Lawal Musa Daura's APM platform.",
    category: "talking_point",
    action_team: "social_media",
    content_text:
      "Why Makinde/Daura on the APM ticket? 1) Economy: proven Oyo IGR growth, decentralized power & agribusiness to cut food costs. 2) Security: intelligence-led early warning anchored by 35+ years of security leadership. 3) Education: capabilities over credentials. 4) True Federalism & Accountability. Nigeria First — join at www.nlegrassroots.org",
  },
  {
    id: "tk-5",
    title: "Protect The Ballots — Lawful Polling Unit Observer Checklist",
    description:
      "Step-by-step civic guide for peaceful accreditation monitoring, vote counting observation, and EC8A verification.",
    category: "guide",
    action_team: "protect_ballots",
    content_text:
      "1. Arrive at your Polling Unit before 8:00 AM with your NLE Member ID. 2. Observe BVAS setup and peaceful voter queues calmly and lawfully. 3. Assist elderly or first-time voters with non-partisan directions outside the voting cubicle. 4. Stay until open sorting, counting, and public pasting of Form EC8A. 5. Upload verified public totals to your Ward Coordinator.",
  },
  {
    id: "tk-6",
    title: "Official Square Campaign Graphic — Reimagine. Reset. Rebuild",
    description:
      "High-contrast White, Green, and Gold graphic sized for WhatsApp Status, Instagram, X, and Facebook.",
    category: "graphic",
    asset_url: "/images/gallery-jos-launch.svg",
    action_team: "social_media",
  },
];

