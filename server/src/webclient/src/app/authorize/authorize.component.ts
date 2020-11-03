import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { NotifyService } from '../shared/services/notify.service';
import {
  Credentials,
  login,
  register,
} from '../store/actions/authorize.actions';
import { selectRegisteredUsername } from '../store/reducers/router.reducer';
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
