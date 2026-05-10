import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download } from "lucide-react";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: `Download or view the full resume of ${profile.name}, ${profile.role}.`,
};

export default function ResumePage() {
  return (
    <main className="min-h-screen container-page py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-cyan transition-colors"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>
        <a
          href={profile.resumePath}
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-brand text-bg-base font-semibold text-sm hover:-translate-y-0.5 transition-transform"
        >
          <Download size={14} />
          Download PDF
        </a>
      </div>

      <div className="rounded-lg overflow-hidden border border-border-default bg-bg-surface">
        <iframe
          src={profile.resumePath}
          className="w-full h-[85vh]"
          title={`${profile.name} — Resume`}
        />
      </div>
    </main>
  );
}
