import type { MDXComponents } from "mdx/types";
import { CtaInline } from "@/components/cta/cta-inline";
import { CtaSummary } from "@/components/cta/cta-summary";
import { CtaComparison } from "@/components/cta/cta-comparison";
import { Faq } from "@/components/article/faq";
import { slugify } from "@/lib/article-toc";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    CtaInline,
    CtaSummary,
    CtaComparison,
    Faq,
    h1: ({ children }) => (
      <h2
        id={slugify(typeof children === "string" ? children : "")}
        className="mt-10 mb-4 text-2xl font-bold tracking-tight scroll-mt-24"
      >
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2
        id={slugify(typeof children === "string" ? children : "")}
        className="mt-10 mb-3 text-2xl font-semibold tracking-tight scroll-mt-24"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugify(typeof children === "string" ? children : "")}
        className="mt-6 mb-2 text-xl font-semibold scroll-mt-24"
      >
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
    ul: ({ children }) => <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>,
    a: ({ href, children }) => (
      <a href={href} className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
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
