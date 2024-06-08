import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {Trade} from "../interfaces/main";

@Injectable({
  providedIn: 'root',
})
export class TokenTradeService {
  private tokenCreationSubject = new Subject<Trade>();
  private ws: WebSocket | null = null;
  // mockedTrade: Trade = {
  //   bondingCurveKey: 'string',
  //   marketCapSol: 30,
  //   mint: 'COIN',
  //   newTokenBalance: 1000,
  //   tokenAmount: 1000,
  //   traderPublicKey: 'TRADER',
  //   txType: 'buy',
  //   vSolInBondingCurve: 30,
  //   vTokensInBondingCurve: 30,
  // };

  constructor() {}

  subscribeToTokenTrades() {
    this.connectToWebSocket();
    // // Отправка мокнутого трейда после подключения WebSocket
    // setTimeout(() => {
    //   this.tokenCreationSubject.next(this.mockedTrade);
    // }, 1000); // Задержка для демонстрации
    // setTimeout(() => {
    //   this.tokenCreationSubject.next(this.mockedTrade);
    // }, 2000); // Задержка для демонстрации
    // setTimeout(() => {
    //   this.tokenCreationSubject.next(this.mockedTrade);
    // }, 3000); // Задержка для демонстрации
    // setTimeout(() => {
    //   this.tokenCreationSubject.next(this.mockedTrade);
    // }, 4000); // Задержка для демонстрации
    // setTimeout(() => {
    //   this.tokenCreationSubject.next(this.mockedTrade);
    // }, 5000); // Задержка для демонстрации
    // setTimeout(() => {
    //   this.tokenCreationSubject.next(this.mockedTrade);
    // }, 6000); // Задержка для демонстрации
  }

  addTokenAddress(address: string) {
    const payload = { method: 'subscribeTokenTrade', keys: [address] };
    this.ws?.send(JSON.stringify(payload));
  }

  private connectToWebSocket() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket('wss://pumpportal.fun/api/data');

    this.ws.onopen = () => {
      const payload = { method: 'subscribeTokenTrade', keys: [''] };
      this.ws?.send(JSON.stringify(payload));
      console.log('WebSocket connected for token trades');
    };

    this.ws.onmessage = (event) => {
      console.log(event )
      const data = JSON.parse(event.data);
      this.tokenCreationSubject.next(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  }

  getTokenTradeObservable(): Observable<Trade> {
    return this.tokenCreationSubject.asObservable();
  }
}
