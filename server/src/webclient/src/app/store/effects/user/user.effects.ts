import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, EMPTY } from 'rxjs';
import {
  catchError,
  mergeMap,
  switchMap,
  map,
  take,
  concatMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  listConversations,
  memberUpserted,
  conversationUpserted,
  messageUpserted,
  messageDeleted,
  memberDeleted,
  listMembers,
  listNextMessages,
} from '../../actions/conversation.actions';
import {
  getSelf,
  getSelfFailure,
  getSelfSuccess,
  listenForEvents,
} from '../../actions/user.actions';
import { UserService } from './user.service';
import { SseEventService } from '../../../shared/services/sse-event.service';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { selectedConversationId } from '../../reducers/router.reducer';
import { selectSelfName } from '../../selectors/user.selectors';

@Injectable()
export class UserEffects {
  getSelf$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSelf),
      switchMap(() =>
        this.userService.getSelf().pipe(
          mergeMap((s) =>
            of(
              getSelfSuccess({ user: s }),
              listConversations(),
              listenForEvents()
            )
          ),
          catchError((message) => {
            this.router.navigate(['/authorize']);
            this.snackbar.open(message, '', { duration: 3000 });
            return of(getSelfFailure());
          })
        )
      )
    )
  );

  eventListen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listenForEvents),
      switchMap(() =>
        this.sseEventService.receiveEvents().pipe(
          mergeMap((event) => {
            switch (event.subject) {
              case 'upsert-conv':
                return of(conversationUpserted({ conv: event.message }));
              case 'upsert-member':
                return of(memberUpserted({ member: event.message }));
              case 'delete-member':
                return of(memberDeleted(event.message));
              case 'upsert-message':
                return of(messageUpserted(event.message));
              case 'delete-message':
                return of(messageDeleted(event.message));
              default:
                console.log(JSON.stringify(event));
                return EMPTY;
            }
          }),
          catchError((error: ErrorEvent) => {
            this.router.navigate(['/authorize']);
            this.snackbar.open(error.message || 'Event source error!', '', {
              duration: 3000,
            });
            return of(getSelfFailure());
          })
        )
      )
    )
  );

  openedConversationPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      mergeMap(() => this.store.select(selectedConversationId).pipe(take(1))),
      mergeMap((conversationId) =>
        conversationId >= 0
          ? of(
              listMembers({ conversationId }),
              listNextMessages({ conversationId })
            )
          : EMPTY
      )
    )
  );

  openedAnyPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      mergeMap(() => this.store.select(selectSelfName).pipe(take(1))),
      mergeMap((selfname) => (!selfname ? of(getSelf()) : EMPTY))
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private sseEventService: SseEventService
  ) {}
}
