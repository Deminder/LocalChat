import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      .pipe(catchError(e => throwError(e.error.message)));
  }

  search(request: UserSearchRequest): Observable<UserSearchResponse> {
    return this.http.post<UserSearchResponse>(`${this.endpoint}/search`, request)
      .pipe(catchError(e => throwError(e.error.message)));
  }

  getUserId(request: UserGetRequest): Observable<UserGetResponse> {
    return this.http.post<UserGetResponse>(`${this.endpoint}/one`, request)
      .pipe(catchError(e => throwError(e.error.message)));
  }
}
