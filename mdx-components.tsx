import type { MDXComponents } from "mdx/types";
import { CtaInline } from "@/components/cta/cta-inline";
import { CtaSummary } from "@/components/cta/cta-summary";
import { CtaComparison } from "@/components/cta/cta-comparison";
import { Faq } from "@/components/article/faq";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    CtaInline,
    CtaSummary,
    CtaComparison,
    Faq,
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-xl font-semibold">{children}</h3>
    ),
    p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
    ul: ({ children }) => <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 underline hover:text-blue-800">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
        {children}
      </code>
    ),
    ...components,
  };
}
