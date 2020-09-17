import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fielderror',
})
export class FielderrorPipe implements PipeTransform {
  transform(
    errors: { defaultMessage: string; field: string }[],
    ...fieldnames: string[]
  ): unknown {
    return (
      errors
        ?.filter((e) => fieldnames.indexOf(e.field) !== -1)
        .map((e) => e.defaultMessage)
        .join(' ') ?? ''
    );
  }
}
