import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, tap, catchError } from 'rxjs/operators';
import { login, register } from '../../actions/authorize.actions';
import { progressStart, progressStop } from '../../actions/progress.actions';
import { AuthorizeService } from './authorize.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable()
export class AuthorizeEffects {
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(login),
        tap(() => progressStart({ action: login })),
        mergeMap((a) =>
          this.authorizeService.logout().pipe(
            tap(() => this.router.navigate(['/authorize'])),
            catchError((error) =>
              of(this.notifyService.publish('logout-errors', error.errors))
            ),
            map(() => progressStop({ action: a }))
          )
        )
      ),
    { useEffectsErrorHandler: false }
  );

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(login),
        tap(() => progressStart({ action: login })),
        mergeMap((a) =>
          this.authorizeService.login(a.creds).pipe(
            tap(() => this.router.navigate(['/'])),
            catchError((error) =>
              of(this.notifyService.publish('login-errors', error.errors))
            ),
            map(() => progressStop({ action: a }))
          )
        )
      ),
    { useEffectsErrorHandler: false }
  );

  register$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(register),
        tap(() => progressStart({ action: login })),
        mergeMap((a) =>
          this.authorizeService.register(a.creds).pipe(
            tap( () => this.router.navigate(['/authorize'], {
                  queryParams: { registered: a.creds.username },
                })
            ),
            catchError((error) =>
              of(this.notifyService.publish('register-errors', error.errors))
            ),
            map(() => progressStop({ action: a }))
          )
        )
      ),
    { useEffectsErrorHandler: false }
  );

  constructor(
    private actions$: Actions,
    private authorizeService: AuthorizeService,
    private notifyService: NotifyService,
    private router: Router
  ) {}
}
