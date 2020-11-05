import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { VoiceService } from './voice.service';

describe('VoiceService', () => {
  let service: VoiceService;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('store', ['dispatch']);
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: storeSpy }],
    });
    service = TestBed.inject(VoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
