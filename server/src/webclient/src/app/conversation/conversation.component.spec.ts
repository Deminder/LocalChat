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
  let _mockConversationIdSelector: MemoizedSelector<AppState, number>;
  let _mockSelfUserIdSelector: MemoizedSelector<AppState, number>;
  let _mockConversationMessagesSelector: MemoizedSelector<
    AppState,
    ConversationMessageDto[]
  >;
  let _mockConversationMemberEntitiesSelector: MemoizedSelector<
    AppState,
    Dictionary<MemberDto>
  >;
  let _mockIsFirstPageSelector: MemoizedSelector<AppState, boolean>;
  let _mockIsLastPageSelector: MemoizedSelector<AppState, boolean>;
  let _mockSelfMemberSelector: MemoizedSelector<AppState, MemberDto | undefined>;
  let _mockIsLoadingMoreMessagesSelector: MemoizedSelector<AppState, boolean>;
  let _mockNewestConversationMessageSelector: MemoizedSelector<
    AppState,
    ConversationMessageDto | null
  >;
  let _mockMessageSearchSelector: MemoizedSelector<AppState, MessageSearch>;
  let _mockMessageSearchIndexSelector: MemoizedSelector<AppState, number>;

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
    _mockConversationIdSelector = store.overrideSelector(
      selectedConversationId,
      1
    );
    _mockSelfUserIdSelector = store.overrideSelector(selectSelfUserId, 2);
    _mockConversationMessagesSelector = store.overrideSelector(
      selectConversationMessages,
      sampleConversationMessages
    );
    _mockConversationMemberEntitiesSelector = store.overrideSelector(
      selectConversationMemberEntities,
      {}
    );
    _mockIsFirstPageSelector = store.overrideSelector(isFirstPage, true);
    _mockIsLastPageSelector = store.overrideSelector(isLastPage, true);
    _mockSelfMemberSelector = store.overrideSelector(
      selectSelfMember,
      sampleMemberDtos[0]
    );

    _mockIsLoadingMoreMessagesSelector = store.overrideSelector(
      isLoadingMoreMessages,
      false
    );

    _mockNewestConversationMessageSelector = store.overrideSelector(
      selectNewestMessage,
      sampleConversationMessages[0]
    );
    _mockMessageSearchSelector = store.overrideSelector(selectMessageSearch, {
      search: '',
      regex: false,
    });
    _mockMessageSearchIndexSelector = store.overrideSelector(
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
