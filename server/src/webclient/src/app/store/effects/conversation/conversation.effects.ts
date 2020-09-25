import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import {
  listConversations,
  listConversationsFailure,
  listConversationsSuccess,
  listMembers,
  listMembersFailure,
  listMembersSuccess,
  listNextMessages,
  listNextMessagesSuccess,
  listNextMessagesFailure,
  createMessage,
  messageUpserted,
} from '../../actions/conversation.actions';
import { selectNextMessagePageRequest } from '../../selectors/conversation.selectors';
import { ConversationService } from './conversation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ConversationEffects {
  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listConversations),
      switchMap(() =>
        this.conversationService.list().pipe(
          map((convs) => listConversationsSuccess({ convs })),
          catchError(() => of(listConversationsFailure()))
        )
      )
    )
  );

  loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listMembers),
      switchMap((a) =>
        this.conversationService.members(a.conversationId).pipe(
          map((members) => listMembersSuccess({ members })),
          catchError(() => of(listMembersFailure()))
        )
      )
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listNextMessages),
      switchMap((a) =>
        this.store.select(selectNextMessagePageRequest).pipe(
          take(1),
          mergeMap((nextPageReq) =>
            this.conversationService
              .messages(a.conversationId, nextPageReq)
              .pipe(
                map((messagePage) => listNextMessagesSuccess({ messagePage })),
                catchError(() => of(listNextMessagesFailure()))
              )
          )
        )
      )
    )
  );

  createMesage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createMessage),
      mergeMap((a) =>
        this.conversationService
          .upsertMessage(a.conversationId, { text: a.text })
          .pipe(
            map((message) => messageUpserted({message})),
            catchError((error) => {
              this.snackbar.open(error, '', { duration: 3000 });
              return of({type: 'nope'});
            })
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private conversationService: ConversationService,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}
}
