import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, Observable, Subject, zip } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { ConversationMessageDto } from 'src/app/openapi/model/models';
import {
  areDesktopNotificationsEnabled,
  areSoundAlertsEnabled,
} from 'src/app/store/selectors/user.selectors';
import { Howl } from 'howler';
import { Router } from '@angular/router';
import { selectedConversationId } from 'src/app/store/reducers/router.reducer';
import { AuthorNamePipe } from '../author-name.pipe';
import {
  selectConversationMemberEntities,
  selectActiveConversation,
  selectConversationNameEntities,
} from 'src/app/store/selectors/conversation.selectors';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  conversationId$ = this.store.select(selectedConversationId);
  desktopNotification$ = this.store.select(areDesktopNotificationsEnabled);
  alertSounds$ = this.store.select(areSoundAlertsEnabled);
  memberEntites$ = this.store.select(selectConversationMemberEntities);
  conversationNameEntities$ = this.store.select(selectConversationNameEntities);

  beepSound: Howl;

  hidden$ = fromEvent(this.doc, 'visibilitychange').pipe(
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
      zip(
        this.desktopNotification$,
        this.memberEntites$,
        this.conversationNameEntities$
      )
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
                  this.router.navigate(['chat', conversationId]);
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

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private store: Store,
    private router: Router
  ) {
    this.desktopNotification$.subscribe((enabled) => {
      if (enabled && !['granted', 'denied'].includes(Notification.permission)) {
        Notification.requestPermission();
      }
    });
    this.beepSound = new Howl({
      src: '../../../assets/audio/beep.wav',
      preload: true,
    });
  }
}
