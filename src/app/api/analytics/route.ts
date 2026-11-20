import { NextRequest, NextResponse } from "next/server";
import {
  computeDemoAnalytics,
  computeDemoLgaBreakdown,
  computeDemoPuBreakdown,
  computeDemoWardBreakdown,
  getInitialDemoState,
} from "@/lib/demo-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") ?? "summary";
  const stateId = Number(searchParams.get("stateId") ?? 0);
  const lgaId = Number(searchParams.get("lgaId") ?? 0);
  const wardId = Number(searchParams.get("wardId") ?? 0);

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    try {
      if (level === "summary") {
        const [{ data: summary }, { data: states }] = await Promise.all([
          supabase.rpc("get_public_analytics_summary"),
          supabase.rpc("get_state_breakdown"),
        ]);
        if (summary && states) {
          return NextResponse.json({ summary, states, source: "supabase" });
        }
      } else if (level === "lgas" && stateId) {
        const { data } = await supabase.rpc("get_lga_breakdown", { p_state_id: stateId });
        if (data) return NextResponse.json({ items: data, source: "supabase" });
      } else if (level === "wards" && lgaId) {
        const { data } = await supabase.rpc("get_ward_breakdown", { p_lga_id: lgaId });
        if (data) return NextResponse.json({ items: data, source: "supabase" });
      } else if (level === "pus" && wardId) {
        const { data } = await supabase.rpc("get_pu_breakdown", { p_ward_id: wardId });
        if (data) return NextResponse.json({ items: data, source: "supabase" });
      }
    } catch {
      // Fallback to demo aggregates when Supabase RPCs aren't deployed yet
    }
  }

  const demo = getInitialDemoState();
  if (level === "summary") {
    const { summary, states } = computeDemoAnalytics(demo.members);
    return NextResponse.json({ summary, states, source: "demo" });
  }
  if (level === "lgas" && stateId) {
    return NextResponse.json({
      items: computeDemoLgaBreakdown(stateId, demo.members),
      source: "demo",
    });
  }
  if (level === "wards" && stateId && lgaId) {
    return NextResponse.json({
      items: computeDemoWardBreakdown(stateId, lgaId, demo.members),
      source: "demo",
    });
  }
  if (level === "pus" && stateId && lgaId && wardId) {
    return NextResponse.json({
      items: computeDemoPuBreakdown(stateId, lgaId, wardId, demo.members),
      source: "demo",
    });
  }

  return NextResponse.json({ items: [], source: "demo" });
}

