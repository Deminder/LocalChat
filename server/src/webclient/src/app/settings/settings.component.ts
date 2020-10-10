import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {logout} from '../store/actions/authorize.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  doLogout() {
    this.store.dispatch(logout())
  }

}
