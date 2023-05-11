import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Dictionary } from '@ngrx/entity';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { convSamples } from 'src/app/app.component.spec';
import { sampleMemberDtos } from 'src/app/conversation/conversation.component.spec';
import { ConversationNameDto, MemberDto } from 'src/app/openapi/model/models';
import { AppState } from 'src/app/store/reducers/app.reducer';
import { selectedConversationId } from 'src/app/store/reducers/router.reducer';
import { userKey } from 'src/app/store/reducers/user.reducer';
import {
  selectConversationMemberEntities,
  selectConversationNameEntities,
} from 'src/app/store/selectors/conversation.selectors';
import { NotifyService } from './notify.service';

describe('NotifyService', () => {
  let service: NotifyService;
  let store: MockStore;
  let _mockConversationIdSelector: MemoizedSelector<AppState, number>;
  //let _mockDesktopNotificationSelector: MemoizedSelector<AppState, boolean>;
  //let _mockAlertSoundsSelector: MemoizedSelector<AppState, boolean>;
  let _mockMemberEntitesSelector: MemoizedSelector<
    AppState,
    Dictionary<MemberDto>
  >;
  let _mockConversationNameEntitiesSelector: MemoizedSelector<
    AppState,
    Dictionary<ConversationNameDto>
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
    });
    store = TestBed.inject(MockStore);
    service = TestBed.inject(NotifyService);
    _mockConversationIdSelector = store.overrideSelector(
      selectedConversationId,
      1
    );

    _mockMemberEntitesSelector = store.overrideSelector(
      selectConversationMemberEntities,
      { [sampleMemberDtos[0].userId]: sampleMemberDtos[0] }
    );

    _mockConversationNameEntitiesSelector = store.overrideSelector(
      selectConversationNameEntities,
      { [convSamples[0].id]: convSamples[0] }
    );
  });

  it(
    'should load beepSound on creation',
    waitForAsync(() => {
      expect(service).toBeTruthy();
      service.beepSound.once('load', () => {
        expect(service.beepSound.duration()).toBeGreaterThan(0);
      });
    })
  );
});
