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
  isFirstPage,
  isLastPage,
  selectSelfMember,
  isLoadingMoreMessages,
  selectNewestMessage,
  selectMessageSearch,
  selectMessageSearchIndex,
} from '../store/selectors/conversation.selectors';
import { MaterialModule } from '../material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { sampleConversationMessages } from '../shared/dialogs/edit-message/edit-message.component.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { userKey } from '../store/reducers/user.reducer';
import { MessageSearch } from '../store/reducers/conversation.reducer';

export const sampleMemberDtos = [
  {
    userId: 1,
    convId: 1,
    username: 'user1',
    joinDate: 0,
    permission: {
      read: true,
      write: true,
      voice: true,
      administrate: false,
      moderate: true,
    },
    modifiablePermission: {
      remove: true,
      modify: {
        read: false,
        write: false,
        voice: false,
        moderate: false,
        administrate: false,
      },
    },
  },
];

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
  let mockIsFirstPageSelector: MemoizedSelector<AppState, boolean>;
  let mockIsLastPageSelector: MemoizedSelector<AppState, boolean>;
  let mockSelfMemberSelector: MemoizedSelector<AppState, MemberDto>;
  let mockIsLoadingMoreMessagesSelector: MemoizedSelector<AppState, boolean>;
  let mockNewestConversationMessageSelector: MemoizedSelector<
    AppState,
    ConversationMessageDto
  >;
  let mockMessageSearchSelector: MemoizedSelector<AppState, MessageSearch>;
  let mockMessageSearchIndexSelector: MemoizedSelector<AppState, number>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule, RouterTestingModule],
        declarations: [
          ConversationComponent,
          MockComponent(MessageListComponent),
          MockComponent(WriterComponent),
        ],
        providers: [
          provideMockStore({
            initialState: {
              [userKey]: {
                desktopNotifications: false,
                soundAlerts: true,
              },
            },
          }),
        ],
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
      sampleConversationMessages
    );
    mockConversationMemberEntitiesSelector = store.overrideSelector(
      selectConversationMemberEntities,
      {}
    );
    mockIsFirstPageSelector = store.overrideSelector(isFirstPage, true);
    mockIsLastPageSelector = store.overrideSelector(isLastPage, true);
    mockSelfMemberSelector = store.overrideSelector(
      selectSelfMember,
      sampleMemberDtos[0]
    );

    mockIsLoadingMoreMessagesSelector = store.overrideSelector(
      isLoadingMoreMessages,
      false
    );

    mockNewestConversationMessageSelector = store.overrideSelector(
      selectNewestMessage,
      sampleConversationMessages[0]
    );
    mockMessageSearchSelector = store.overrideSelector(selectMessageSearch, {
      search: '',
      regex: false,
    });
    mockMessageSearchIndexSelector = store.overrideSelector(
      selectMessageSearchIndex,
      -1
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
