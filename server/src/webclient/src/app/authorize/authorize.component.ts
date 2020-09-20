import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Credentials,
  login,
  register,
} from '../store/actions/authorize.actions';
import { NotifyService } from '../shared/services/notify.service';
import { selectRegisteredUsername } from '../store/reducers/router.reducer';
import { map, tap } from 'rxjs/operators';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
})
export class AuthorizeComponent implements OnInit, AfterViewInit {
  loginErrors$ = this.notifyService.select('login-errors');
  registerErrors$ = this.notifyService.select('register-errors');
  initialUsername$ = this.store.select(selectRegisteredUsername);

  @ViewChild(MatTabGroup) tabs: MatTabGroup;
  @ViewChild(LoginComponent) loginForm: LoginComponent;
  @ViewChild(RegisterComponent) registerForm: RegisterComponent;

  constructor(private store: Store, private notifyService: NotifyService) {}

  ngOnInit(): void {
    this.notifyService.publish('login-errors', null);
    this.notifyService.publish('register-errors', null);
  }

  ngAfterViewInit(): void {
      this.initialUsername$.subscribe((username) => {
            this.tabs.selectedIndex = 0;
            if (this.loginForm) {
                    this.loginForm.reset(username);
                  }
            if (this.registerForm) {
                    this.registerForm.reset();
                  }
          });
  }

  onLogin(credentials: Credentials): void {
    this.store.dispatch(login({ creds: credentials }));
  }

  onRegister(credentials: Credentials): void {
    this.store.dispatch(register({ creds: credentials }));
  }
}
