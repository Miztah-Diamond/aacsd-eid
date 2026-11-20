import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const member = await prisma.member.findUnique({
    where: { publicToken: token },
    select: { photoData: true, photoMime: true },
  });

  if (!member) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(Buffer.from(member.photoData), {
    status: 200,
    headers: {
      "Content-Type": member.photoMime,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
