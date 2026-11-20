import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { MemberStatus, type MemberStatusValue } from "@/lib/status";

export async function writeAudit(input: {
  action: string;
  actorId?: string | null;
  memberId?: string | null;
  meta?: Record<string, unknown>;
}) {
  await prisma.auditEvent.create({
    data: {
      action: input.action,
      actorId: input.actorId ?? null,
      memberId: input.memberId ?? null,
      metaJson: input.meta ? JSON.stringify(input.meta) : null,
    },
  });
}

export function newPublicToken() {
  return nanoid(21);
}

export function isEffectivelyActive(
  status: string,
  validUntil: Date,
  now = new Date(),
) {
  if (status !== MemberStatus.ACTIVE) return false;
  const end = new Date(validUntil);
  end.setHours(23, 59, 59, 999);
  return end.getTime() >= now.getTime();
}

export async function setMemberStatus(
  memberId: string,
  status: MemberStatusValue,
  actorId: string,
) {
  const member = await prisma.member.update({
    where: { id: memberId },
    data: { status },
  });
  await writeAudit({
    action: status === MemberStatus.ACTIVE ? "ACTIVATE" : "DEACTIVATE",
    actorId,
    memberId,
  });
  return member;
}
