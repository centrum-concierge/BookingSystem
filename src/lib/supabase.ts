import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
}

// Service-role client — server-side only.
// Bypasses all Row Level Security policies.
// Never import this in client components or expose the key to the browser.
export const supabase = createClient(url, serviceKey.trim(), {
  auth: { persistSession: false },
});
