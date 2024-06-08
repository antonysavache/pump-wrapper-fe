import {Component, OnDestroy, OnInit} from "@angular/core";
import {Coin, Trade, Trader} from "../../interfaces/main";
import {TokenTradeService} from "../../services/token-trade.service";
import {isEmpty} from "lodash";
import {AccountTradeService} from "../../services/account-trade.service";
import {DataHelperService} from "../../services/data-helper.service";
import {TokenCreationService} from "../../services/token-creation.service";
import {FileSaverService} from "../../services/file-saver.service";

@Component({
  selector: 'app-spy-trades',
  templateUrl: './spy-trades.component.html',
  styleUrls: ['./spy-trades.component.css']
})
export class SpyTradesComponent implements OnInit {
  traders: Trader[] = [];

  constructor(
    private tokenCreationService: TokenCreationService,
    private tokenTradeService: TokenTradeService,
    private accountTradeService: AccountTradeService,
    private dataHelper: DataHelperService,
    private fileSaver: FileSaverService,
  ) {
  }

  ngOnInit() {
    this.initSubs();
    this.manageTrades();
  }

  saveData() {
    const data = JSON.stringify(this.traders, null, 2);
    const filename = 'mock-traders.json';
    const fileType = 'application/json';

    this.fileSaver.saveFile(data, filename, fileType);
  }

  manageTrades(): void {
    this.tokenTradeService.getTokenTradeObservable().subscribe((trade: Trade) => {
      console.log(trade)
      const existedTrader: Trader | undefined = this.traders.find(trader => trader.traderPublicKey === trade.traderPublicKey);
      if (existedTrader && !isEmpty(existedTrader)) {
        const existedCoin: Coin | undefined = existedTrader.coinsTraded.find(coin => coin.mint === trade.mint);
        if (existedCoin && !isEmpty(existedCoin.trades)) {
          existedCoin.trades.push(trade);
        } else {
          existedTrader.coinsTraded.push(this.dataHelper.setUpCoinData(trade));
        }
        if (!isEmpty(existedCoin) && !isEmpty(existedTrader)) {
          this.calculatePNL(existedCoin, existedTrader)
        }
      } else {
        this.traders.push(this.dataHelper.setUpTraderData(trade));
      }

      console.log(this.traders)
    });
  }

  calculatePNL(coin: Coin, trader: Trader) {
    const totalBoughtSOLByCoin = coin.trades.reduce((accumulator, trade) => {
      return accumulator + trade.totalBoughtSol;
    }, 0);

    const totalSoldSOLByCoin = coin.trades.reduce((accumulator, trade) => {
      return accumulator + trade.totalSoldSol;
    }, 0);

    const realizedPnlByCoin = (totalSoldSOLByCoin - totalBoughtSOLByCoin)/totalBoughtSOLByCoin;
    const unRealizedPnlByCoin = totalBoughtSOLByCoin - totalSoldSOLByCoin > 0 ? totalBoughtSOLByCoin - totalSoldSOLByCoin : 0;

    coin.totalBoughtSol = totalBoughtSOLByCoin;
    coin.totalSoldSol = totalSoldSOLByCoin;
    coin.realizedPnl = realizedPnlByCoin;
    coin.unrealizedPnl = unRealizedPnlByCoin;

    const totalBoughtSOLByCoins = trader.coinsTraded.reduce((accumulator, trade) => {
      return accumulator + trade.totalBoughtSol;
    }, 0);

    const totalSoldSOLByCoins = trader.coinsTraded.reduce((accumulator, trade) => {
      return accumulator + trade.totalSoldSol;
    }, 0);

    const realizedPnlByCoins = (totalSoldSOLByCoins- totalBoughtSOLByCoins)/totalBoughtSOLByCoins;
    const unRealizedPnlByCoins = totalBoughtSOLByCoins - totalSoldSOLByCoins> 0 ? totalBoughtSOLByCoins - totalSoldSOLByCoins : 0;

    trader.totalBoughtSol = totalBoughtSOLByCoins;
    trader.totalSoldSol = totalSoldSOLByCoins;
    trader.realizedPnl = realizedPnlByCoins;
    trader.unrealizedPnl = unRealizedPnlByCoins;
  }

  initSubs() {
    this.tokenCreationService.subscribeToTokenCreation();
    this.tokenTradeService.subscribeToTokenTrades();
  }

  getMockedData(data: Trader[]) {
    this.traders = data
  }
}
