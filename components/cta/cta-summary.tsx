import Link from "next/link";
import type { PartnerKey } from "@/lib/config/partners";
import { DisclosureInline } from "@/components/affiliate/disclosure-inline";
import { AffiliateLink } from "./affiliate-link";

interface Step {
  label: string;
  href: string;
  type: "affiliate" | "internal";
  partner?: PartnerKey;
}

interface Props {
  steps: Step[];
  sourceArticle: string;
}

export function CtaSummary({ steps, sourceArticle }: Props) {
  return (
    <section className="mt-10 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-5 text-xl font-bold text-zinc-900 dark:text-zinc-50">行前準備</h2>
      <ol className="space-y-4">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              {idx + 1}
            </span>
            {step.type === "affiliate" && step.partner ? (
              <AffiliateLink
                partner={step.partner}
                sourceArticle={sourceArticle}
                position="bottom"
                className="text-brand underline decoration-2 underline-offset-2 transition hover:text-brand-deep"
              >
                {step.label}
              </AffiliateLink>
            ) : (
              <Link
                href={step.href}
                className="text-brand underline decoration-2 underline-offset-2 transition hover:text-brand-deep"
              >
                {step.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <DisclosureInline />
    </section>
  );
}
