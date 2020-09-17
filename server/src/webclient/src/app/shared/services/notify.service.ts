import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  observers: Map<string, Subject<any>> = new Map();

  publish(label: string, obj: any): void {
    console.log(`[${label}] ${obj}`);
    const obs = this.observers.get(label);
    if (obs) {
      obs.next(obj);
    }
  }

  select(label: string): Observable<any> {
    let subject = this.observers.get(label);
    if (!subject) {
      subject = new Subject();
      this.observers.set(label, subject);
    }
    return subject;
  }

  constructor() { }
}
