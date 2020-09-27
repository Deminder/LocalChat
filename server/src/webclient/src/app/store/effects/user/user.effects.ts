import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { listConversations } from '../../actions/conversation.actions';
import {
  getSelf,
  getSelfFailure,
  getSelfSuccess,
} from '../../actions/user.actions';
import { UserService } from './user.service';

@Injectable()
export class UserEffects {
  $getSelf = createEffect(() =>
    this.actions$.pipe(
      ofType(getSelf),
      switchMap(() =>
        this.userService.getSelf().pipe(
          mergeMap((s) => of(getSelfSuccess({ user: s }), listConversations())),
          catchError((message) => {
            this.router.navigate(['/authorize']);
            this.snackbar.open(message, '', { duration: 3000 });
            return of(getSelfFailure());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private snackbar: MatSnackBar,
    private userService: UserService
  ) {}
}
