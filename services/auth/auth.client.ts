import {
  AuthError,
  type LoginCredentials,
} from "@/services/auth/auth";
import { signInAction, signOutAction, getSessionAction } from "./auth.actions";

export type { LoginCredentials };
export { AuthError };

/** Client-side: sign in via Server Action. */
export async function signIn(credentials: LoginCredentials) {
  const result = await signInAction(credentials);

  if (result.error) {
    throw new AuthError(result.error);
  }

  return result;
}

/** Client-side: end session via Server Action. */
export async function signOut() {
  const result = await signOutAction();

  if (result.error) {
    throw new AuthError(result.error);
  }
}

/** Client-side: current session via Server Action. */
export async function getClientSession() {
  const result = await getSessionAction();

  if (result.error) {
    throw new AuthError(result.error);
  }

  return result.session;
}
