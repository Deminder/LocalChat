import { createAction } from '@ngrx/store';
import {
  ActionCreator,
  NotAllowedCheck,
  Props,
  TypedAction,
} from '@ngrx/store/src/models';

type CProps<T> = T extends object ? Props<T> & NotAllowedCheck<T> : never;

export type APIActionCreator<T> = ActionCreator<
  string,
  T extends object
    ? (props: T & NotAllowedCheck<T>) => T & TypedAction<string>
    : () => TypedAction<string>
>;
export type APIActionCreatorContainer<R, S, F> = {
  request: APIActionCreator<R>;
  success: APIActionCreator<S>;
  failure: APIActionCreator<F>;
};

export function createApiAction<P extends object>(
  s: string,
  ps: CProps<P>
): any {
  if (ps) {
    return createAction(s, ps);
  } else {
    return createAction(s);
  }
}

export function createApiActions<
  R extends object | void = void,
  S extends object | void = void,
  F extends object | void = void
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
