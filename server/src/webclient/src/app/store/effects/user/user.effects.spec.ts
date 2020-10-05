import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { UserEffects } from './user.effects';
import { Router } from '@angular/router';
import {UserService} from './user.service';
import {SseEventService} from 'src/app/shared/services/sse-event.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;

  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let sseEventServiceSpy: jasmine.SpyObj<SseEventService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('userService', ['getSelf']);
    sseEventServiceSpy = jasmine.createSpyObj('seeEventService', ['receiveEvents']);

    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule
      ],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: SseEventService, useValue: sseEventServiceSpy },
      ],
    });

    effects = TestBed.inject(UserEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
