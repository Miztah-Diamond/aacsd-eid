import { ORG } from "@/lib/org";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-navy/10 px-4 py-8 text-sm text-muted">
      <div className="mx-auto max-w-4xl space-y-1">
        <p className="font-medium text-navy">{ORG.fullName}</p>
        <p>{ORG.address}</p>
        <p>
          <a className="hover:text-orange" href={`tel:${ORG.phone}`}>
            {ORG.phone}
          </a>
          {" · "}
          <a className="hover:text-orange" href={`mailto:${ORG.email}`}>
            {ORG.email}
          </a>
        </p>
        <p className="pt-2 text-navy/70">{ORG.motto}</p>
        <p className="pt-2">
          Sponsored by{" "}
          <a
            className="hover:text-orange"
            href="https://techzoidinnovation.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            techzoidinnovation.com
          </a>
        </p>
      </div>
    </footer>
  );
}
