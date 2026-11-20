"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createSession,
  destroySession,
  getSessionAdmin,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { newPublicToken, setMemberStatus, writeAudit } from "@/lib/members";
import { ORG } from "@/lib/org";
import { type MemberStatusValue } from "@/lib/status";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!admin || !(await verifyPassword(parsed.data.password, admin.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession(admin.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

const createSchema = z.object({
  displayName: z.string().trim().min(2).max(120),
  memberNumber: z.string().trim().min(2).max(40),
  graduationYear: z.coerce.number().int().min(1950).max(2100),
  validUntil: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export async function createMemberAction(formData: FormData) {
  const admin = await requireAdmin();

  const parsed = createSchema.safeParse({
    displayName: formData.get("displayName"),
    memberNumber: formData.get("memberNumber"),
    graduationYear: formData.get("graduationYear"),
    validUntil: formData.get("validUntil"),
    status: formData.get("status") || "ACTIVE",
  });

  if (!parsed.success) {
    return { error: "Check the form fields and try again." };
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return { error: "Photo is required." };
  }
  if (!photo.type.startsWith("image/")) {
    return { error: "Photo must be an image file." };
  }
  if (photo.size > 3 * 1024 * 1024) {
    return { error: "Photo must be under 3MB." };
  }

  const existing = await prisma.member.findUnique({
    where: { memberNumber: parsed.data.memberNumber },
  });
  if (existing) {
    return { error: "That membership number already exists." };
  }

  const publicToken = newPublicToken();
  const bytes = Buffer.from(await photo.arrayBuffer());
  const photoMime = photo.type || "image/jpeg";

  const member = await prisma.member.create({
    data: {
      displayName: parsed.data.displayName,
      memberNumber: parsed.data.memberNumber,
      graduationYear: parsed.data.graduationYear,
      department: ORG.defaultDepartment,
      validUntil: new Date(parsed.data.validUntil),
      status: parsed.data.status as MemberStatusValue,
      publicToken,
      photoMime,
      photoData: bytes,
      createdById: admin.id,
    },
  });

  await writeAudit({
    action: "CREATE",
    actorId: admin.id,
    memberId: member.id,
    meta: { memberNumber: member.memberNumber },
  });

  revalidatePath("/admin");
  redirect(`/admin/members/${member.id}`);
}

export async function toggleMemberStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const next = String(formData.get("next") || "");
  if (!id || (next !== "ACTIVE" && next !== "INACTIVE")) {
    throw new Error("Invalid status change.");
  }

  await setMemberStatus(id, next as MemberStatusValue, admin.id);
  revalidatePath("/admin");
  revalidatePath(`/admin/members/${id}`);
  redirect(`/admin/members/${id}`);
}

/** Guard helper for pages that should not call requireAdmin throw */
export async function optionalAdmin() {
  return getSessionAdmin();
}

export async function ensureSingleAdminPasswordCanChange(formData: FormData) {
  const admin = await requireAdmin();
  const password = String(formData.get("password") || "");
  if (password.length < 10) {
    return { error: "Password must be at least 10 characters." };
  }
  const passwordHash = await hashPassword(password);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });
  await writeAudit({ action: "PASSWORD_CHANGE", actorId: admin.id });
  return { ok: true as const };
}
