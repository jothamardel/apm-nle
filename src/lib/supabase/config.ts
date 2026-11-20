export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isPaystackConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY &&
      process.env.PAYSTACK_SECRET_KEY
  );
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://www.nlegrassroots.org")
  );
}

