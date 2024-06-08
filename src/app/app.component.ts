import {Component, OnDestroy, OnInit} from '@angular/core';
import { TokenCreationService } from './services/token-creation.service';
import { TokenTradeService } from './services/token-trade.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from "./services/api.service";
import { AccountTradeService } from "./services/account-trade.service";
import { OpenTrades } from "./interfaces/main";
import { isEmpty } from "lodash";

interface TokenData {
  mint: string;
  creatorPublicKey: string;
  trades: TradeData[];
}

interface TradeData {
  traderPublicKey: string;
  txType: string;
  mint: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  tokens: TokenData[] = [];
  trades: OpenTrades[] = [];
  otherTrades: { [key: string]: { [mint: string]: { totalTrades: any[], closedTrades: any[] } } } = {};
  buyDisabled = false;
  traders = [];
  counter = 0;

  constructor(
    private tokenCreationService: TokenCreationService,
    private tokenTradeService: TokenTradeService,
    private accountTradeService: AccountTradeService,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    // this.initSubs();
  }

  getOpenAccounts() {
    return Object.keys(this.otherTrades)
  }

  getOpenCoins(obj: any) {
    return Object.keys(obj)
  }

  manageTrade(trade: any): void {
    if (trade.traderPublicKey) {
      // Проверка, существует ли объект для traderPublicKey в otherTrades
      if (!this.otherTrades[trade.traderPublicKey]) {
        this.otherTrades[trade.traderPublicKey] = {};
      }

      if (!this.otherTrades[trade.traderPublicKey][trade.mint]) {
        // @ts-ignore
        this.otherTrades[trade.traderPublicKey][trade.mint] = {totalTrades: [], closedTrades: []};
      }

      // Проверка, существует ли массив для mint в otherTrades[traderPublicKey]

      // Добавление информации о торговле в массив
      this.otherTrades[trade.traderPublicKey][trade.mint].totalTrades.push({
        tokenBalance: Number(trade.tokenAmount),
        marketCapSol: Number(trade.marketCapSol),
        txType: trade.txType,
        token: trade.mint
      });

      this.calculateCompletedDeals();
    }
  }


  getTotalClosedTrades(account: string): number {
    const coins = this.getOpenCoins(this.otherTrades[account]);
    let totalClosedTrades = 0;
    coins.forEach(coin => {
      totalClosedTrades += this.otherTrades[account][coin].closedTrades.length;
    });
    return totalClosedTrades;
  }

  getTotalPnl(account: string): number {
    const coins = this.getOpenCoins(this.otherTrades[account]);
    let totalPnl = 0;
    coins.forEach(coin => {
      this.otherTrades[account][coin].closedTrades.forEach(closedTrade => {
        totalPnl += closedTrade.pnl;
      });
    });
    return totalPnl;
  }

  getSortedAccounts() {
    return this.getOpenAccounts().sort((a, b) => this.getTotalPnl(b) - this.getTotalPnl(a));
  }

  calculateCompletedDeals() {
    Object.keys(this.otherTrades).forEach(account => {
      Object.keys(this.otherTrades[account]).forEach(coin => {
        const boughtExposure = this.otherTrades[account][coin].totalTrades.filter(transaction => transaction.txType === 'buy');
        const sellExposure = this.otherTrades[account][coin].totalTrades.filter(transaction => transaction.txType === 'sell');

        if (!isEmpty(boughtExposure) && !isEmpty(sellExposure)) {
          const totalSellExposure = sellExposure.reduce((acc, transaction) => {
            acc.tokenBalance += transaction.tokenBalance;
            acc.marketCapSol += transaction.marketCapSol;
            return acc;
          }, { tokenBalance: 0, marketCapSol: 0 });

          totalSellExposure.averageMarketCap = totalSellExposure.marketCapSol / totalSellExposure.tokenBalance;

          const totalBoughtExposure = boughtExposure.reduce((acc, transaction) => {
            acc.tokenBalance += transaction.tokenBalance;
            acc.marketCapSol += transaction.marketCapSol;
            return acc;
          }, { tokenBalance: 0, marketCapSol: 0 });

          totalBoughtExposure.averageMarketCap = totalBoughtExposure.marketCapSol / totalBoughtExposure.tokenBalance;

          // Ensure we only add the closed trade once
          const closedTrades = this.otherTrades[account][coin].closedTrades;
          const existingTrade = closedTrades.find(closedTrade =>
            closedTrade.bought === totalBoughtExposure.averageMarketCap &&
            closedTrade.sold === totalSellExposure.averageMarketCap
          );

          if (!existingTrade) {
            closedTrades.push({
              id: this.counter,
              bought: totalBoughtExposure.averageMarketCap,
              sold: totalSellExposure.averageMarketCap,
              pnl: (totalSellExposure.averageMarketCap - totalBoughtExposure.averageMarketCap) / totalBoughtExposure.averageMarketCap
            });
            this.counter++;
          }
        }
      });
    });
  }

  initSubs(): void {
    this.tokenCreationService.subscribeToTokenCreation();
    this.tokenTradeService.subscribeToTokenTrades();
    this.accountTradeService.subscribeToAccountTrades();

    this.pipeCoinsCreated();
    this.pipeCoinsTraded();
    this.pipeMainAccountTrades();
  }

  pipeCoinsCreated(): void {
    this.tokenCreationService.getTokenCreationObservable().subscribe(tokenCreation => {
      if (tokenCreation.mint) {
        this.tokenTradeService.addTokenAddress(tokenCreation.mint);
      }
    });
  }

  pipeCoinsTraded(): void {
    this.tokenTradeService.getTokenTradeObservable().pipe(
      catchError(err => {
        console.error('Error in trade observable:', err);
        return of(null);
      })
    ).subscribe(tokenTrade => {
      if (!isEmpty(tokenTrade)) {
        this.accountTradeService.addTokenAddress(tokenTrade.traderPublicKey)
      }
    });
  }

  pipeMainAccountTrades() {
    // this.accountTradeService.getTokenCreationObservable().subscribe(trade => {
    //   this.manageTrade(trade)
    // })
  }

  ngOnDestroy() {

  }
}
