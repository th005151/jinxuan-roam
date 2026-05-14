import { NextResponse } from "next/server";
import { isExchangeKey, resolveAffiliateUrl } from "@/lib/affiliate/links";

export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ exchange: string }>;
}

export async function GET(request: Request, ctx: Context): Promise<NextResponse> {
  const { exchange } = await ctx.params;
  if (!isExchangeKey(exchange)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const from = new URL(request.url).searchParams.get("from") ?? undefined;
  const target = resolveAffiliateUrl(exchange, from);
  if (!target) {
    return new NextResponse("Affiliate not configured", { status: 503 });
  }
  const response = NextResponse.redirect(target, { status: 302 });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
