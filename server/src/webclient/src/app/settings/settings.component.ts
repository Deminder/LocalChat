import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout } from '../store/actions/authorize.actions';
import {selectSelfName} from '../store/selectors/user.selectors';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  selfName$ = this.store.select(selectSelfName);

  constructor(private store: Store) {}

  ngOnInit(): void {}

  doLogout(): void {
    this.store.dispatch(logout());
  }
}
