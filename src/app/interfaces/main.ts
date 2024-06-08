export interface MetaData {
  createdOn: string;
  description: string;
  name: string;
  showName: boolean;
  symbol: string;
  telegram: string;
  twitter: string;
  website: string;
  image: string;
}

export interface TechData {
  bondingCurveKey: string;
  initialBuy: number;
  marketCapSol: number;
  mint: string;
  signature: string;
  traderPublicKey: string;
  txType: string;
  vSolInBondingCurve: number;
  vTokensInBondingCurve: number;
}

export interface TokensMetaData {
  data: MetaData;
  mint: TechData;
}

// export interface Trade {
//   bondingCurveKey: string;
//   marketCapSol: number;
//   mint: string;
//   newTokenBalance: number;
//   signature: string;
//   tokenAmount: number;
//   traderPublicKey: string;
//   txType: string;
//   vSolInBondingCurve: number;
//   vTokensInBondingCurve: number;
// }

export interface OpenTrades {
  mint: string;
  tokenBalance: number;
}

export interface Trader {
  traderPublicKey: string;
  totalBoughtSol: number;
  totalTrades: number;
  totalSoldSol: number;
  realizedPnl: number;
  unrealizedPnl: number;
  coinsTraded: Coin[];
  coinsExpanded: boolean;
}

export interface Coin {
  mint: string;
  solScanLink: string;
  photonLink: string;
  totalBoughtSol: number;
  totalSoldSol: number;
  realizedPnl: number;
  unrealizedPnl: number;
  totalTrades: number;
  trades: Trade[];
  marketCapSol: number;
  tradesExpanded: boolean;
}

export interface Trade {
  bondingCurveKey: string;
  marketCapSol: number;
  mint: string;
  newTokenBalance: number;
  tokenAmount: number;
  traderPublicKey: string;
  txType: string;
  vSolInBondingCurve: number;
  vTokensInBondingCurve: number;
  totalBoughtSol: number;
  totalSoldSol: number;
}
