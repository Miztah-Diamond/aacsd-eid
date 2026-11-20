import Image from "next/image";
import { ORG } from "@/lib/org";
import { formatDate } from "@/lib/format";

type Props = {
  displayName: string;
  graduationYear: number;
  department: string;
  memberNumber: string;
  validUntil: Date;
  photoUrl: string;
  qrDataUrl: string;
  barcodeDataUrl: string;
  statusLabel?: string;
};

export function MemberCard({
  displayName,
  graduationYear,
  department,
  memberNumber,
  validUntil,
  photoUrl,
  qrDataUrl,
  barcodeDataUrl,
  statusLabel,
}: Props) {
  return (
    <article className="card-shell mx-auto w-full max-w-3xl">
      <div className="grid gap-6 p-5 sm:grid-cols-[140px_1fr] sm:p-7">
        <div className="flex flex-col gap-3">
          <div className="relative mx-auto h-16 w-40 sm:mx-0">
            <Image
              src="/brand/aacsd-logo.jpg"
              alt={ORG.shortName}
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="relative mx-auto aspect-square w-36 overflow-hidden rounded-xl border-2 border-navy/15 bg-navy/5 sm:mx-0 sm:w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-right text-sm font-bold tracking-wide text-navy sm:text-base">
              AACSD MEMBERSHIP ID CARD
            </h1>
            {statusLabel ? (
              <span
                className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
                  statusLabel === "Active"
                    ? "bg-orange/15 text-orange"
                    : "bg-navy/10 text-muted"
                }`}
              >
                {statusLabel}
              </span>
            ) : null}
          </div>

          <dl className="space-y-3 text-sm sm:text-base">
            <Field label="Name" value={displayName} />
            <Field label="Graduation Year" value={String(graduationYear)} />
            <Field label="Department" value={department} />
            <Field label="Membership No." value={memberNumber} />
            <Field label="Valid Until" value={formatDate(validUntil)} />
          </dl>
        </div>
      </div>

      <div className="relative mt-2 bg-navy px-5 pb-5 pt-8 text-white">
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-10 bg-navy [clip-path:ellipse(70%_100%_at_50%_100%)]" />
        <div className="relative z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs font-semibold tracking-[0.14em] sm:text-left sm:text-sm">
            {ORG.mottoUpper}
          </p>
          <div className="flex items-end gap-3 rounded-lg bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Verification QR code" className="h-24 w-24" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={barcodeDataUrl}
              alt="Verification barcode"
              className="h-14 w-36 object-contain"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 border-b border-navy/10 pb-2">
      <dt className="font-medium text-muted">{label}</dt>
      <dd className="font-semibold text-navy">{value}</dd>
    </div>
  );
}
