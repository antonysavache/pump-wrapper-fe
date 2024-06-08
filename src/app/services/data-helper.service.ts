import { Injectable } from "@angular/core";
import { Coin, Trade, Trader } from "../interfaces/main";

@Injectable({
  providedIn: 'root',
})

export class DataHelperService {
  setUpTraderData(trade: Trade): Trader {
    return {
      traderPublicKey: trade.traderPublicKey,
      totalBoughtSol: (trade.marketCapSol/1000000000)*trade.tokenAmount,
      totalSoldSol: (trade.marketCapSol/1000000000)*trade.tokenAmount,
      realizedPnl: 0,
      unrealizedPnl: 0,
      totalTrades: 1,
      coinsTraded: trade.txType === 'buy' ? [this.setUpCoinData(trade)]: [],
      coinsExpanded: false,
    }
  }

  setUpCoinData(trade: Trade): Coin {
    return {
      totalBoughtSol: trade.txType === 'buy' ? (trade.marketCapSol/1000000000)*trade.tokenAmount: 0,
      totalSoldSol: trade.txType === 'sell' ? (trade.marketCapSol/1000000000)*trade.tokenAmount: 0,
      marketCapSol: trade.marketCapSol,
      realizedPnl: 0,
      mint: trade.mint,
      totalTrades: 1,
      unrealizedPnl: 0,
      solScanLink: '',
      photonLink: '',
      trades: [this.setUpTradeData(trade)],
      tradesExpanded: false,
    }
  }

  setUpTradeData(trade: Trade) {
    return {
      ...trade,
      totalBoughtSol: trade.txType === 'buy' ? (trade.marketCapSol/1000000000)*trade.tokenAmount : 0,
      totalSoldSol: trade.txType === 'sell' ? (trade.marketCapSol/1000000000)*trade.tokenAmount: 0,
    }
  }
}
