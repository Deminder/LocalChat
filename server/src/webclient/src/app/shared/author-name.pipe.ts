import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { MemberDto } from '../openapi/model/models';

@Pipe({
  name: 'authorName',
})
export class AuthorNamePipe implements PipeTransform {
  transform(authorId: number, memberEntites: Dictionary<MemberDto>): string {
    return memberEntites[authorId]?.username ?? `[User#${authorId}]`;
  }
}
