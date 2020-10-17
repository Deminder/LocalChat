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
} from '../store/selectors/conversation.selectors';
import { MaterialModule } from '../material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { isLoadingMoreMessages } from '../store/selectors/progress.selectors';

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
    mockIsFirstPageSelector = store.overrideSelector(isFirstPage, true);
    mockIsLastPageSelector = store.overrideSelector(isLastPage, true);
    mockSelfMemberSelector = store.overrideSelector(selectSelfMember, {
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
    });

    mockIsLoadingMoreMessagesSelector = store.overrideSelector(
      isLoadingMoreMessages,
      false
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
