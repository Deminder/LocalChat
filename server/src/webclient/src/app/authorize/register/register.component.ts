import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { Credentials } from 'src/app/store/actions/authorize.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Input()
  errors: {defaultMessage: string, field: string}[] = null;

  @Output()
  register: EventEmitter<Credentials> = new EventEmitter();

  hide = true;

  registerForm: FormGroup = this.fb.group(
    {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: [''],
    },
    {
      validators: (control: FormGroup): ValidationErrors | null => {
        return control.get('password').value !==
          control.get('passwordRepeat').value
          ? { unmatchingPassword: true }
          : null;
      },
      asyncValidators: []
    }
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.register.emit({
      username: this.registerForm.get('username').value,
      password: this.registerForm.get('password').value,
    });
  }

  reset(): void {
    this.registerForm.reset();
  }

}
