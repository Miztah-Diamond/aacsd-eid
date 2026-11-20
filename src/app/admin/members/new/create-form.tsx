"use client";

import { useActionState } from "react";
import { createMemberAction } from "@/app/admin/actions";

type State = { error?: string } | undefined;

async function action(_prev: State, formData: FormData): Promise<State> {
  return createMemberAction(formData);
}

export function CreateMemberForm() {
  const [state, formAction, pending] = useActionState(action, undefined);
  const year = new Date().getFullYear();

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-navy/10 bg-white p-6">
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <Field label="Full name" name="displayName" required />
      <Field label="Membership No." name="memberNumber" required />
      <Field
        label="Graduation year"
        name="graduationYear"
        type="number"
        required
        defaultValue={String(year)}
      />
      <Field label="Valid until" name="validUntil" type="date" required />

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-navy">Status</span>
        <select name="status" defaultValue="ACTIVE" className="w-full rounded-lg border border-navy/20 px-3 py-2">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-navy">Photo</span>
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="w-full text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-orange px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create ID"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-navy">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-navy/20 px-3 py-2"
      />
    </label>
  );
}
