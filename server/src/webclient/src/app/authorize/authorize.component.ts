import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Credentials,
  login,
  register,
} from '../store/actions/authorize.actions';
import { NotifyService } from '../shared/services/notify.service';
import {selectRegisteredUsername} from '../store/reducers/router.reducer';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
})
export class AuthorizeComponent implements OnInit {

  loginErrors$ = this.notifyService.select('login-errors');
  registerErrors$ = this.notifyService.select('register-errors');
  initialUsername$ = this.store.select(selectRegisteredUsername);

  constructor(private store: Store, private notifyService: NotifyService) {
  }

  ngOnInit(): void {
    this.notifyService.publish('login-errors', null);
    this.notifyService.publish('register-errors', null);
  }

  onLogin(credentials: Credentials): void {
    this.store.dispatch(login({creds: credentials}));
  }

  onRegister(credentials: Credentials): void {
    this.store.dispatch(register({creds: credentials}));
  }
}
