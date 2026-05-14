import Link from "next/link";
import type { ExchangeKey } from "@/lib/config/exchanges";
import { DisclosureInline } from "@/components/affiliate/disclosure-inline";

interface Step {
  label: string;
  href: string;
  type: "affiliate" | "internal";
  exchange?: ExchangeKey;
}

interface Props {
  steps: Step[];
  sourceArticle: string;
}

export function CtaSummary({ steps, sourceArticle }: Props) {
  return (
    <section className="mt-10 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="mb-4 text-xl font-bold">接下來怎麼做？</h2>
      <ol className="space-y-3">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="font-semibold">步驟 {idx + 1}：</span>
            {step.type === "affiliate" && step.exchange ? (
              <a
                href={`/go/${step.exchange}?from=${sourceArticle}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {step.label}
              </a>
            ) : (
              <Link href={step.href} className="text-blue-600 underline hover:text-blue-800">
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
