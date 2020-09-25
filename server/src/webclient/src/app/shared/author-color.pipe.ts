import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { MemberDto } from '../openapi/model/models';

@Pipe({
  name: 'authorColor',
})
export class AuthorColorPipe implements PipeTransform {
  transform(authorId: number, memberEntites: Dictionary<MemberDto>): unknown {
    const i = (memberEntites[authorId]?.joinDate % 8) * 8 + 32;
    return `rgb(${i},${i},${i})`;
  }
}
