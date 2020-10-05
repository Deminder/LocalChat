import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConversationComponent } from './conversation.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { MessageListComponent } from './message-list/message-list.component';
import { WriterComponent } from './writer/writer.component';
import { MemoizedSelector } from '@ngrx/store';
import { selectedConversationId } from '../store/reducers/router.reducer';
import { AppState } from '../store/reducers/app.reducer';
import { selectSelfUserId } from '../store/selectors/user.selectors';
import { Dictionary } from '@ngrx/entity';
import { MemberDto, ConversationMessageDto } from '../openapi/model/models';
import {
  selectConversationMessages,
  selectConversationMemberEntities,
} from '../store/selectors/conversation.selectors';
import {MaterialModule} from '../material/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let store: MockStore;
  let mockConversationIdSelector: MemoizedSelector<AppState, number>;
  let mockSelfUserIdSelector: MemoizedSelector<AppState, number>;
  let mockConversationMessagesSelector: MemoizedSelector<
    AppState,
    ConversationMessageDto[]
  >;
  let mockConversationMemberEntitiesSelector: MemoizedSelector<
    AppState,
    Dictionary<MemberDto>
  >;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [
          ConversationComponent,
          MockComponent(MessageListComponent),
          MockComponent(WriterComponent),
        ],
        providers: [provideMockStore()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    mockConversationIdSelector = store.overrideSelector(
      selectedConversationId,
      1
    );
    mockSelfUserIdSelector = store.overrideSelector(selectSelfUserId, 2);
    mockConversationMessagesSelector = store.overrideSelector(
      selectConversationMessages,
      [{ id: 1, authorDate: 0, authorUserId: 1, lastChange: 0, text: 'hello' }]
    );
    mockConversationMemberEntitiesSelector = store.overrideSelector(
      selectConversationMemberEntities,
      {}
    );

    // component
    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
