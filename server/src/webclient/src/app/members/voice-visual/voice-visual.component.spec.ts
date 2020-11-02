import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceVisualComponent } from './voice-visual.component';

describe('VoiceVisualComponent', () => {
  let component: VoiceVisualComponent;
  let fixture: ComponentFixture<VoiceVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceVisualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
