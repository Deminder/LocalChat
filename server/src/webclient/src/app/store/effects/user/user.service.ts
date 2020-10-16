import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserDto, UserSearchRequest, UserSearchResponse, UserGetRequest, UserGetResponse } from 'src/app/openapi/model/models';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  endpoint = '/api/user';

  constructor(private http: HttpClient) {}

  getSelf(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.endpoint}/self`)
      .pipe(catchError(this.handleAPIError));
  }

  search(request: UserSearchRequest): Observable<UserSearchResponse> {
    return this.http.post<UserSearchResponse>(`${this.endpoint}/search`, request)
      .pipe(catchError(this.handleAPIError));
  }

  getUserId(request: UserGetRequest): Observable<UserGetResponse> {
    return this.http.post<UserGetResponse>(`${this.endpoint}/one`, request)
      .pipe(catchError(this.handleAPIError));
  }

  private handleAPIError(error: HttpErrorResponse): Observable<never> {
    const err = error.error;
    if (err instanceof ErrorEvent) {
      console.error(`[Error Angular] ${err.message}`);
    } else {
      console.error(`[Error ${error.status}] ${err}`);
    }
    return throwError(err.message);
  }
}
