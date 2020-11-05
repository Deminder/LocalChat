import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EMPTY, merge, Observable, of, from } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
  filter,
} from 'rxjs/operators';
import {
  ConversationMessageDto,
  MemberDto,
} from 'src/app/openapi/model/models';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { SseEventService } from '../../../shared/services/sse-event.service';
import {
  APIActionCreator,
  APIActionCreatorContainer,
} from '../../actions/actions-creation';
import {
  conversationUpserted,
  ConvRef,
  memberDeleted,
  MemberRef,
  memberUpserted,
  messageDeleted,
  MessageRef,
  messageUpserted,
  listConversationsActions,
  refreshConversationActions,
} from '../../actions/conversation.actions';
import {
  deleteTokenActions,
  getSelfActions,
  listenForEvents,
  listLoginTokensActions,
  toggleDesktopNotifications,
} from '../../actions/user.actions';
import { selectedConversationId } from '../../reducers/router.reducer';
import { UserService } from './user.service';

@Injectable()
export class UserEffects {
  getSelf$ = this.createApiActionEffect(getSelfActions, {
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
              case 'upsert-conv':
                return of(conversationUpserted({ conv: event.message }));
              case 'upsert-member':
                const member = event.message as MemberDto;
                return cid === member.convId
                  ? of(memberUpserted({ member }))
                  : EMPTY;
              case 'delete-member':
                const memberRef = event.message as MemberRef;
                return cid === memberRef.conversationId
                  ? of(memberDeleted(memberRef))
                  : EMPTY;
              case 'upsert-message':
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
              case 'delete-message':
                const convMessageRef = event.message as MessageRef;
                return this.messageListChange(
                  convMessageRef.conversationId === cid,
                  messageDeleted(convMessageRef),
                  refreshConversationActions.request(convMessageRef as ConvRef)
                );
              default:
                console.log(JSON.stringify(event));
                return EMPTY;
            }
          }),
          catchError((error: ErrorEvent) => {
            console.error('[Event Source Error]', error);
            this.snackbar.open(error.message || 'Event source error!', '', {
              duration: 3000,
            });
            return of(getSelfActions.failure());
          })
        )
      )
    )
  );

  listLoginTokens$ = this.createApiActionEffect(listLoginTokensActions, {
    service: () => this.userService.listLoginTokens(),
    error: (message) => {
      this.snackbar.open(message || 'Login Tokens unavailable!', '', {
        duration: 3000,
      });
      return EMPTY;
    },
  });

  deleteToken$ = this.createApiActionEffect(deleteTokenActions, {
    service: (a) => this.userService.deleteLoginToken(a.tokenId),
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

  private createApiActionEffect<
    R extends object | void,
    S extends object | void,
    F extends object | void
  >(
    container: APIActionCreatorContainer<R, S, F>,
    calls: {
      service: (action: ReturnType<APIActionCreator<R>>) => Observable<S>;
      success?: (res: S) => Observable<Action>;
      error?: (error: any) => Observable<Action>;
    }
  ): Observable<Action> {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(container.request),
        switchMap((r) =>
          calls.service(r).pipe(
            mergeMap((s) =>
              merge(
                calls.success ? calls.success(s) : EMPTY,
                of(
                  s instanceof Object
                    ? container.success(s)
                    : container.success(null)
                )
              )
            ),
            catchError((e) => {
              return merge(
                calls.error ? calls.error(e) : EMPTY,
                of(container.failure(e))
              );
            })
          )
        )
      )
    );
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
