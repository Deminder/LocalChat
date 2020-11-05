import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { VoiceService } from 'src/app/shared/services/voice.service';
import {
  listMembersActions,
  listNextMessagesActions,
} from '../../actions/conversation.actions';
import { routeBackToChat } from '../../actions/router.actions';
import { getSelfActions } from '../../actions/user.actions';
import { selectedConversationId } from '../../reducers/router.reducer';
import {
  areMembersNeeded,
  isFirstPageNeeded,
  isMicrohponeEnabled,
  isPlaybackEnabled,
  selectVoiceChannel,
} from '../../selectors/conversation.selectors';
import { selectSelfName, areDesktopNotificationsEnabled, areSoundAlertsEnabled } from '../../selectors/user.selectors';
import {NotifyService} from 'src/app/shared/services/notify.service';

@Injectable()
export class RouterEffects {
  openedConversationPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(areMembersNeeded)),
      filter(([_, membersNeeded]) => membersNeeded),
      withLatestFrom(this.store.select(selectedConversationId)),
      map(([_, conversationId]) =>
        listMembersActions.request({ conversationId })
      )
    )
  );

  openedConversationMessagePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(isFirstPageNeeded)),
      filter(([_, pageNeeded]) => pageNeeded),
      withLatestFrom(this.store.select(selectedConversationId)),
      map(([_, conversationId]) =>
        listNextMessagesActions.request({ conversationId })
      )
    )
  );

  openedAnyPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(selectSelfName)),
      filter(([_, selfname]) => !selfname),
      map(() => getSelfActions.request())
    )
  );

  backToChat$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routeBackToChat),
        withLatestFrom(this.store.select(selectedConversationId)),
        tap(([_, cid]) => this.router.navigate(['chat', cid]))
      ),
    { dispatch: false }
  );

  voiceInit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        withLatestFrom(
          this.store.select(isMicrohponeEnabled),
          this.store.select(isPlaybackEnabled),
          this.store.select(selectVoiceChannel)
        ),
        tap(([_, mic, playback, channel]) => {
          this.voiceService.join(channel.conversationId);
          this.voiceService.enablePlayback(playback);
          this.voiceService.enableMic(mic);
        })
      ),
    { dispatch: false }
  );

  notifyInit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        withLatestFrom(
          this.store.select(areDesktopNotificationsEnabled),
          this.store.select(areSoundAlertsEnabled),
        ),
        tap(([desktopNotify, soundNotify]) => {
          this.notifyService.enableDesktopNotifications(desktopNotify)
          this.notifyService.enableSoundAlerts(soundNotify);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private voiceService: VoiceService,
    private notifyService: NotifyService
  ) {}
}
