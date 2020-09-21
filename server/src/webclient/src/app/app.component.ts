import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { isProgressActive } from './store/selectors/progress.selectors';
import { isSettingsOpen } from './store/reducers/router.reducer';
import { selectSelfName } from './store/selectors/user.selectors';
import {getSelf} from './store/actions/user.actions';
import {listConversations} from './store/actions/conversation.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'webclient';

  selfName$ = this.store.select(selectSelfName);
  isProgressActive$ = this.store.select(isProgressActive);
  isSettingsOpen$ = this.store.select(isSettingsOpen);


  constructor(private store: Store, private location: Location) {}

  ngOnInit(): void {
    this.store.dispatch(getSelf());
    this.store.dispatch(listConversations());
  }

  back(): void {
    this.location.back();
  }
}
