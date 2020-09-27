import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConversationComponent} from './conversation/conversation.component';
import {AuthorizeComponent} from './authorize/authorize.component';
import {SettingsComponent} from './settings/settings.component';
import {MembersComponent} from './members/members.component';

const routes: Routes = [
  {path: 'chat/:conversationId', component: ConversationComponent },
  {path: 'members/:conversationId', component: MembersComponent },
  {path: 'authorize', component: AuthorizeComponent },
  {path: 'settings', component: SettingsComponent },
  {path: '**', redirectTo: 'chat/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
