import type { FaqItem } from "@/lib/seo/faq-jsonld";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-4 text-2xl font-bold">常見問題</h2>
      <dl className="space-y-4">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold">{item.question}</dt>
            <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
