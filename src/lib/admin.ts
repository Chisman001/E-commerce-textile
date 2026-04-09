/**
 * Comma-separated Clerk user IDs in ADMIN_USER_IDS (.env.local).
 * If unset or empty, no user passes as admin.
 */
export function isAdminUser(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const ids =
    process.env.ADMIN_USER_IDS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  return ids.length > 0 && ids.includes(userId);
}
