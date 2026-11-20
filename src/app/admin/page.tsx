import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { getSessionAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { ORG } from "@/lib/org";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const members = await prisma.member.findMany({
    where: query
      ? {
          OR: [
            { displayName: { contains: query } },
            { memberNumber: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange">{ORG.shortName} Admin</p>
          <h1 className="text-2xl font-semibold text-navy">Members</h1>
          <p className="text-sm text-muted">{admin.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/members/new"
            className="rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange/90"
          >
            Create ID
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-navy/20 bg-white px-4 py-2 text-sm font-semibold text-navy"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <form className="mb-6">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search name or membership no."
          className="w-full max-w-md rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm"
        />
      </form>

      <div className="overflow-hidden rounded-xl border border-navy/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy/5 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">No.</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Valid until</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No members yet. Create the first ID.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-t border-navy/10 hover:bg-navy/[0.02]">
                  <td className="px-4 py-3">
                    <Link className="font-medium text-navy hover:text-orange" href={`/admin/members/${m.id}`}>
                      {m.displayName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{m.memberNumber}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        m.status === "ACTIVE"
                          ? "font-semibold text-orange"
                          : "font-semibold text-muted"
                      }
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(m.validUntil)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
