import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Howl } from 'howler';
import { fromEvent, Observable, Subject, combineLatest } from 'rxjs';
import { map, take, startWith } from 'rxjs/operators';
import { ConversationMessageDto } from 'src/app/openapi/model/models';
import { selectedConversationId } from 'src/app/store/reducers/router.reducer';
import {
  selectConversationMemberEntities,
  selectConversationNameEntities,
} from 'src/app/store/selectors/conversation.selectors';
import {
  areDesktopNotificationsEnabled,
  areSoundAlertsEnabled,
} from 'src/app/store/selectors/user.selectors';
import { AuthorNamePipe } from '../author-name.pipe';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  conversationId$ = this.store.select(selectedConversationId);
  desktopNotification$ = this.store.select(areDesktopNotificationsEnabled);
  alertSounds$ = this.store.select(areSoundAlertsEnabled);
  memberEntites$ = this.store.select(selectConversationMemberEntities);
  conversationNameEntities$ = this.store.select(selectConversationNameEntities);

  beepSound = new Howl({
    src: '../../../assets/audio/beep.wav',
    preload: true,
  });

  hidden$ = fromEvent(this.doc, 'visibilitychange').pipe(
    startWith(this.isHidden()),
    map(() => this.isHidden())
  );

  observers: Map<string, Subject<any>> = new Map();

  publish(label: string, obj: any): void {
    console.log(`[${label}] ${JSON.stringify(obj)}`);
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

  incomingMessage(
    conversationId: number,
    message: ConversationMessageDto
  ): void {
    if (this.isHidden() && message.authorDate === message.lastChange) {
      combineLatest([
        this.desktopNotification$,
        this.memberEntites$,
        this.conversationNameEntities$,
      ])
        .pipe(take(1))
        .subscribe(([enabled, memberEntites, convs]) => {
          if (enabled) {
            const username = new AuthorNamePipe().transform(
              message.authorUserId,
              memberEntites
            );
            const convName = convs[conversationId]?.name ?? '?';
            const notification = new Notification(
              `${username} wrote in [${convName}]`,
              {
                tag: 'unread',
                body: message.text,
                icon: 'favicon.ico',
                renotify: true,
              }
            );
            notification.onclick = () =>
              this.conversationId$.pipe(take(1)).subscribe((cid) => {
                if (cid !== conversationId) {
                  this.zone.run(() =>
                    setTimeout(() =>
                      this.router.navigate(['chat', conversationId])
                    )
                  );
                }
              });
          }
        });
      this.alertSounds$.pipe(take(1)).subscribe((enabled) => {
        if (enabled) {
          this.beepSound.play();
        }
      });
    }
  }

  isHidden(): boolean {
    return this.doc.hidden;
  }

  enableDesktopNotifications(enabled = true): Promise<NotificationPermission> {
    if (enabled && !['granted', 'denied'].includes(Notification.permission)) {
      return Notification.requestPermission();
    }
    return Promise.resolve(Notification.permission);
  }

  enableSoundAlerts(enabled: boolean): void {
    if (enabled) {
      this.beepSound.load();
    } else {
      this.beepSound.unload();
    }
  }

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private store: Store,
    private router: Router,
    private zone: NgZone
  ) {}
}
