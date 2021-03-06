import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Credentials } from '../../actions/authorize.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  endpoint = '/api/user';

  constructor(private http: HttpClient) {}

  login(creds: Credentials): Observable<void> {
    return this.http
      .post<void>( `${this.endpoint}/login`, creds)
      .pipe(catchError(this.handleFormError));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.endpoint}/logout`, {})
      .pipe(catchError(this.handleFormError));
  }

  register(creds: Credentials): Observable<string> {
    return this.http
      .post(`${this.endpoint}/register`, creds, { responseType: 'text' })
      .pipe(catchError(this.handleFormError));
  }

  private handleFormError(error: HttpErrorResponse): Observable<never> {
    const err = error.error;
    if (err instanceof ErrorEvent) {
      console.error(`[Error Angular] ${err.message}`);
    } else {
      console.error(`[Error ${error.status}] ${err}`);
    }
    const serviceError = err.errors ?? [
      {
        field: 'password',
        defaultMessage: error.status === 404 ? 'Invalid!' : err.message ?? err,
      },
    ];
    return throwError(serviceError);
  }
}
