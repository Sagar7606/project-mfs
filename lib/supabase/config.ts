export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    const missing = [
      !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
      !publishableKey && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ].filter(Boolean);

    throw new SupabaseConfigError(
      `Missing required Supabase environment variables: ${missing.join(", ")}.`,
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(supabaseUrl);
  } catch {
    throw new SupabaseConfigError(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid URL.",
    );
  }

  const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(
    parsedUrl.hostname,
  );
  if (
    (parsedUrl.protocol !== "https:" &&
      !(parsedUrl.protocol === "http:" && isLocalhost)) ||
    parsedUrl.username ||
    parsedUrl.password
  ) {
    throw new SupabaseConfigError(
      "NEXT_PUBLIC_SUPABASE_URL must use HTTPS, except for local development.",
    );
  }

  if (!publishableKey.startsWith("sb_publishable_")) {
    throw new SupabaseConfigError(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key. Never use a secret or service-role key.",
    );
  }

  return {
    supabaseUrl: parsedUrl.toString().replace(/\/+$/, ""),
    publishableKey,
  };
}
