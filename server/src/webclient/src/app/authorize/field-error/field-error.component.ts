import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.component.html',
  styleUrls: ['./field-error.component.scss'],
})
export class FieldErrorComponent {
  @Input()
  errors: { defaultMessage: string; field: string }[] = [];

  @Input()
  field = '';

  get messages(): string[] {
    return this.errors.filter((e) => e.field === this.field)
        .map((e) => e.defaultMessage)
    ;
  }
}
