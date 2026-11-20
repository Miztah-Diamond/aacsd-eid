import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateMemberForm } from "@/app/admin/members/new/create-form";
import { getSessionAdmin } from "@/lib/auth";
import { ORG } from "@/lib/org";

export default async function NewMemberPage() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-orange">
        ← Back to members
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-navy">Create membership ID</h1>
      <p className="mb-6 text-sm text-muted">{ORG.fullName}</p>
      <CreateMemberForm defaultDepartment={ORG.defaultDepartment} />
    </main>
  );
}
