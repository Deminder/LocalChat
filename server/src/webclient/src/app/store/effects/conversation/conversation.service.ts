import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  endpoint = '/api/conversations';

  list(): Observable<ConversationNameDto[]> {
    return this.http.get<ConversationNameDto[]>(this.endpoint);
  }

  create(name: string, memberNames: string[]): Observable<ConversationNameDto> {
    return this.http.post<ConversationNameDto>(this.endpoint, {
      name,
      memberNames,
    });
  }


  messages(
    cid: number,
    request: MessageSearchRequestReq
  ): Observable<ConversationMessagePageDto> {
    return this.http.post<ConversationMessagePageDto>(
      `${this.endpoint}/${cid}/messages`,
      request
    );
  }

  upsertMessage(cid: number, request: MessageUpsertRequest): Observable<ConversationMessageDto> {
    return this.http.put<ConversationMessageDto>(`${this.endpoint}/${cid}/messages`, request);
  }

  deleteMessage(cid: number, messageId: number): Observable<string>  {
    return this.http.delete(`${this.endpoint}/${cid}/messages/${messageId}`, {responseType: 'text'});
  }

  members(cid: number): Observable<MemberDto[]> {
    return this.http.get<MemberDto[]>(`${this.endpoint}/${cid}/members`);
  }

  upsertMember(
    cid: number,
    userId: number,
    memberUpdate: MemberUpdateRequest
  ): Observable<MemberDto> {
    return this.http.post<MemberDto>(
      `${this.endpoint}/${cid}/members/${userId}`,
      memberUpdate
    );
  }

  memberModifyPermission(
    cid: number,
    userId: number
  ): Observable<MemberModifyPermissionDto> {
    return this.http.get<MemberModifyPermissionDto>(
      `${this.endpoint}/${cid}/members/${userId}/allowed-modification`
    );
  }

  deleteMember(cid: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${cid}/members/${userId}`);
  }

  constructor(private http: HttpClient) {}
}
