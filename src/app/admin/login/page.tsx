import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/login-form";
import { getSessionAdmin } from "@/lib/auth";
import { ORG } from "@/lib/org";

export default async function AdminLoginPage() {
  const admin = await getSessionAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-4 py-12">
      <div className="relative mx-auto h-16 w-48">
        <Image
          src="/brand/aacsd-logo.jpg"
          alt={ORG.shortName}
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-navy">Admin sign in</h1>
        <p className="mb-6 text-sm text-muted">
          One administrator account for {ORG.shortName} membership IDs.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
