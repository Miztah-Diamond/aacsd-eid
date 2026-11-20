import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();
const photo = readFileSync("public/uploads/members/seed-photo.jpg");
const admin = await prisma.adminUser.findFirst();
if (!admin) {
  console.error("NO_ADMIN");
  process.exit(1);
}

const existing = await prisma.member.findUnique({
  where: { memberNumber: "AACSD-SMOKE-001" },
});
if (existing) {
  console.log(`token:${existing.publicToken}`);
  console.log(`id:${existing.id}`);
  await prisma.$disconnect();
  process.exit(0);
}

const token = nanoid(21);
const member = await prisma.member.create({
  data: {
    memberNumber: "AACSD-SMOKE-001",
    displayName: "Smoke Test Member",
    graduationYear: 2024,
    department: "Chinese Studies",
    validUntil: new Date("2027-12-31T00:00:00.000Z"),
    publicToken: token,
    status: "ACTIVE",
    photoMime: "image/jpeg",
    photoData: photo,
    createdById: admin.id,
  },
});

await prisma.auditEvent.create({
  data: {
    action: "CREATE",
    actorId: admin.id,
    memberId: member.id,
    metaJson: JSON.stringify({ smoke: true }),
  },
});

console.log(`token:${token}`);
console.log(`id:${member.id}`);
await prisma.$disconnect();
