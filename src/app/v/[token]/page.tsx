import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/db";
import { isEffectivelyActive } from "@/lib/members";
import { ORG } from "@/lib/org";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const member = await prisma.member.findUnique({ where: { publicToken: token } });

  if (!member) {
    return (
      <main className="mx-auto min-h-screen max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-navy">ID not found</h1>
        <p className="mt-2 text-muted">This code is not a valid AACSD membership ID.</p>
        <SiteFooter />
      </main>
    );
  }

  const active = isEffectivelyActive(member.status, member.validUntil);
  const reason =
    member.status !== "ACTIVE"
      ? "Membership deactivated"
      : !active
        ? "Membership expired (valid until date passed)"
        : null;

  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-10">
      <div className="relative mx-auto mb-6 h-14 w-44">
        <Image
          src="/brand/aacsd-logo.jpg"
          alt={ORG.shortName}
          fill
          className="object-contain"
          priority
        />
      </div>

      <div
        className={`rounded-2xl border p-6 text-center ${
          active
            ? "border-orange/40 bg-orange/10"
            : "border-red-200 bg-red-50"
        }`}
      >
        <p
          className={`text-3xl font-bold tracking-wide ${
            active ? "text-orange" : "text-red-700"
          }`}
        >
          {active ? "ACTIVE" : "INACTIVE"}
        </p>
        {reason ? <p className="mt-2 text-sm text-red-700">{reason}</p> : null}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-navy/10 bg-white">
        <div className="mx-auto aspect-square w-40 overflow-hidden bg-navy/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/photo/${member.publicToken}`}
            alt={member.displayName}
            className="h-full w-full object-cover"
          />
        </div>
        <dl className="space-y-2 p-5 text-sm">
          <Row label="Name" value={member.displayName} />
          <Row label="Membership No." value={member.memberNumber} />
          <Row label="Graduation year" value={String(member.graduationYear)} />
          <Row label="Valid until" value={formatDate(member.validUntil)} />
        </dl>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Issued by {ORG.shortName}. Match the photo to the person presenting this ID.
      </p>
      <p className="mt-2 text-center">
        <Link href={`/id/${member.publicToken}`} className="text-sm font-medium text-orange hover:underline">
          View full digital card
        </Link>
      </p>
      <SiteFooter />
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-navy/5 pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-navy">{value}</dd>
    </div>
  );
}
