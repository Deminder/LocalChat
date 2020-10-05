import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { UserService } from 'src/app/store/effects/user/user.service';
import { AddMemberComponent } from './add-member.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';

describe('AddMemberComponent', () => {
  let component: AddMemberComponent;
  let fixture: ComponentFixture<AddMemberComponent>;
  const ref = jasmine.createSpyObj('ref', ['close']);
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(
    waitForAsync(() => {
      userServiceSpy = jasmine.createSpyObj('userService', [
        'getUserId',
        'search',
      ]);
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
        declarations: [AddMemberComponent],
        providers: [
          { provide: MatDialogRef, useValue: ref },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              conversationId: 1,
              members: [],
            },
          },
          { provide: UserService, useValue: userServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
