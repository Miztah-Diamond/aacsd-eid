import { notFound } from "next/navigation";
import { MemberCard } from "@/components/member-card";
import { SiteFooter } from "@/components/site-footer";
import { makeBarcodePngDataUrl, makeQrDataUrl } from "@/lib/codes";
import { prisma } from "@/lib/db";
import { isEffectivelyActive } from "@/lib/members";

export default async function DigitalIdPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const member = await prisma.member.findUnique({ where: { publicToken: token } });
  if (!member) notFound();

  const [qrDataUrl, barcodeDataUrl] = await Promise.all([
    makeQrDataUrl(member.publicToken),
    makeBarcodePngDataUrl(member.publicToken),
  ]);

  const active = isEffectivelyActive(member.status, member.validUntil);

  return (
    <main className="min-h-screen px-4 py-8">
      <MemberCard
        displayName={member.displayName}
        graduationYear={member.graduationYear}
        memberNumber={member.memberNumber}
        validUntil={member.validUntil}
        photoUrl={`/api/photo/${member.publicToken}`}
        qrDataUrl={qrDataUrl}
        barcodeDataUrl={barcodeDataUrl}
        statusLabel={active ? "Active" : "Inactive"}
      />
      <SiteFooter />
    </main>
  );
}
