import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

/**
 * One-time production bootstrap.
 * POST with header x-setup-secret: $SETUP_SECRET
 * Creates the single admin from ADMIN_EMAIL / ADMIN_PASSWORD if none exists.
 */
export async function POST(request: Request) {
  const expected = process.env.SETUP_SECRET;
  if (!expected || expected.length < 16) {
    return NextResponse.json({ error: "Setup disabled" }, { status: 403 });
  }

  const provided = request.headers.get("x-setup-secret");
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL / ADMIN_PASSWORD not configured" },
      { status: 500 },
    );
  }

  const count = await prisma.adminUser.count();
  if (count >= 1) {
    return NextResponse.json({ ok: true, message: "Admin already exists" });
  }

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.create({
    data: { email, passwordHash },
  });

  return NextResponse.json({ ok: true, message: `Admin created: ${email}` });
}
