import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { toggleMemberStatusAction } from "@/app/admin/actions";
import { getSessionAdmin } from "@/lib/auth";
import { cardUrl, verifyUrl } from "@/lib/codes";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) notFound();

  const nextStatus = member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-orange">
        ← Back to members
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-navy">{member.displayName}</h1>
      <p className="text-sm text-muted">Membership No. {member.memberNumber}</p>

      <dl className="mt-6 space-y-2 rounded-xl border border-navy/10 bg-white p-5 text-sm">
        <Row label="Status" value={member.status} />
        <Row label="Graduation year" value={String(member.graduationYear)} />
        <Row label="Department" value={member.department} />
        <Row label="Valid until" value={formatDate(member.validUntil)} />
        <Row label="Card URL" value={cardUrl(member.publicToken)} href={cardUrl(member.publicToken)} />
        <Row label="Verify URL" value={verifyUrl(member.publicToken)} href={verifyUrl(member.publicToken)} />
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/id/${member.publicToken}`}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white"
          target="_blank"
        >
          Open digital card
        </Link>
        <form action={toggleMemberStatusAction}>
          <input type="hidden" name="id" value={member.id} />
          <input type="hidden" name="next" value={nextStatus} />
          <button
            type="submit"
            className="rounded-lg border border-navy/20 bg-white px-4 py-2 text-sm font-semibold text-navy"
          >
            {nextStatus === "ACTIVE" ? "Activate" : "Deactivate"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="grid gap-1 border-b border-navy/5 pb-2 sm:grid-cols-[140px_1fr]">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-navy break-all">
        {href ? (
          <a className="text-orange hover:underline" href={href} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
