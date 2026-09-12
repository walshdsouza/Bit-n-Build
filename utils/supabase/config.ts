/**
 * Is Supabase configured in this environment?
 *
 * The client factories assert their env vars with `!`, so calling them without
 * NEXT_PUBLIC_SUPABASE_* throws. That is fine inside a request handler, but a
 * server component that builds a client at the top level throws during
 * prerendering and fails the whole production build — which is exactly what
 * happens on a deploy host before the env vars are set.
 *
 * Call this first and degrade gracefully: auth and saved projects simply stay
 * unavailable, while translation (which needs no database) keeps working.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
