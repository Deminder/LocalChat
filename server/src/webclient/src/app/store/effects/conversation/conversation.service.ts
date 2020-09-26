import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  ConversationMessagePageDto,
  ConversationNameDto,
  MemberDto,
  MemberModifyPermissionDto,
  MemberUpdateRequest,
  MessageSearchRequestReq,
  MessageUpsertRequest,
  ConversationMessageDto,
} from 'src/app/openapi/model/models';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  endpoint = '/api/conversations';

  list(): Observable<ConversationNameDto[]> {
    return this.http
      .get<ConversationNameDto[]>(this.endpoint)
      .pipe(catchError(this.handleAPIError));
  }

  create(name: string, memberNames: string[]): Observable<ConversationNameDto> {
    return this.http
      .post<ConversationNameDto>(this.endpoint, {
        name,
        memberNames,
      })
      .pipe(catchError(this.handleAPIError));
  }

  rename(cid: number, name: string): Observable<ConversationNameDto> {
    return this.http
      .post<ConversationNameDto>(`${this.endpoint}/rename`, {
        conversationId: cid, conversationName: name
      })
      .pipe(catchError(this.handleAPIError));
  }

  messages(
    cid: number,
    request: MessageSearchRequestReq
  ): Observable<ConversationMessagePageDto> {
    return this.http
      .post<ConversationMessagePageDto>(
        `${this.endpoint}/${cid}/messages`,
        request
      )
      .pipe(catchError(this.handleAPIError));
  }

  upsertMessage(
    cid: number,
    request: MessageUpsertRequest
  ): Observable<ConversationMessageDto> {
    return this.http
      .put<ConversationMessageDto>(`${this.endpoint}/${cid}/messages`, request)
      .pipe(catchError(this.handleAPIError));
  }

  deleteMessage(cid: number, messageId: number): Observable<any> {
    return this.http
      .delete(`${this.endpoint}/${cid}/messages/${messageId}`)
      .pipe(catchError(this.handleAPIError));
  }

  members(cid: number): Observable<MemberDto[]> {
    return this.http
      .get<MemberDto[]>(`${this.endpoint}/${cid}/members`)
      .pipe(catchError(this.handleAPIError));
  }

  upsertMember(
    cid: number,
    userId: number,
    memberUpdate: MemberUpdateRequest
  ): Observable<MemberDto> {
    return this.http
      .post<MemberDto>(
        `${this.endpoint}/${cid}/members/${userId}`,
        memberUpdate
      )
      .pipe(catchError(this.handleAPIError));
  }

  memberModifyPermission(
    cid: number,
    userId: number
  ): Observable<MemberModifyPermissionDto> {
    return this.http
      .get<MemberModifyPermissionDto>(
        `${this.endpoint}/${cid}/members/${userId}/allowed-modification`
      )
      .pipe(catchError(this.handleAPIError));
  }

  deleteMember(cid: number, userId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoint}/${cid}/members/${userId}`)
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

  constructor(private http: HttpClient) {}
}
