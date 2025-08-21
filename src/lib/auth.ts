/**
 * Returns the current user id.
 *
 * Flora is currently single-user, so this is a hardcoded fallback until
 * Supabase Auth is added. The fallback must be a valid UUID so that queries
 * against columns typed as `uuid` do not error.
 */
export const SINGLE_USER_ID =
  process.env.NEXT_PUBLIC_SINGLE_USER_ID ??
  "00000000-0000-0000-0000-000000000000";

export function getCurrentUserId() {
  return SINGLE_USER_ID;
}
