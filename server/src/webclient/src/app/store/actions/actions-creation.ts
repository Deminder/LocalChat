import { Action, createAction } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ActionCreator,
  ActionCreatorProps,
  NotAllowedCheck,
  TypedAction,
} from '@ngrx/store/src/models';
import { EMPTY, merge, Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

type CProps<P> = P extends object
  ? ActionCreatorProps<P> & NotAllowedCheck<P>
  : never;

export type APIActionCreator<T> = ActionCreator<
  string,
  T extends object
    ? (props: T) => T & TypedAction<string>
    : () => TypedAction<string>
>;

export function apiActionInstance<
  T extends object | undefined,
  AC extends APIActionCreator<T>
>(creator: AC, props: T): ReturnType<AC> {
  if (props === undefined) {
    return (creator as () => TypedAction<string>)() as ReturnType<AC>;
  } else {
    return creator(props) as ReturnType<AC>;
  }
}
export type APIActionCreatorContainer<
  R extends object | undefined = undefined,
  S extends object | undefined = undefined,
  F extends { error: any } | undefined = undefined
> = {
  request: APIActionCreator<R>;
  success: APIActionCreator<S>;
  failure: APIActionCreator<F>;
};

export function createApiAction<P>(
  s: string,
  ps?: CProps<P>
): APIActionCreator<P> {
  if (ps !== undefined) {
    return createAction(s, ps) as APIActionCreator<P>;
  } else {
    return createAction(s) as APIActionCreator<P>;
  }
}

export function createApiActions<
  R extends object | undefined = undefined,
  S extends object | undefined = undefined,
  F extends { error: any } | undefined = undefined
>(
  topic: string,
  phrase: string,
  properties: {
    request?: CProps<R>;
    success?: CProps<S>;
    failure?: CProps<F>;
  } = {},
  silent = false
): APIActionCreatorContainer<R, S, F> {
  const prefix = `[${topic}/API${silent ? '-silent' : ''}] ${phrase}`;

  return {
    request: createApiAction(prefix, properties.request),
    success: createApiAction(prefix + ' Success', properties.success),
    failure: createApiAction(prefix + ' Failure', properties.failure),
  } as APIActionCreatorContainer<R, S, F>;
}

export function createApiActionEffect<
  R extends object | undefined = undefined,
  S extends object | undefined = undefined,
  F extends { error: any } | undefined = undefined
>(
  actions$: Actions,
  container: APIActionCreatorContainer<R, S, F>,
  calls: {
    service: (action: ReturnType<APIActionCreator<R>>) => Observable<S>;
    success?: (res: S) => Observable<Action>;
    error?: (error: any) => Observable<Action>;
  }
): Observable<Action> {
  return createEffect(() =>
    actions$.pipe(
      // Handle a API request action
      ofType(container.request),
      switchMap((r) =>
        // Call service function
        calls.service(r).pipe(
          mergeMap((s) =>
            merge(
              calls.success ? calls.success(s) : EMPTY,
              // Create a success action
              of(apiActionInstance(container.success, s))
            )
          ),
          catchError((error) => {
            return merge(
              calls.error ? calls.error(error) : EMPTY,
              // Create a failure action
              of(
                apiActionInstance(
                  container.failure,
                  error === undefined ? undefined : { error }
                )
              )
            );
          })
        )
      )
    )
  );
}
