import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  listConversations,
  listConversationsSuccess,
} from '../actions/conversation.actions';

@Injectable()
export class ConversationEffects {
  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listConversations),
      mergeMap(() => of(listConversationsSuccess({ id: 1 })))
    )
  );

  constructor(private actions$: Actions) {}
}
