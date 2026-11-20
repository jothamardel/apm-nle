import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateDonationRef } from "@/lib/format";
import { getSiteUrl, isPaystackConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const InitializeSchema = z.object({
  campaignId: z.string().nullable().optional(),
  donorName: z.string().min(2),
  donorEmail: z.string().email(),
  donorPhone: z.string().optional(),
  amountNgn: z.number().min(500).max(500_000_000),
  frequency: z.enum(["one_time", "monthly"]).default("one_time"),
  isAnonymous: z.boolean().default(false),
  message: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = InitializeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check your donation details and ensure amount is at least ₦500." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const reference = generateDonationRef("NLE");

    // If Paystack live/test keys aren't configured yet, let the client handle interactive Demo Checkout
    if (!isPaystackConfigured()) {
      return NextResponse.json({
        mode: "demo",
        reference,
        message: "Interactive Demo Mode: Paystack payment simulated cleanly.",
      });
    }

    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from("donations").insert({
        campaign_id: data.campaignId || null,
        user_id: user?.id ?? null,
        donor_name: data.isAnonymous ? "Anonymous Supporter" : data.donorName,
        donor_email: data.donorEmail,
        donor_phone: data.donorPhone ?? null,
        amount_ngn: data.amountNgn,
        currency: "NGN",
        frequency: data.frequency,
        payment_method: "paystack",
        reference,
        status: "pending",
        is_anonymous: data.isAnonymous,
        message: data.message ?? null,
      });
    }

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.donorEmail,
        amount: Math.round(data.amountNgn * 100), // Paystack expects kobo
        currency: "NGN",
        reference,
        callback_url: `${getSiteUrl()}/donate?reference=${encodeURIComponent(reference)}&status=success`,
        channels: ["card", "bank", "ussd", "bank_transfer", "apple_pay"],
        metadata: {
          donor_name: data.donorName,
          campaign_id: data.campaignId ?? "general",
          frequency: data.frequency,
          is_anonymous: data.isAnonymous,
        },
      }),
    });

    const json = await paystackRes.json();
    if (!paystackRes.ok || !json.status) {
      return NextResponse.json(
        { error: json.message || "Could not initialize Paystack checkout." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      mode: "live",
      reference,
      authorization_url: json.data.authorization_url,
      access_code: json.data.access_code,
    });
  } catch (err) {
    console.error("Paystack initialize error:", err);
    return NextResponse.json(
      { error: "Unable to process donation initialization right now." },
      { status: 500 }
    );
  }
}

