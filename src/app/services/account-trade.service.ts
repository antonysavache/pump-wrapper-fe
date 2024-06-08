import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountTradeService {
  private accountTradesSubject = new Subject<any>();
  private ws: WebSocket | null = null;



  constructor() {
  }

  subscribeToAccountTrades() {
    this.connectToWebSocket();
  }
  addTokenAddress(address: string) {
    const payload = { method: "subscribeAccountTrade", keys: [address] };
    this.ws?.send(JSON.stringify(payload));
  }


  private connectToWebSocket() {
    // if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    //   return;
    // }
    //
    // this.ws = new WebSocket('wss://pumpportal.fun/api/data');
    //
    // this.ws.onopen = () => {
    //   const payload = { method: "subscribeAccountTrade", keys: ['C3BDAiXEEChVaxpcgQzLTPUc2yMk8haZHQkxJMN5AEb9'] };
    //   this.ws?.send(JSON.stringify(payload));
    //   console.log('WebSocket connected for account checking');
    // };
    //
    // this.ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   this.accountTradesSubject.next(data);
    // };
    //
    // this.ws.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    // };
    //
    // this.ws.onclose = () => {
    //   console.log('WebSocket connection closed.');
    // };
  }

  getAccountTradesSubjectObservable() {
    return this.accountTradesSubject.asObservable();
  }
}
