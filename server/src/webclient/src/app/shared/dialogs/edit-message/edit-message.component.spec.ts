import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMessageComponent } from './edit-message.component';
import { MaterialModule } from 'src/app/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConversationMessageDto } from 'src/app/openapi/model/models';
import { FormsModule } from '@angular/forms';

export const sampleConversationMessages: ConversationMessageDto[] = [
  {
    id: 0,
    authorDate: 100,
    lastChange: 100,
    authorUserId: 1,
    text: 'some text in this message',
  },
  {
    id: 1,
    authorDate: 1,
    lastChange: 0,
    authorUserId: 2,
    text: 'message text 2',
  },
];
describe('EditMessageComponent', () => {
  let component: EditMessageComponent;
  const ref = jasmine.createSpyObj('ref', ['close']);
  let fixture: ComponentFixture<EditMessageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, MaterialModule, NoopAnimationsModule],
        declarations: [EditMessageComponent],
        providers: [
          { provide: MatDialogRef, useValue: ref },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              message: sampleConversationMessages[0],
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
