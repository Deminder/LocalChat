import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  endpoint = '/api/voice';

  constructor() {}

  join(conversationId: number): void {
    const p = location.protocol === 'http:' ? 'ws:' : 'wss:';
    const ws = new WebSocket(
      `${p}//${location.host}${this.endpoint}?cid=${conversationId}`
    );

    ws.onopen = () => {
      console.log('ws open!!');
    };
  }
}
