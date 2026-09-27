"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useState, type FormEvent } from "react";
import { pact } from "@/content/copy";
import { cn } from "@/lib/cn";
import { isValidEmail, subscribe } from "@/lib/subscribe";

type FormState =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const copy = pact.newsletter;

function validate(value: string): string | null {
  if (!value.trim()) return copy.empty;
  if (!isValidEmail(value)) return copy.invalid;
  return null;
}

/**
 * Launch-notes sign-up with honest states: it validates as you type once
 * you've tried to submit, never claims success it didn't get, and says so
 * plainly when the list isn't connected yet (see lib/subscribe.ts).
 */
export function NewsletterForm() {
  const id = useId();
  const inputId = `${id}-email`;
  const messageId = `${id}-message`;
  const [value, setValue] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [state, setState] = useState<FormState>({ kind: "idle" });

  const onChange = (next: string) => {
    setValue(next);
    if (!attempted) return;
    const problem = validate(next);
    setState(problem ? { kind: "invalid", message: problem } : { kind: "idle" });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    const problem = validate(value);
    if (problem) {
      setState({ kind: "invalid", message: problem });
      return;
    }
    setState({ kind: "submitting" });
    try {
      const result = await subscribe(value);
      if (result.ok) {
        setState({ kind: "success", message: copy.success });
        setValue("");
        setAttempted(false);
      } else if (result.reason === "invalid") {
        setState({ kind: "invalid", message: result.message });
      } else {
        setState({ kind: "error", message: result.message });
      }
    } catch {
      setState({ kind: "error", message: copy.network });
    }
  };

  const message = state.kind === "invalid" || state.kind === "success" || state.kind === "error" ? state.message : "";
  const invalid = state.kind === "invalid";
  const busy = state.kind === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} className="mx-auto w-full max-w-xl" aria-describedby={`${id}-sub`}>
      <h3 className="font-display text-3xl font-semibold text-bone md:text-4xl">{copy.heading}</h3>
      <p id={`${id}-sub`} className="mt-2 italic text-silver">
        {copy.sub}
      </p>

      <label htmlFor={inputId} className="label-mono mt-8 block text-[0.625rem] text-silver">
        {copy.label}
      </label>
      <div
        className={cn(
          "mt-3 flex flex-col border-b transition-colors duration-300 sm:flex-row sm:items-stretch",
          invalid ? "border-ember" : state.kind === "success" ? "border-gold" : "border-fog focus-within:border-gold",
        )}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={copy.placeholder}
          aria-invalid={invalid}
          aria-describedby={messageId}
          disabled={busy}
          className="min-w-0 flex-1 bg-transparent py-4 font-mono text-base tracking-wide text-bone outline-none placeholder:text-silver/45 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className="label-mono relative my-2 bg-gold px-6 py-3 text-abyss transition-[background-color,transform] duration-200 hover:bg-bone active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:my-2"
        >
          {busy ? copy.submitting : copy.submit}
        </button>
      </div>

      <div id={messageId} role="status" aria-live="polite" className="min-h-[3.5rem] pt-3">
        <AnimatePresence mode="wait" initial={false}>
          {message && (
            <m.p
              key={message}
              initial={{ opacity: 0, filter: "blur(6px)", y: 4 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
              className={cn(
                "text-[0.95rem] leading-relaxed",
                state.kind === "invalid" ? "text-ember" : state.kind === "success" ? "text-gold" : "text-bone/90",
              )}
            >
              {message}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
