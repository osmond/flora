/**
 * Returns the current user id.
 *
 * Flora is currently single-user, so this is a hardcoded fallback until
 * Supabase Auth is added. The fallback must be a valid UUID so that queries
 * against columns typed as `uuid` do not error.
 */
import config from "./config";

export const SINGLE_USER_ID = config.SINGLE_USER_ID;

export function getCurrentUserId() {
  return SINGLE_USER_ID;
}
