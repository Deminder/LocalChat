import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import {
  filter,
  map,
  mergeMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  listMembers,
  listNextMessages,
} from '../../actions/conversation.actions';
import { routeBackToChat } from '../../actions/router.actions';
import { getSelf } from '../../actions/user.actions';
import { selectedConversationId } from '../../reducers/router.reducer';
import {
  areMembersNeeded,
  isFirstPageNeeded,
} from '../../selectors/conversation.selectors';
import { selectSelfName } from '../../selectors/user.selectors';

@Injectable()
export class RouterEffects {
  openedConversationPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(areMembersNeeded)),
      filter(([_, membersNeeded]) => membersNeeded),
      withLatestFrom(this.store.select(selectedConversationId)),
      map(([_, conversationId]) => listMembers({ conversationId }))
    )
  );

  openedConversationMessagePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(isFirstPageNeeded)),
      filter(([_, pageNeeded]) => pageNeeded),
      withLatestFrom(this.store.select(selectedConversationId)),
      map(([_, conversationId]) => listNextMessages({ conversationId }))
    )
  );

  openedAnyPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(selectSelfName)),
      filter(([_, selfname]) => !selfname),
      map(() => getSelf())
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

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store
  ) {}
}
