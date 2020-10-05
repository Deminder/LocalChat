import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppComponent } from './app.component';
import {
  ConversationMessageDto,
  ConversationNameDto,
} from './openapi/model/models';
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
} from './store/selectors/conversation.selectors';
import { isProgressActive } from './store/selectors/progress.selectors';
import { selectSelfName } from './store/selectors/user.selectors';
import { MaterialModule } from './material/material.module';
import { MockComponent } from 'ng-mocks';
import { SidenavComponent } from './sidenav/sidenav.component';

export const convSamples: ConversationNameDto[] = [
  {
    id: 1,
    name: 'conv 1',
    createDate: 0,
    lastUpdate: 0,
  },
  {
    id: 2,
    name: 'conv 2',
    createDate: 2,
    lastUpdate: 2,
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
  let mockProgessSelector: MemoizedSelector<AppState, boolean>;
  let mockSettingsOpenSelector: MemoizedSelector<AppState, boolean>;
  let mockMembersOpenSelector: MemoizedSelector<AppState, boolean>;
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
      mockProgessSelector = store.overrideSelector(isProgressActive, false);
      mockSettingsOpenSelector = store.overrideSelector(isSettingsOpen, false);
      mockMembersOpenSelector = store.overrideSelector(isMembersOpen, false);

      // component
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );


  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Local Chat'`, () => {
    expect(component.defaultTitle).toEqual('Local Chat');
  });
});
