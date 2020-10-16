import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { SseEventService } from '../../../shared/services/sse-event.service';
import {
  conversationUpserted,
  listConversations,
  memberDeleted,
  memberUpserted,
  messageDeleted,
  messageUpserted,
} from '../../actions/conversation.actions';
import {
  getSelf,
  getSelfFailure,
  getSelfSuccess,
  listenForEvents,
} from '../../actions/user.actions';
import { UserService } from './user.service';

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
            this.snackbar.open(message || 'Username unavailable!', '', {
              duration: 3000,
            });
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
            this.snackbar.open(error.message || 'Event source error!', '', {
              duration: 3000,
            });
            return of(getSelfFailure());
          })
        )
      )
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
