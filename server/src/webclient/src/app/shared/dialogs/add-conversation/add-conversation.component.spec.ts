import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConversationComponent } from './add-conversation.component';

describe('AddConversationComponent', () => {
  let component: AddConversationComponent;
  let fixture: ComponentFixture<AddConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConversationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
