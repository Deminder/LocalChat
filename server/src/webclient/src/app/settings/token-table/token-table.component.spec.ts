import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TokenTableComponent } from './token-table.component';
import {MaterialModule} from 'src/app/material/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('TokenTableComponent', () => {
  let component: TokenTableComponent;
  let fixture: ComponentFixture<TokenTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [TokenTableComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
