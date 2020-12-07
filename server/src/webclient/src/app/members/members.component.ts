import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { ConversationNameDto, MemberDto } from '../openapi/model/models';
import { AddConversationComponent } from '../shared/dialogs/add-conversation/add-conversation.component';
import { AddMemberComponent } from '../shared/dialogs/add-member/add-member.component';
import { VoiceService } from '../shared/services/voice.service';
import {
  addMember,
  editMember,
  enableMicrophone,
  enablePlayback,
  removeMember,
  renameConversation,
  switchVoiceConversation,
} from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';
import {
  isMicrohponeEnabled,
  isPlaybackEnabled,
  selectActiveConversation,
  selectConversationMembers,
  selectSelfMember,
  selectVoiceChannel,
} from '../store/selectors/conversation.selectors';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit, OnDestroy {
  members$ = this.store.select(selectConversationMembers);
  activeConversation$ = this.store.select(selectActiveConversation);
  conversationId$ = this.store.select(selectedConversationId);
  selfMember$ = this.store.select(selectSelfMember);
  voiceChannel$ = this.store.select(selectVoiceChannel);
  isMicEnabled$ = this.store.select(isMicrohponeEnabled);
  isPlaybackEnabled$ = this.store.select(isPlaybackEnabled);

  selfVoiceAnalyser$ = this.voiceService.selfVoiceAnalyser$;
  selfGain$ = this.voiceService.selfGain$;
  memberVoiceAnalysers$ = this.voiceService.voiceAnalysers$.pipe(
    map((as) => Object.entries(as))
  );
  memberGain$ = this.voiceService.gains$;

  expandedMemberIds = new Set<number>();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private voiceService: VoiceService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  changeColor(member: MemberDto,  color: string): void {
    this.store.dispatch(
      editMember({
        conversationId: member.convId,
        userId: member.userId,
        permission: member.permission,
        color: color
      })
    );
  }
  changePermission(member: MemberDto, permLabel: string, value: boolean): void {
    this.store.dispatch(
      editMember({
        conversationId: member.convId,
        userId: member.userId,
        permission: { ...member.permission, [permLabel]: value },
      })
    );
  }

  deleteMember(member: MemberDto): void {
    this.store.dispatch(
      removeMember({ conversationId: member.convId, userId: member.userId })
    );
  }

  addMember(conv: ConversationNameDto): void {
    this.members$.pipe(take(1)).subscribe((membs) =>
      this.dialog
        .open(AddMemberComponent, {
          data: {
            conversationId: conv.id,
            members: membs,
          },
        })
        .afterClosed()
        .subscribe((userId: number) => {
          if (userId) {
            this.store.dispatch(addMember({ conversationId: conv.id, userId }));
          }
        })
    );
  }

  renameConversation(conv: ConversationNameDto): void {
    this.dialog
      .open(AddConversationComponent, {
        data: {
          name: conv.name,
          title: 'Rename Conversation',
          submitText: 'Rename',
        },
      })
      .afterClosed()
      .subscribe((name: string) => {
        if (name) {
          this.store.dispatch(
            renameConversation({ conversationId: conv.id, name })
          );
        }
      });
  }

  joinVoice(conv: ConversationNameDto): void {
    this.store.dispatch(switchVoiceConversation({ conversationId: conv.id }));
  }

  leaveVoice(): void {
    this.store.dispatch(switchVoiceConversation({ conversationId: -1 }));
  }

  enableMic(enabled: boolean): void {
    this.store.dispatch(enableMicrophone({ enabled }));
  }

  enablePlayback(enabled: boolean): void {
    this.store.dispatch(enablePlayback({ enabled }));
  }


}
