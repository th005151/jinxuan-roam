export const siteConfig = {
  name: "小狐理財 littlefoxmoney",
  shortName: "littlefoxmoney",
  description: "台灣加密貨幣新手指南：MAX、幣安、派網一站搞懂。",
  tagline: "台灣加密貨幣新手指南",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://littlefoxmoney.com",
  locale: "zh-TW",
  author: {
    name: "（你的暱稱）",
    bio: "台灣加密貨幣中度玩家。實際用過 MAX、幣安、派網；這個站是我的學習筆記。",
  },
} as const;

export type SiteConfig = typeof siteConfig;
