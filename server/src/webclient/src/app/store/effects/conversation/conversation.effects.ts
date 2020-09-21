import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
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
} from '../../actions/conversation.actions';
import { selectNextMessagePageRequest } from '../../selectors/conversation.selectors';
import { ConversationService } from './conversation.service';

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

  constructor(
    private actions$: Actions,
    private conversationService: ConversationService,
    private store: Store
  ) {}
}
