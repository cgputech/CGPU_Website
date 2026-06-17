"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { isAdminEmail, mapSupabaseAuthError, type LoginCredentials } from "@/services/auth/auth";

export async function signInAction(credentials: LoginCredentials) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (error) {
      return { error: mapSupabaseAuthError(error.message) };
    }

    if (!isAdminEmail(data.user?.email)) {
      await supabase.auth.signOut();
      return { error: "This account is not authorized for admin access." };
    }

    return { user: data.user };
  } catch (error: any) {
    console.error("Login action error:", error);
    return { error: "Internal server error" };
  }
}

export async function signOutAction() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Logout action error:", error);
    return { error: "Internal server error" };
  }
}

export async function getSessionAction() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return { error: error.message };
    }

    return { session };
  } catch (error: any) {
    console.error("Session action error:", error);
    return { error: "Internal server error" };
  }
}
