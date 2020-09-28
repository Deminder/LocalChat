import { TestBed } from '@angular/core/testing';

import { SseEventService } from './sse-event.service';

describe('SseEventService', () => {
  let service: SseEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
