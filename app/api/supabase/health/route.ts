import { NextResponse } from "next/server";
import {
  getSupabaseConfig,
  SupabaseConfigError,
} from "@/lib/supabase/config";

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function GET() {
  let supabaseUrl: string;
  let publishableKey: string;

  try {
    ({ supabaseUrl, publishableKey } = getSupabaseConfig());
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json(
        { status: "not_configured" },
        { status: 503, headers: noStoreHeaders },
      );
    }

    throw error;
  }

  let response: Response;
  try {
    response = await fetch(new URL("/auth/v1/health", supabaseUrl), {
      headers: { apikey: publishableKey },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
  } catch (error) {
    if (
      error instanceof TypeError ||
      (error instanceof Error &&
        ["AbortError", "TimeoutError"].includes(error.name))
    ) {
      return NextResponse.json(
        { status: "unavailable" },
        { status: 503, headers: noStoreHeaders },
      );
    }

    throw error;
  }

  if (!response.ok) {
    return NextResponse.json(
      { status: "unavailable" },
      { status: 503, headers: noStoreHeaders },
    );
  }

  return NextResponse.json(
    { status: "connected" },
    { headers: noStoreHeaders },
  );
}
