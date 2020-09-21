import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  getSelf,
  getSelfFailure,
  getSelfSuccess,
} from '../../actions/user.actions';
import { UserService } from './user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class UserEffects {
  $getSelf = createEffect(() =>
    this.actions$.pipe(
      ofType(getSelf),
      switchMap(() =>
        this.userService.getSelf().pipe(
          map((s) => getSelfSuccess({ user: s })),
          catchError((message) => {
            this.router.navigate(['/authorize']);
            this.snackbar.open(message, '', {duration: 3000});
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
