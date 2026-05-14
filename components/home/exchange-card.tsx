import type { ExchangeInfo } from "@/lib/config/exchanges";

export function ExchangeCard({ info }: { info: ExchangeInfo }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h3 className="text-xl font-semibold">{info.displayName}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{info.tagline}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-500">手續費</dt>
          <dd>{info.fee}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">台幣入金</dt>
          <dd>{info.twdDeposit ? "✓" : "需轉幣"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">新手友善度</dt>
          <dd>{"★".repeat(info.beginnerFriendly)}</dd>
        </div>
      </dl>
      <a
        href={`/go/${info.key}?from=home`}
        className="mt-4 block rounded bg-zinc-900 px-4 py-2 text-center text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        前往註冊 →
      </a>
    </div>
  );
}
