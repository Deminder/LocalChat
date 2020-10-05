import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, EMPTY } from 'rxjs';
import { catchError, mergeMap, switchMap, map } from 'rxjs/operators';
import {
  listConversations,
  memberUpserted,
  conversationUpserted,
  messageUpserted,
  messageDeleted,
  memberDeleted,
} from '../../actions/conversation.actions';
import {
  getSelf,
  getSelfFailure,
  getSelfSuccess,
  listenForEvents,
} from '../../actions/user.actions';
import { UserService } from './user.service';
import { SseEventService } from '../../../shared/services/sse-event.service';

@Injectable()
export class UserEffects {
  $getSelf = createEffect(() =>
    this.actions$.pipe(
      ofType(getSelf),
      switchMap(() => this.userService.getSelf()),
      mergeMap((s) => of(getSelfSuccess({ user: s }), listConversations(), listenForEvents())),
      catchError((message) => {
        this.router.navigate(['/authorize']);
        this.snackbar.open(message, '', { duration: 3000 });
        return of(getSelfFailure());
      })
    )
  );

  $eventListen = createEffect(() =>
    this.actions$.pipe(
      ofType(listenForEvents),
      switchMap(() => this.sseEventService.receiveEvents()),
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
        this.snackbar.open(error.message, '', { duration: 3000 });
        return of(getSelfFailure());
      })
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private sseEventService: SseEventService
  ) {}
}
