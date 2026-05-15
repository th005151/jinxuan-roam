import type { FaqItem } from "@/lib/seo/faq-jsonld";

export function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">常見問題</h2>
      <dl className="space-y-5">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="border-l-[3px] border-brand pl-3 font-semibold text-zinc-900 dark:text-zinc-50">
              {item.question}
            </dt>
            <dd className="mt-2 pl-3 font-serif text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
