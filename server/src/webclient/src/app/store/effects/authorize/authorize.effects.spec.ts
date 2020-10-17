import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, EMPTY } from 'rxjs';

import { AuthorizeEffects } from './authorize.effects';
import { login, Credentials } from '../../actions/authorize.actions';
import { progressStopAll, progressStart } from '../../actions/progress.actions';
import { hot, cold } from 'jasmine-marbles';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthorizeService } from './authorize.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';

describe('AuthEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: AuthorizeEffects;
  let store: MockStore;

  let authorizeServiceSpy: jasmine.SpyObj<AuthorizeService>;
  let notifyServiceSpy: jasmine.SpyObj<NotifyService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authorizeServiceSpy = jasmine.createSpyObj('authorizeServiceSpy', [
      'login',
      'logout',
      'register',
    ]);
    notifyServiceSpy = jasmine.createSpyObj('notifyServiceSpy', ['publish']);
    routerSpy = jasmine.createSpyObj('routerSpy', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthorizeEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: AuthorizeService, useValue: authorizeServiceSpy },
        { provide: NotifyService, useValue: notifyServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    store = TestBed.inject(MockStore);
    effects = TestBed.inject(AuthorizeEffects);
    spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should reroute after login success', () => {
    const creds = { username: 'user1', password: 'pwd' } as Credentials;
    authorizeServiceSpy.login.and.returnValue(of(null));
    actions$ = hot('--a-', {
      a: login({ creds }),
    });

    const expected = hot('--b-', {
      b: progressStopAll({ action: login.type }),
    });

    expect(effects.login$).toBeObservable(expected);

    expect(store.dispatch).toHaveBeenCalledWith(
      progressStart({ action: login.type })
    );
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
