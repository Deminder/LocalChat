import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { MemberDto } from '../openapi/model/models';

@Pipe({
  name: 'authorColor',
})
export class AuthorColorPipe implements PipeTransform {
  transform(authorId: number, memberEntites: Dictionary<MemberDto>): unknown {
    const mem = memberEntites[authorId];
    const i = (mem?.joinDate % 8) * 8 + 32;
    const color = mem?.color ?? `rgb(${i},${i},${i})`;
    return color;
  }
}
