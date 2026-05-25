export const siteConfig = {
  name: "金萱漫遊",
  shortName: "jinxuan",
  description: "金萱的旅遊筆記：用一片茶葉的好奇心，記錄走過的城市、住過的店、吃過的味道。",
  tagline: "走慢一點，看細一點",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jinxuan-roam.vercel.app",
  locale: "zh-TW",
  author: {
    name: "金萱",
    bio: "前上班族，現在比較常在路上。寫的是私房路線、住宿筆記、跟旅程之間的小發現。",
  },
} as const;

export type SiteConfig = typeof siteConfig;
