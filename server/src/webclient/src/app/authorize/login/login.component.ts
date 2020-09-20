import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Credentials } from 'src/app/store/actions/authorize.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Input()
  errors: { defaultMessage: string; field: string }[] = [];

  @Input()
  initialUsername = '';

  @Output()
  login: EventEmitter<Credentials> = new EventEmitter();

  hide = true;

  loginForm = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm.get('username').setValue(this.initialUsername);
  }

  onSubmit(): void {
    this.login.emit({
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    });
  }

  reset(username: string = ''): void {
    this.loginForm.reset();
    this.loginForm.get('username').setValue(username);
  }
}
