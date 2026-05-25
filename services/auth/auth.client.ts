import { createClient } from "@/utils/supabase/client";
import {
  AuthError,
  isAdminEmail,
  mapSupabaseAuthError,
  type LoginCredentials,
} from "@/services/auth/auth";

export type { LoginCredentials };
export { AuthError };

/** Client-side: sign in with Supabase and enforce admin email. */
export async function signIn(credentials: LoginCredentials) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email.trim(),
    password: credentials.password,
  });

  if (error) {
    throw new AuthError(mapSupabaseAuthError(error.message));
  }

  if (!isAdminEmail(data.user?.email)) {
    await supabase.auth.signOut();
    throw new AuthError("This account is not authorized for admin access.");
  }

  return data;
}

/** Client-side: end Supabase session. */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new AuthError(error.message);
  }
}

/** Client-side: current session (if any). */
export async function getClientSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new AuthError(error.message);
  }
  return data.session;
}
