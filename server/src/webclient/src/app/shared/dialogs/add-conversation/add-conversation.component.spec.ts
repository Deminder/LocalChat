import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { AddConversationComponent } from './add-conversation.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';

describe('AddConversationComponent', () => {
  let component: AddConversationComponent;
  let fixture: ComponentFixture<AddConversationComponent>;
  const ref = jasmine.createSpyObj('ref', ['close']);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, ReactiveFormsModule, NoopAnimationsModule],
        declarations: [AddConversationComponent],
        providers: [
          { provide: MatDialogRef, useValue: ref },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              name: 'testname',
              title: 'title',
              submitText: 'submitText',
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
