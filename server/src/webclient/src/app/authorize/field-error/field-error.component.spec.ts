import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldErrorComponent } from './field-error.component';
import { MaterialModule } from 'src/app/material/material.module';

describe('FormfieldComponent', () => {
  let component: FieldErrorComponent;
  let fixture: ComponentFixture<FieldErrorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule],
        declarations: [FieldErrorComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
