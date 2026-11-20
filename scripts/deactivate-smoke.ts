import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.member.update({
    where: { memberNumber: "AACSD-001" },
    data: { status: "INACTIVE" },
  });
  console.log("deactivated");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
