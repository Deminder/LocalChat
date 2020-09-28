import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type ConversationEvent = { subject: string; message: any };

@Injectable({
  providedIn: 'root',
})
export class SseEventService {
  endpoint = '/api/events';

  source: EventSource;

  constructor(private zone: NgZone) {}

  receiveEvents(): Observable<ConversationEvent> {
    const events$ = new Subject<ConversationEvent>();
    if (this.source) {
      this.source.close();
    }
    const source = new EventSource(this.endpoint);
    source.onmessage = (event) =>
      setTimeout(() =>
        this.zone.run(() => events$.next(JSON.parse(event.data)))
      );

    source.onerror = (error) => {
      if (source.readyState === EventSource.CLOSED) {
        setTimeout(() => this.zone.run(() => events$.error(error)));
      }
    };
    this.source = source;
    return events$;
  }
}
