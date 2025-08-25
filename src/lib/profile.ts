export interface UserProfile {
  id: string;
  feature_flags: string[] | null;
}

/**
 * Loads the current user's profile and feature flags from the API.
 */
export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const res = await fetch("/api/profile");
    if (!res.ok) return null;
    return (await res.json()) as UserProfile;
  } catch {
    return null;
  }
}
