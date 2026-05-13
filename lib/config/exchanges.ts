export const EXCHANGE_KEYS = ["max", "binance", "pionex"] as const;
export type ExchangeKey = (typeof EXCHANGE_KEYS)[number];

export interface ExchangeInfo {
  key: ExchangeKey;
  displayName: string;
  tagline: string;
  fee: string;
  twdDeposit: boolean;
  beginnerFriendly: 1 | 2 | 3 | 4 | 5;
}

export const exchanges: Record<ExchangeKey, ExchangeInfo> = {
  max: {
    key: "max",
    displayName: "MAX",
    tagline: "台灣本地交易所，台幣入金最方便",
    fee: "0.15%",
    twdDeposit: true,
    beginnerFriendly: 5,
  },
  binance: {
    key: "binance",
    displayName: "幣安",
    tagline: "全球最大，幣種最多",
    fee: "0.10%",
    twdDeposit: false,
    beginnerFriendly: 3,
  },
  pionex: {
    key: "pionex",
    displayName: "派網",
    tagline: "免費網格機器人，被動投資首選",
    fee: "0.05%",
    twdDeposit: true,
    beginnerFriendly: 4,
  },
};
