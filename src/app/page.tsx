import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { ORG } from "@/lib/org";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex max-w-4xl flex-col items-start gap-8 px-4 pb-8 pt-16">
        <div className="relative h-20 w-56">
          <Image
            src="/brand/aacsd-logo.jpg"
            alt={ORG.shortName}
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <div className="max-w-2xl space-y-4">
          <p className="font-display text-4xl font-semibold leading-tight text-navy sm:text-5xl">
            {ORG.shortName}
          </p>
          <p className="text-lg text-muted">{ORG.fullName}</p>
          <p className="text-base text-navy/80">
            Digital membership ID with live verification. Members show their card;
            staff scan the code to confirm Active status.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/admin/login"
              className="rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy/90"
            >
              Admin sign in
            </Link>
            <Link
              href="/scan"
              className="rounded-lg border border-navy/20 bg-white px-5 py-3 text-sm font-semibold text-navy hover:border-orange"
            >
              Scan / verify helper
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
