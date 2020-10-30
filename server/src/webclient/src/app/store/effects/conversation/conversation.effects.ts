import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {EMPTY, ObservedValueOf, of, OperatorFunction} from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';
import {MemberUpdateRequest} from 'src/app/openapi/model/models';
import {
  addConversation,
  addMember,
  changeMessageSearch,
  conversationDeleted,
  conversationUpserted,
  createMessage,
  deleteMessage,
  editMember,
  editMessage,
  listConversationsActions,
  listMembersActions,
  listNextMessagesActions,
  memberDeleted,
  MemberRef,
  memberUpserted,
  messageDeleted,
  MessageRef,
  messageUpserted,
  removeMember,
  renameConversation,
  startLoadMoreMessages,
  refreshConversationActions
} from '../../actions/conversation.actions';
import {
  isLastPage,
  isMessageSearching,
  selectLoadMoreConversationId,
  selectNextMessagePageRequest
} from '../../selectors/conversation.selectors';
import {selectSelfUserId} from '../../selectors/user.selectors';
import {ConversationService} from './conversation.service';

@Injectable()
export class ConversationEffects {
  isMessageSearching$ = this.store.select(isMessageSearching);

  refreshConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refreshConversationActions.request),
      switchMap((a) =>
        this.conversationService.getOne(a.conversationId).pipe(
          map((conv) => refreshConversationActions.success({ conv })),
          catchError(() => of(refreshConversationActions.failure()))
        )
      )
    )
  );

  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listConversationsActions.request),
      switchMap(() =>
        this.conversationService.list().pipe(
          map((convs) => listConversationsActions.success({ convs })),
          catchError(() => of(listConversationsActions.failure()))
        )
      )
    )
  );

  loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listMembersActions.request),
      switchMap((a) =>
        this.conversationService.members(a.conversationId).pipe(
          map((members) => listMembersActions.success({ members })),
          catchError(() => of(listMembersActions.failure()))
        )
      )
    )
  );

  loadMoreMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startLoadMoreMessages),
      withLatestFrom(this.store.select(isLastPage)),
      filter(([_, last]) => !last),
      map(([{ conversationId }]) =>
        listNextMessagesActions.request({ conversationId })
      )
    )
  );

  continueLoadMoreMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listNextMessagesActions.success),
      delay(100),
      withLatestFrom(this.store.select(selectLoadMoreConversationId)),
      filter(
        ([a, scid]) => !a.messagePage.last && a.messagePage.convId === scid
      ),
      map(([_, conversationId]) =>
        listNextMessagesActions.request({ conversationId })
      )
    )
  );

  searchChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeMessageSearch),
      withLatestFrom(this.isMessageSearching$),
      filter(([_, searching]) => searching),
      withLatestFrom(this.store.select(isLastPage)),
      filter(([_, lastPage]) => !lastPage),
      map(([[a]]) =>
        listNextMessagesActions.request({ conversationId: a.conversationId })
      )
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listNextMessagesActions.request),
      withLatestFrom(this.isMessageSearching$),
      concatMap(([a, searching]) =>
        this.store.select(selectNextMessagePageRequest).pipe(
          take(1),
          mergeMap((nextPageReq) =>
            this.conversationService
              .messages(
                a.conversationId,
                // load all messages when searching
                searching ? { ...nextPageReq, pageSize: 4096 } : nextPageReq
              )
              .pipe(
                map((messagePage) =>
                  listNextMessagesActions.success({ messagePage })
                ),
                catchError(() => of(listNextMessagesActions.failure()))
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
              userId === a.member.userId
                ? of(listConversationsActions.request())
                : EMPTY
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
      this.snackbar.open(error || 'Action Failed!', '', { duration: 3000 });
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
