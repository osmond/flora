import { headers } from "next/headers";

/**
 * Returns the identifier of the current user.
 *
 * In single-user mode, authentication is optional. If the `x-user-id` header
 * is missing, a default value of `flora-single-user` is returned so that the
 * app can operate without an auth provider.
 */
export async function getCurrentUserId(): Promise<string> {
  const headerList = await headers();
  const userId = headerList.get("x-user-id");
  return userId ?? "flora-single-user";
}

