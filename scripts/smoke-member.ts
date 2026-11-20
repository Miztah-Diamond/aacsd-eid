import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

async function main() {
  const dir = path.join(process.cwd(), "public", "uploads", "members");
  mkdirSync(dir, { recursive: true });
  const jpg = Buffer.from(
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=",
    "base64",
  );
  writeFileSync(path.join(dir, "seed-photo.jpg"), jpg);

  const admin = await prisma.adminUser.findFirst();
  if (!admin) throw new Error("no admin");

  const existing = await prisma.member.findUnique({ where: { memberNumber: "AACSD-001" } });
  if (existing) {
    console.log(JSON.stringify({ id: existing.id, token: existing.publicToken }));
    return;
  }

  const token = nanoid(21);
  const member = await prisma.member.create({
    data: {
      displayName: "Ada Okeke",
      memberNumber: "AACSD-001",
      graduationYear: 2018,
      department: "Chinese Studies",
      validUntil: new Date("2027-12-31"),
      publicToken: token,
      status: "ACTIVE",
      photoPath: "/uploads/members/seed-photo.jpg",
      createdById: admin.id,
    },
  });
  console.log(JSON.stringify({ id: member.id, token: member.publicToken }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
