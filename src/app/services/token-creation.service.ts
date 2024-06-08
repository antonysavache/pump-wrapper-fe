import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenCreationService {
  private tokenCreationSubject = new Subject<any>();
  private ws: WebSocket | null = null;

  constructor() { }

  subscribeToTokenCreation() {
    this.connectToWebSocket();
  }

  private connectToWebSocket() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket('wss://pumpportal.fun/api/data');

    this.ws.onopen = () => {
      const payload = { method: "subscribeNewToken", keys: [''] };
      this.ws?.send(JSON.stringify(payload));
      console.log('WebSocket connected for token creation');
    };

    this.ws.onmessage = (event) => {
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

  getTokenCreationObservable() {
    return this.tokenCreationSubject.asObservable();
  }
}
