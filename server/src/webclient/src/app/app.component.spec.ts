import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import {
  ConversationMessageDto,
  ConversationNameDto,
} from './openapi/model/models';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppState } from './store/reducers/app.reducer';
import {
  isMembersOpen,
  isSettingsOpen,
  selectedConversationId,
} from './store/reducers/router.reducer';
import {
  selectActiveConversation,
  selectConversationMessages,
  selectConversations,
  isMessageSearching,
} from './store/selectors/conversation.selectors';
import { isGlobalLoading } from './store/selectors/progress.selectors';
import {
  isSideNavOpen,
  selectSelfName,
} from './store/selectors/user.selectors';
import { NotifyService } from './shared/services/notify.service';
import { of } from 'rxjs';

export const convSamples: ConversationNameDto[] = [
  {
    id: 1,
    name: 'conv 1',
    createDate: 0,
    lastUpdate: 0,
    unreadCount: 0,
  },
  {
    id: 2,
    name: 'conv 2',
    createDate: 2,
    lastUpdate: 2,
    unreadCount: 0,
  },
];

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let store: MockStore;

  let _mockConversationIdSelector: MemoizedSelector<AppState, number>;
  let _mockSelfNameSelector: MemoizedSelector<AppState, string>;
  let _mockConversationMessagesSelector: MemoizedSelector<
    AppState,
    ConversationMessageDto[]
  >;
  let _mockConversationsSelector: MemoizedSelector<
    AppState,
    ConversationNameDto[]
  >;
  let _mockActiveConversationSelector: MemoizedSelector<
    AppState,
    ConversationNameDto | undefined
  >;
  let _mockGlobalLoadingSelector: MemoizedSelector<AppState, boolean>;
  let _mockSettingsOpenSelector: MemoizedSelector<AppState, boolean>;
  let _mockMembersOpenSelector: MemoizedSelector<AppState, boolean>;
  let _mockIsSidenavOpenSelector: MemoizedSelector<AppState, boolean>;
  let _mockIsSearchingSelector: MemoizedSelector<AppState, boolean>;

  let titleSpy: jasmine.SpyObj<Title>;
  let notifySpy: jasmine.SpyObj<NotifyService>;

  beforeEach(
    waitForAsync(() => {
      titleSpy = jasmine.createSpyObj('title', ['setTitle']);
      notifySpy = jasmine.createSpyObj(
        'notifyService',
        { isHidden: () => true },
        {
          hidden$: of(true, false),
        }
      );

      TestBed.configureTestingModule({
        imports: [RouterTestingModule, MaterialModule],
        declarations: [AppComponent, MockComponent(SidenavComponent)],
        providers: [
          provideMockStore(),
          { provide: Title, useValue: titleSpy },
          { provide: NotifyService, useValue: notifySpy },
        ],
      }).compileComponents();
      store = TestBed.inject(MockStore);
      _mockConversationIdSelector = store.overrideSelector(
        selectedConversationId,
        1
      );
      _mockSelfNameSelector = store.overrideSelector(selectSelfName, 'user1');
      _mockConversationMessagesSelector = store.overrideSelector(
        selectConversationMessages,
        [
          {
            id: 1,
            authorDate: 0,
            authorUserId: 1,
            lastChange: 0,
            text: 'hello',
          },
        ]
      );
      _mockConversationsSelector = store.overrideSelector(
        selectConversations,
        convSamples
      );
      _mockActiveConversationSelector = store.overrideSelector(
        selectActiveConversation,
        convSamples[0]
      );
      _mockGlobalLoadingSelector = store.overrideSelector(
        isGlobalLoading,
        false
      );
      _mockSettingsOpenSelector = store.overrideSelector(isSettingsOpen, false);
      _mockMembersOpenSelector = store.overrideSelector(isMembersOpen, false);
      _mockIsSidenavOpenSelector = store.overrideSelector(isSideNavOpen, false);
      _mockIsSearchingSelector = store.overrideSelector(
        isMessageSearching,
        false
      );

      // component
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
