"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ORG } from "@/lib/org";

export default function ScanPage() {
  const [manual, setManual] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera not available on this device. Paste a verify URL or token below.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        setError("Could not open camera. Use manual token entry.");
      }
    }

    void start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function goManual(e: React.FormEvent) {
    e.preventDefault();
    const raw = manual.trim();
    if (!raw) return;
    try {
      if (raw.includes("/v/") || raw.includes("/id/")) {
        const url = new URL(raw, window.location.origin);
        window.location.href = url.pathname.startsWith("/id/")
          ? url.pathname.replace("/id/", "/v/")
          : url.pathname;
        return;
      }
      window.location.href = `/v/${encodeURIComponent(raw)}`;
    } catch {
      setError("Could not parse that code.");
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Link href="/" className="text-sm text-muted hover:text-orange">
        ← Home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-navy">Scan helper</h1>
      <p className="mt-1 text-sm text-muted">
        {ORG.shortName} staff: open a verify link from a scanned QR, or paste the token.
        Phone cameras that open QR URLs can also scan the card QR directly.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy/10 bg-black">
        <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
      </div>
      {cameraReady ? (
        <p className="mt-2 text-sm text-muted">
          Point the phone camera app at the card QR for the fastest path, or paste below.
        </p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}

      <form onSubmit={goManual} className="mt-6 space-y-3">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-navy">Verify URL or token</span>
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            className="w-full rounded-lg border border-navy/20 px-3 py-2"
            placeholder="Paste /v/... link or token"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white"
        >
          Open verification
        </button>
      </form>
    </main>
  );
}
