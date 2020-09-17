import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.component.html',
  styleUrls: ['./field-error.component.scss'],
})
export class FieldErrorComponent implements OnInit {
  @Input()
  errors: { defaultMessage: string; field: string }[] = [];

  @Input()
  field = '';

  constructor() {}

  ngOnInit(): void {}

  get messages(): string[] {
    return this.errors?.filter((e) => e.field === this.field)
        .map((e) => e.defaultMessage) ?? []
    ;
  }
}
