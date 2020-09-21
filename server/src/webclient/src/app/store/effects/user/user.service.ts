import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserDts } from 'src/app/openapi/model/models';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  endpoint = '/api/user';

  constructor(private http: HttpClient) {}

  getSelf(): Observable<UserDts> {
    return this.http.get<UserDts>(`${this.endpoint}/self`)
      .pipe(catchError(e => throwError(e.error.message)));
  }
}
