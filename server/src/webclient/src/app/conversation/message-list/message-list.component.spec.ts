import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MessageListComponent} from './message-list.component';
import {MaterialModule} from 'src/app/material/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';


describe('MessageListComponent', () => {
  let component: MessageListComponent;
  let fixture: ComponentFixture<MessageListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [MessageListComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
