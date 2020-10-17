import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import {RouterTestingModule} from '@angular/router/testing';

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
    ],
    providers: [
      AuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
