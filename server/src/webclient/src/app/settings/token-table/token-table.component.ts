import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { LoginTokenDto } from 'src/app/openapi/model/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-token-table',
  templateUrl: './token-table.component.html',
  styleUrls: ['./token-table.component.scss'],
})
export class TokenTableComponent implements OnInit {
  @Input()
  tokens: LoginTokenDto[];

  @Output()
  delete = new EventEmitter<LoginTokenDto>();

  dp = new DatePipe(this.locale);
  loginTokenColumnPipes = {
    lastUsed: (v: any) => this.dp.transform(v, 'short'),
    createDate: (v: any) => this.dp.transform(v, 'short'),
  };
  loginTokenColumnNames = {
    lastUsed: 'Last Used',
    createDate: 'Create Date',
    description: 'Description',
  };
  loginTokenColumns = ['lastUsed', 'createDate', 'description'];
  loginTokenShownColumns = this.loginTokenColumns.concat(['deleteButton']);

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnInit(): void {}

  transform(element: any, column: string): string {
    const value = element[column];
    return this.loginTokenColumnPipes[column]
      ? this.loginTokenColumnPipes[column](value)
      : value;
  }
}
