import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * Called by n8n at the end of a booking workflow (accept / deny / cancel).
 * n8n should POST: { "secret": "<REVALIDATE_SECRET>", "path": "/concierge" }
 * This triggers Next.js to re-fetch from Supabase so the concierge page
 * reflects the status that n8n wrote after the Cal.com API call.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET not configured" }, { status: 500 });
  }

  let body: { secret?: string; path?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = body.path ?? "/concierge";
  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
