import envs from "@/utils/config";
export const ADMIN_ACCESS_COOKIE = "admin_access";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export type LoginCredentials = {
  email: string;
  password: string;
};

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function getAdminEmail(): string | undefined {
  return envs.admin.email;
}

export function isAdminEmail(email: string | undefined | null): boolean {
  const adminEmail = getAdminEmail();
  if (!adminEmail || !email) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

export function validateAdminToken(token: string): boolean {
  const expected = envs.admin.loginKey
  if (!expected) return false;
  return token === expected;
}

export function getAdminAccessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/admin",
  };
}

export function mapSupabaseAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Invalid email or password.";
  }
  return message;
}
