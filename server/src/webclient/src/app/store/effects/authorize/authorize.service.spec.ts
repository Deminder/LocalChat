import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthorizeService } from './authorize.service';
import { catchError } from 'rxjs/operators';

describe('AuthorizeService', () => {
  let service: AuthorizeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthorizeService],
    });
    service = TestBed.inject(AuthorizeService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should give login error message', waitForAsync(() => {
    const creds = { username: 'user1', password: 'pwd' };

    service
      .login(creds)
      .pipe(
        catchError((err) => {
          expect(err[0]).toBeTruthy();
          expect(err[0].defaultMessage).toBeTruthy();
          expect(err[0].defaultMessage).toEqual('Invalid!');
          return 'ok';
        })
      )
      .subscribe();

    const mockReq = http.expectOne(
      `${service.endpoint}/login?username=${creds.username}&password=${creds.password}`
    );
    expect(mockReq.cancelled).toBeFalsy();
    mockReq.error(new ErrorEvent('mocked error'), { status: 404 });

    http.verify();
  }));
});
