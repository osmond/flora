import { headers } from "next/headers";

/**
 * Returns the identifier of the currently authenticated user.
 *
 * The ID is extracted from the `x-user-id` header which is expected to be
 * populated by upstream authentication middleware. An error is thrown when the
 * header is missing to signal unauthenticated access.
 */
export function getCurrentUserId(): string {
  const userId = headers().get("x-user-id");
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

