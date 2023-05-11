import { TestBed } from '@angular/core/testing';

import { ConversationService } from './conversation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ConversationService', () => {
  let service: ConversationService;
  let _http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConversationService],
    });
    service = TestBed.inject(ConversationService);
    _http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
