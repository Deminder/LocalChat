import {
  Component,
  EventEmitter,
  Input,
  Output,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { LoginTokenDto } from 'src/app/openapi/model/models';
import { DatePipe } from '@angular/common';

type PipeValue = Date | string | number;

@Component({
  selector: 'app-token-table',
  templateUrl: './token-table.component.html',
  styleUrls: ['./token-table.component.scss'],
})
export class TokenTableComponent {
  @Input()
  tokens: LoginTokenDto[] = [];

  @Output()
  delete = new EventEmitter<LoginTokenDto>();

  dp = new DatePipe(this.locale);
  loginTokenColumnPipes = {
    lastUsed: (v: PipeValue) => this.dp.transform(v, 'short'),
    createDate: (v: PipeValue) => this.dp.transform(v, 'short'),
  } as {[column: string]: ((value: PipeValue) => PipeValue)};
  loginTokenColumnNames = {
    lastUsed: 'Last Used',
    createDate: 'Create Date',
    description: 'Description',
  } as {[column: string]: string};
  loginTokenColumns = ['lastUsed', 'createDate', 'description'];
  loginTokenShownColumns = this.loginTokenColumns.concat(['deleteButton']);

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: PipeValue, column: string): PipeValue {
    const pipe = this.loginTokenColumnPipes[column];
    return pipe ? pipe(value) : value;
  }
}
