import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  FunctionWithParametersType,
  TypedAction,
} from '@ngrx/store/src/models';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { login, logout, register } from '../../actions/authorize.actions';
import { progressStart, progressStopAll } from '../../actions/progress.actions';
import { AuthorizeService } from './authorize.service';

@Injectable()
export class AuthorizeEffects {
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        switchMap(() => this.authorizeService.logout()),
        tap(() => this.router.navigate(['/authorize']))
      ),
    { dispatch: false }
  );

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(login),
        tap(() => this.notifyService.publish('login-errors', null)),
        switchMap((a) =>
          this.authorizeService.login(a.creds).pipe(
            tap(() => this.router.navigate(['/'])),
            catchError((errors) => {
              this.notifyService.publish('login-errors', errors);
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  register$ = this.createAuthEffect(
    register,
    (a) => this.authorizeService.register(a.creds),
    (_, a) =>
      this.router.navigate(['/authorize'], {
        queryParams: { registered: a.creds.username },
      }),
    'register-errors'
  );

  createAuthEffect<
    AC extends FunctionWithParametersType<P, R & TypedAction<T>> &
      TypedAction<T>,
    P extends any[],
    R extends object,
    T extends string = string,
    S = void
  >(
    actionCreator: AC,
    serviceCall: (action: ReturnType<AC>) => Observable<S>,
    resultProcess: (value: S, action: ReturnType<AC>) => void,
    notifyLabel: string
  ): Observable<Action> {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(actionCreator),
        tap((a) => this.store.dispatch(progressStart({ action: a.type }))),
        tap(() => this.notifyService.publish(notifyLabel, null)),
        switchMap((a) =>
          serviceCall(a).pipe(
            tap((s) => resultProcess(s, a)),
            catchError((errors) =>
              of(this.notifyService.publish(notifyLabel, errors))
            ),
            map(() => progressStopAll({ action: a.type }))
          )
        )
      )
    );
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    private authorizeService: AuthorizeService,
    private notifyService: NotifyService,
    private router: Router
  ) {}
}
