import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { MemberDto } from '../openapi/model/models';

@Pipe({
  name: 'authorColor',
})
export class AuthorColorPipe implements PipeTransform {
  transform(authorId: number, memberEntites: Dictionary<MemberDto>): number {
    if (authorId in memberEntites) {
      const mem = memberEntites[authorId];
      return (mem.color ?? mem.joinDate) % 12;
    }
    return 0;
  }
}
