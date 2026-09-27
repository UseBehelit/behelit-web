/**
 * Launch-notes sign-up.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ STUB — NOT CONNECTED TO ANY MAILING-LIST PROVIDER.                   │
 * │ `subscribe()` validates the address, then honestly reports that      │
 * │ nothing was stored. Replace the marked block with a real request     │
 * │ (your own route handler, Buttondown, Resend Audiences, …) and return │
 * │ `{ ok: true }` on success. The form UI already handles every result. │
 * └──────────────────────────────────────────────────────────────────────┘
 */

export type SubscribeFailure = "invalid" | "unconfigured" | "network";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: SubscribeFailure; message: string };

/**
 * Pragmatic address check: one "@", a non-empty local part, and a dotted
 * domain with a 2+ letter TLD. Deliberately looser than RFC 5322 — the
 * provider is the real validator; this only catches typos early.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export async function subscribe(email: string): Promise<SubscribeResult> {
  const address = email.trim();
  if (!isValidEmail(address)) {
    return {
      ok: false,
      reason: "invalid",
      message: "That address doesn't look complete — check for a typo.",
    };
  }

  // ── STUB: replace this block with the real submission ─────────────────
  await new Promise((resolve) => setTimeout(resolve, 420));
  return {
    ok: false,
    reason: "unconfigured",
    message:
      "The list isn't open yet, so nothing was stored. Write to app@behelit.dev and you'll be added by hand.",
  };
  // ── END STUB ───────────────────────────────────────────────────────────
}
