export const siteConfig = {
  name: "（待定）台灣加密新手指南",
  shortName: "Coinkit",
  description: "給台灣新手的加密貨幣交易所完整教學：MAX、幣安、派網一站搞懂。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh-TW",
  author: {
    name: "（你的暱稱）",
    bio: "台灣加密貨幣中度玩家。實際用過 MAX、幣安、派網；這個站是我的學習筆記。",
  },
} as const;

export type SiteConfig = typeof siteConfig;
