import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { ConversationNameDto, MemberDto } from '../openapi/model/models';
import { AddConversationComponent } from '../shared/dialogs/add-conversation/add-conversation.component';
import { AddMemberComponent } from '../shared/dialogs/add-member/add-member.component';
import {
  addMember,
  editMember,
  removeMember,
  renameConversation,
  listMembers,
} from '../store/actions/conversation.actions';
import {
  selectActiveConversation,
  selectConversationMembers,
  selectSelfMember,
} from '../store/selectors/conversation.selectors';
import { Subscription, zip } from 'rxjs';
import { Router } from '@angular/router';
import { selectedConversationId } from '../store/reducers/router.reducer';

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

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router
  ) {}

  switcher: Subscription;

  ngOnInit(): void {
    setTimeout(() => {
      this.switcher = zip(this.members$, this.conversationId$).subscribe(
        ([members, cid]) => {
          if (cid >= 0) {
            if (members.length === 0) {
              this.store.dispatch(listMembers({ conversationId: cid }));
            }
          } else {
            this.router.navigate(['/chat']);
          }
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.switcher.unsubscribe();
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
}
