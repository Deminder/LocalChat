import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { convSamples } from '../app.component.spec';
import { MaterialModule } from '../material/material.module';
import { ConversationNameDto, MemberDto } from '../openapi/model/models';
import { AppState } from '../store/reducers/app.reducer';
import { selectedConversationId } from '../store/reducers/router.reducer';
import {
  selectActiveConversation,
  selectConversationMembers,
  selectSelfMember,
  selectVoiceChannel,
  isMicrohponeEnabled,
  isPlaybackEnabled,
} from '../store/selectors/conversation.selectors';
import { MembersComponent } from './members.component';
import { ConvRef } from '../store/actions/conversation.actions';
import { VoiceService } from '../shared/services/voice.service';
import { Subject } from 'rxjs';

const convMembers: MemberDto[] = [
  {
    userId: 1,
    convId: 1,
    username: 'user1',
    joinDate: 0,
    permission: {
      read: true,
      write: true,
      voice: true,
      administrate: true,
      moderate: true,
    },
    modifiablePermission: {
      remove: true,
      modify: {
        read: true,
        write: true,
        voice: true,
        administrate: true,
        moderate: true,
      },
    },
  },
];

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;
  let store: MockStore;

  let _mockConversationMembersSelector: MemoizedSelector<AppState, MemberDto[]>;
  let _mockActiveConversationSelector: MemoizedSelector<
    AppState,
    ConversationNameDto | undefined
  >;
  let _mockConversationIdSelector: MemoizedSelector<AppState, number>;
  let _mockSelfMemberSelector: MemoizedSelector<AppState, MemberDto | undefined>;

  let _mockVoiceChannelSelector: MemoizedSelector<AppState, ConvRef>;
  let _mockIsMicEnabledSelector: MemoizedSelector<AppState, boolean>;
  let _mockIsPlaybackEnabledSelector: MemoizedSelector<AppState, boolean>;

  let voiceServiceSpy: jasmine.SpyObj<VoiceService>;

  beforeEach(
    waitForAsync(() => {
      voiceServiceSpy = jasmine.createSpyObj('voiceService', [], {
        selfVoiceAnalyser$: new Subject<AnalyserNode>(),
        selfGain$: new Subject<GainNode>(),
        voiceAnalysers$: new Subject<{ [n: string]: AnalyserNode }>(),
      });
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          FormsModule,
          MaterialModule,
          NoopAnimationsModule,
        ],
        declarations: [MembersComponent],
        providers: [
          provideMockStore(),
          { provide: VoiceService, useValue: voiceServiceSpy },
        ],
      }).compileComponents();
      store = TestBed.inject(MockStore);
      _mockConversationMembersSelector = store.overrideSelector(
        selectConversationMembers,
        convMembers
      );
      _mockSelfMemberSelector = store.overrideSelector(
        selectSelfMember,
        convMembers[0]
      );
      _mockConversationIdSelector = store.overrideSelector(
        selectedConversationId,
        1
      );
      _mockActiveConversationSelector = store.overrideSelector(
        selectActiveConversation,
        convSamples[0]
      );

      _mockVoiceChannelSelector = store.overrideSelector(selectVoiceChannel, {
        conversationId: convSamples[0].id,
      });

      _mockIsMicEnabledSelector = store.overrideSelector(
        isMicrohponeEnabled,
        false
      );
      _mockIsPlaybackEnabledSelector = store.overrideSelector(
        isPlaybackEnabled,
        false
      );

      // component
      fixture = TestBed.createComponent(MembersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
