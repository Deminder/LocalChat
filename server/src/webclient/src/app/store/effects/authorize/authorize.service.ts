import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDts } from '../../../openapi/model/models';
import { Credentials } from '../../actions/authorize.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  endpoint = '/api/user';

  constructor(private http: HttpClient) {}

  login(creds: Credentials): Observable<string> {
    return this.http
      .post<string>('/login', creds)
      .pipe(catchError(this.handleError));
  }

  logout(): Observable<string> {
    return this.http
      .post<string>('/remove-tokens', {})
      .pipe(catchError(this.handleError));
  }

  register(creds: Credentials): Observable<string> {
    return this.http
      .post<string>(`${this.endpoint}/register`, creds)
      .pipe(catchError(this.handleError));
  }

  self(): Observable<UserDts> {
    return this.http
      .get<UserDts>(`${this.endpoint}/self`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error(`[Error Angular] ${error.error.message}`);
    } else {
      console.error(`[Error ${error.status}] ${error.error}`);
    }
    return throwError(error.error);
  }
}
