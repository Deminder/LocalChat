import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { login } from '../store/actions/authorize.actions';
import { AuthorizeComponent } from './authorize.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FieldErrorComponent } from './field-error/field-error.component';
import { MaterialModule } from '../material/material.module';

describe('AuthorizeComponent', () => {
  let fixture: ComponentFixture<AuthorizeComponent>;
  let component: AuthorizeComponent;
  let store: MockStore;
  const initialState = {};

  beforeEach(
    waitForAsync(() =>
      TestBed.configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [
          MockComponent(LoginComponent),
          MockComponent(RegisterComponent),
          MockComponent(FieldErrorComponent),
          AuthorizeComponent,
        ],
        providers: [provideMockStore({ initialState })],
      })
    )
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login on submit', () => {
    const creds = { username: 'abc', password: 'pwd' };
    spyOn(store, 'dispatch');
    component.onLogin(creds);

    expect(store.dispatch).toHaveBeenCalledWith(login({ creds }));
  });
});
