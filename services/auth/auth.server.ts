import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { isAdminEmail } from "@/services/auth/auth";

/** Server-side: authenticated admin user, or null. */
export async function getAuthenticatedAdmin(): Promise<User | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

/** Server-side: true when Supabase session or admin_access cookie grants access. */
export async function hasAdminAccess(
  adminCookieValue: string | undefined,
): Promise<boolean> {
  if (adminCookieValue === "true") return true;
  const user = await getAuthenticatedAdmin();
  return user !== null;
}
