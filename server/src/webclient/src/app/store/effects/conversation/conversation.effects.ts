import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, ObservedValueOf, of, OperatorFunction, zip } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { MemberUpdateRequest } from 'src/app/openapi/model/models';
import {
  addConversation,
  addMember,
  conversationUpserted,
  createMessage,
  deleteMessage,
  editMember,
  editMessage,
  listConversations,
  listConversationsFailure,
  listConversationsSuccess,
  listMembers,
  listMembersFailure,
  listMembersSuccess,
  listNextMessages,
  listNextMessagesFailure,
  listNextMessagesSuccess,
  memberDeleted,
  MemberRef,
  memberUpserted,
  messageDeleted,
  MessageRef,
  messageUpserted,
  removeMember,
  renameConversation,
  conversationDeleted,
} from '../../actions/conversation.actions';
import {
  selectNextMessagePageRequest,
  selectPreviousMessagePage,
} from '../../selectors/conversation.selectors';
import { ConversationService } from './conversation.service';
import { selectSelfUserId } from '../../selectors/user.selectors';

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

  deleteMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteMessage),
      mergeMap((a) =>
        this.conversationService
          .deleteMessage(a.conversationId, a.messageId)
          .pipe(
            map(() =>
              messageDeleted({
                conversationId: a.conversationId,
                messageId: a.messageId,
              })
            ),
            this.catchActionError()
          )
      )
    )
  );

  upsertMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editMessage, createMessage),
      mergeMap((a) =>
        this.conversationService
          .upsertMessage(a.conversationId, {
            messageId: (a as MessageRef)?.messageId,
            text: a.text,
          })
          .pipe(
            map((message) =>
              messageUpserted({ conversationId: a.conversationId, message })
            ),
            this.catchActionError()
          )
      )
    )
  );

  removeMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeMember),
      mergeMap((a) =>
        this.conversationService.deleteMember(a.conversationId, a.userId).pipe(
          map(() => memberDeleted(a as MemberRef)),
          this.catchActionError()
        )
      )
    )
  );

  addedSelfMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(memberUpserted),
      mergeMap((a) =>
        this.store
          .select(selectSelfUserId)
          .pipe(
            mergeMap((userId) =>
              userId === a.member.userId ? of(listConversations()) : EMPTY
            )
          )
      )
    )
  );

  removedSelfMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(memberDeleted),
      mergeMap((a) =>
        this.store
          .select(selectSelfUserId)
          .pipe(
            mergeMap((userId) =>
              userId === a.userId
                ? of(conversationDeleted({ conversationId: a.conversationId }))
                : EMPTY
            )
          )
      )
    )
  );

  upsertMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editMember, addMember),
      mergeMap((a) =>
        this.conversationService
          .upsertMember(a.conversationId, a.userId, {
            ...a,
            permission: (a as MemberUpdateRequest).permission ?? {
              read: true,
              write: true,
              voice: true,
            },
          })
          .pipe(
            map((member) => memberUpserted({ member })),
            this.catchActionError()
          )
      )
    )
  );

  addConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addConversation),
      mergeMap((a) =>
        this.conversationService.create(a.name, []).pipe(
          map((conv) => conversationUpserted({ conv })),
          this.catchActionError()
        )
      )
    )
  );

  renameConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(renameConversation),
      mergeMap((a) =>
        this.conversationService.rename(a.conversationId, a.name).pipe(
          map((conv) => conversationUpserted({ conv })),
          this.catchActionError()
        )
      )
    )
  );

  private catchActionError<T, O>(): OperatorFunction<
    T,
    T | ObservedValueOf<O>
  > {
    return catchError((error) => {
      this.snackbar.open(error, '', { duration: 3000 });
      return EMPTY;
    });
  }

  constructor(
    private actions$: Actions,
    private conversationService: ConversationService,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}
}
