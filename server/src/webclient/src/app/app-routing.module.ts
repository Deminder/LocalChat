import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConversationComponent} from './conversation/conversation.component';
import {AuthorizeComponent} from './authorize/authorize.component';

const routes: Routes = [
  {path: '', component: ConversationComponent },
  {path: 'authorize', component: AuthorizeComponent },
  {path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
