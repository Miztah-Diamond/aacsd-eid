"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

type State = { error?: string } | undefined;

async function action(_prev: State, formData: FormData): Promise<State> {
  return loginAction(formData);
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-navy">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-navy/20 px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="font-medium text-navy">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-navy/20 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
