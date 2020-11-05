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

  let mockConversationIdSelector: MemoizedSelector<AppState, number>;
  let mockSelfNameSelector: MemoizedSelector<AppState, string>;
  let mockConversationMessagesSelector: MemoizedSelector<
    AppState,
    ConversationMessageDto[]
  >;
  let mockConversationsSelector: MemoizedSelector<
    AppState,
    ConversationNameDto[]
  >;
  let mockActiveConversationSelector: MemoizedSelector<
    AppState,
    ConversationNameDto
  >;
  let mockGlobalLoadingSelector: MemoizedSelector<AppState, boolean>;
  let mockSettingsOpenSelector: MemoizedSelector<AppState, boolean>;
  let mockMembersOpenSelector: MemoizedSelector<AppState, boolean>;
  let mockIsSidenavOpenSelector: MemoizedSelector<AppState, boolean>;
  let mockIsSearchingSelector: MemoizedSelector<AppState, boolean>;

  let titleSpy: jasmine.SpyObj<Title>;

  beforeEach(
    waitForAsync(() => {
      titleSpy = jasmine.createSpyObj('title', ['setTitle']);

      TestBed.configureTestingModule({
        imports: [RouterTestingModule, MaterialModule],
        declarations: [AppComponent, MockComponent(SidenavComponent)],
        providers: [provideMockStore(), { provide: Title, useValue: titleSpy }],
      }).compileComponents();
      store = TestBed.inject(MockStore);
      mockConversationIdSelector = store.overrideSelector(
        selectedConversationId,
        1
      );
      mockSelfNameSelector = store.overrideSelector(selectSelfName, 'user1');
      mockConversationMessagesSelector = store.overrideSelector(
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
      mockConversationsSelector = store.overrideSelector(
        selectConversations,
        convSamples
      );
      mockActiveConversationSelector = store.overrideSelector(
        selectActiveConversation,
        convSamples[0]
      );
      mockGlobalLoadingSelector = store.overrideSelector(
        isGlobalLoading,
        false
      );
      mockSettingsOpenSelector = store.overrideSelector(isSettingsOpen, false);
      mockMembersOpenSelector = store.overrideSelector(isMembersOpen, false);
      mockIsSidenavOpenSelector = store.overrideSelector(isSideNavOpen, false);
      mockIsSearchingSelector = store.overrideSelector(isMessageSearching, false);

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
