import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EMPTY, from, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  ConversationMessageDto,
  MemberDto,
} from 'src/app/openapi/model/models';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { SseEventService } from '../../../shared/services/sse-event.service';
import { createApiActionEffect } from '../../actions/actions-creation';
import {
  conversationUpserted,
  ConvRef,
  listConversationsActions,
  memberDeleted,
  MemberRef,
  memberUpserted,
  messageDeleted,
  MessageRef,
  messageUpserted,
  refreshConversationActions,
} from '../../actions/conversation.actions';
import {
  deleteTokenActions,
  getSelfActions,
  listenForEvents,
  listLoginTokensActions,
  toggleDesktopNotifications,
} from '../../actions/user.actions';
import {
  selectedConversationId,
  shouldLoadSelf,
} from '../../reducers/router.reducer';
import { UserService } from './user.service';

@Injectable()
export class UserEffects {
  getSelf$ = createApiActionEffect(this.actions$, getSelfActions, {
    service: () => this.userService.getSelf().pipe(map((user) => ({ user }))),
    success: () => of(listConversationsActions.request(), listenForEvents()),
    error: (message) => {
      this.snackbar.open(message || 'Username unavailable!', '', {
        duration: 3000,
      });
      return EMPTY;
    },
  });

  eventListen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listenForEvents),
      switchMap(() =>
        this.sseEventService.receiveEvents().pipe(
          withLatestFrom(this.store.select(selectedConversationId)),
          mergeMap(([event, cid]) => {
            switch (event.subject) {
              case 'upsert-conv': {
                return of(conversationUpserted({ conv: event.message }));
              }
              case 'upsert-member': {
                const member = event.message as MemberDto;
                return cid === member.convId
                  ? of(memberUpserted({ member }))
                  : EMPTY;
              }
              case 'delete-member': {
                const memberRef = event.message as MemberRef;
                return cid === memberRef.conversationId
                  ? of(memberDeleted(memberRef))
                  : EMPTY;
              }
              case 'upsert-message': {
                this.notifyService.incomingMessage(
                  event.message.conversationId,
                  event.message.message
                );
                const convMessage = event.message as ConvRef & {
                  message: ConversationMessageDto;
                };
                return this.messageListChange(
                  cid === convMessage.conversationId,
                  messageUpserted(convMessage),
                  refreshConversationActions.request(convMessage as ConvRef)
                );
              }
              case 'delete-message': {
                const convMessageRef = event.message as MessageRef;
                return this.messageListChange(
                  convMessageRef.conversationId === cid,
                  messageDeleted(convMessageRef),
                  refreshConversationActions.request(convMessageRef as ConvRef)
                );
              }
              default: {
                console.log(JSON.stringify(event));
                return EMPTY;
              }
            }
          }),
          catchError((error: ErrorEvent) => {
            console.error('[Event Source Error]', error);
            setTimeout(
              () =>
                this.snackbar.open(error.message || 'Event source error!', '', {
                  duration: 3000,
                }),
              500
            );
            return of(getSelfActions.failure({ error }));
          })
        )
      )
    )
  );

  getSelfFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSelfActions.failure),
      withLatestFrom(this.store.select(shouldLoadSelf)),
      filter(([_, loadSelf]) => loadSelf),
      debounceTime(4000),
      map(() => getSelfActions.request())
    )
  );

  listLoginTokens$ = createApiActionEffect(this.actions$, listLoginTokensActions, {
    service: () => this.userService.listLoginTokens(),
    error: (message) => {
      this.snackbar.open(message || 'Login Tokens unavailable!', '', {
        duration: 3000,
      });
      return EMPTY;
    },
  });

  deleteToken$ = createApiActionEffect(this.actions$, deleteTokenActions, {
    service: (a) => this.userService.deleteLoginToken(a.tokenId).pipe(map(() => undefined)),
    success: () => of(listLoginTokensActions.request()),
    error: (message) => {
      this.snackbar.open(message || 'Delete Token failed!', '', {
        duration: 3000,
      });
      return EMPTY;
    },
  });

  desktopNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleDesktopNotifications),
      filter((a) => a.enabled),
      switchMap(() => from(this.notifyService.enableDesktopNotifications())),
      filter((p) => p === 'denied'),
      map(() => toggleDesktopNotifications({ enabled: false }))
    )
  );

  private messageListChange(
    isActive: boolean,
    viewAction: Action,
    fetchAction: Action
  ): Observable<Action> {
    const actions: Action[] = [];
    if (isActive) {
      actions.push(viewAction);
    }
    if (this.notifyService.isHidden() || !isActive) {
      actions.push(fetchAction);
    }
    return from(actions);
  }

  constructor(
    private actions$: Actions,
    private snackbar: MatSnackBar,
    private store: Store,
    private userService: UserService,
    private sseEventService: SseEventService,
    private notifyService: NotifyService
  ) {}
}
