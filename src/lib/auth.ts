/**
 * Returns the current user id.
 *
 * Flora is currently single-user, so this is a hardcoded fallback until
 * Supabase Auth is added.
 */
export const SINGLE_USER_ID =
  process.env.NEXT_PUBLIC_SINGLE_USER_ID ?? "flora-single-user";

export function getCurrentUserId() {
  return SINGLE_USER_ID;
}
