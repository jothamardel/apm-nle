"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  computeDemoAnalytics,
  getInitialDemoState,
  loadDemoState,
  recordDemoDonation,
  registerDemoMember,
  saveDemoState,
  signInDemoUser,
  signOutDemoUser,
  type DemoState,
} from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  ActionTeamId,
  AnalyticsSummary,
  DonationRecord,
  FundraisingCampaign,
  GalleryAlbum,
  MemberProfile,
  NewsPost,
  PvcStatus,
  SiteSettings,
  StateBreakdownRow,
  ToolkitItem,
  UserRole,
} from "@/types/database";

interface AppContextValue {
  isLiveSupabase: boolean;
  isHydrated: boolean;
  state: DemoState;
  currentUser: MemberProfile | null;
  analyticsSummary: AnalyticsSummary;
  stateBreakdown: StateBreakdownRow[];
  signIn: (email: string, quickRole?: UserRole) => MemberProfile | null;
  signOut: () => void;
  registerMember: (input: Parameters<typeof registerDemoMember>[0]) => MemberProfile;
  updateCurrentUser: (patch: Partial<MemberProfile>) => void;
  recordDonation: (input: Parameters<typeof recordDemoDonation>[0]) => DonationRecord;
  verifyDonation: (donationId: string, status: "verified" | "rejected") => void;
  addCampaign: (campaign: Omit<FundraisingCampaign, "id" | "raised_amount_ngn" | "donor_count">) => void;
  addGalleryAlbum: (album: Omit<GalleryAlbum, "id">) => void;
  addNewsPost: (post: Omit<NewsPost, "id">) => void;
  addToolkitItem: (item: Omit<ToolkitItem, "id">) => void;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  updateMemberRole: (memberId: string, role: UserRole, assignedStateId?: number | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(() => getInitialDemoState());
  const [isHydrated, setIsHydrated] = useState(false);
  const liveSupabase = isSupabaseConfigured();

  useEffect(() => {
    setState(loadDemoState());
    setIsHydrated(true);

    const onSync = () => setState(loadDemoState());
    window.addEventListener("nle-demo-state-changed", onSync);
    window.addEventListener("storage", onSync);
    return () => {
      window.removeEventListener("nle-demo-state-changed", onSync);
      window.removeEventListener("storage", onSync);
    };
  }, []);

  const currentUser = useMemo(() => {
    if (!state.currentUserId) return null;
    return state.members.find((m) => m.id === state.currentUserId) ?? null;
  }, [state.members, state.currentUserId]);

  const { summary: analyticsSummary, states: stateBreakdown } = useMemo(
    () => computeDemoAnalytics(state.members),
    [state.members]
  );

  const commit = useCallback((updater: (prev: DemoState) => DemoState) => {
    setState((prev) => {
      const next = updater(prev);
      saveDemoState(next);
      return next;
    });
  }, []);

  const signIn = useCallback((email: string, quickRole?: UserRole) => {
    const user = signInDemoUser(email, quickRole);
    setState(loadDemoState());
    return user;
  }, []);

  const signOut = useCallback(() => {
    signOutDemoUser();
    setState(loadDemoState());
  }, []);

  const registerMember = useCallback(
    (input: Parameters<typeof registerDemoMember>[0]) => {
      const created = registerDemoMember(input);
      setState(loadDemoState());
      return created;
    },
    []
  );

  const updateCurrentUser = useCallback(
    (patch: Partial<MemberProfile>) => {
      commit((prev) => {
        if (!prev.currentUserId) return prev;
        return {
          ...prev,
          members: prev.members.map((m) =>
            m.id === prev.currentUserId ? { ...m, ...patch } : m
          ),
        };
      });
    },
    [commit]
  );

  const recordDonation = useCallback(
    (input: Parameters<typeof recordDemoDonation>[0]) => {
      const rec = recordDemoDonation(input);
      setState(loadDemoState());
      return rec;
    },
    []
  );

  const verifyDonation = useCallback(
    (donationId: string, status: "verified" | "rejected") => {
      commit((prev) => {
        const target = prev.donations.find((d) => d.id === donationId);
        if (!target) return prev;
        const wasVerified = target.status === "verified";
        const donations = prev.donations.map((d) =>
          d.id === donationId ? { ...d, status } : d
        );
        const campaigns = prev.campaigns.map((c) => {
          if (c.id !== target.campaign_id) return c;
          if (!wasVerified && status === "verified") {
            return {
              ...c,
              raised_amount_ngn: c.raised_amount_ngn + target.amount_ngn,
              donor_count: c.donor_count + 1,
            };
          }
          if (wasVerified && status !== "verified") {
            return {
              ...c,
              raised_amount_ngn: Math.max(0, c.raised_amount_ngn - target.amount_ngn),
              donor_count: Math.max(0, c.donor_count - 1),
            };
          }
          return c;
        });
        return { ...prev, donations, campaigns };
      });
    },
    [commit]
  );

  const addCampaign = useCallback(
    (campaign: Omit<FundraisingCampaign, "id" | "raised_amount_ngn" | "donor_count">) => {
      commit((prev) => ({
        ...prev,
        campaigns: [
          {
            ...campaign,
            id: `camp-${Date.now()}`,
            raised_amount_ngn: 0,
            donor_count: 0,
          },
          ...prev.campaigns,
        ],
      }));
    },
    [commit]
  );

  const addGalleryAlbum = useCallback(
    (album: Omit<GalleryAlbum, "id">) => {
      commit((prev) => ({
        ...prev,
        albums: [{ ...album, id: `alb-${Date.now()}` }, ...prev.albums],
      }));
    },
    [commit]
  );

  const addNewsPost = useCallback(
    (post: Omit<NewsPost, "id">) => {
      commit((prev) => ({
        ...prev,
        news: [{ ...post, id: `news-${Date.now()}` }, ...prev.news],
      }));
    },
    [commit]
  );

  const addToolkitItem = useCallback(
    (item: Omit<ToolkitItem, "id">) => {
      commit((prev) => ({
        ...prev,
        toolkit: [{ ...item, id: `tk-${Date.now()}` }, ...prev.toolkit],
      }));
    },
    [commit]
  );

  const updateSettings = useCallback(
    (patch: Partial<SiteSettings>) => {
      commit((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
      }));
    },
    [commit]
  );

  const updateMemberRole = useCallback(
    (memberId: string, role: UserRole, assignedStateId?: number | null) => {
      commit((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.id === memberId
            ? { ...m, role, assigned_state_id: assignedStateId ?? null }
            : m
        ),
      }));
    },
    [commit]
  );

  return (
    <AppContext.Provider
      value={{
        isLiveSupabase: liveSupabase,
        isHydrated,
        state,
        currentUser,
        analyticsSummary,
        stateBreakdown,
        signIn,
        signOut,
        registerMember,
        updateCurrentUser,
        recordDonation,
        verifyDonation,
        addCampaign,
        addGalleryAlbum,
        addNewsPost,
        addToolkitItem,
        updateSettings,
        updateMemberRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export type { ActionTeamId, PvcStatus };

