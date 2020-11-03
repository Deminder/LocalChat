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
import { RouterTestingModule } from '@angular/router/testing';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '../store/reducers/app.reducer';
import { selectRegisteredUsername } from '../store/reducers/router.reducer';
import { NotifyService } from '../shared/services/notify.service';

describe('AuthorizeComponent', () => {
  let fixture: ComponentFixture<AuthorizeComponent>;
  let component: AuthorizeComponent;
  let store: MockStore;
  const initialState = {};

  let mockInitialUsernameSelector: MemoizedSelector<AppState, string>;

  let notifyServiceSpy: jasmine.SpyObj<NotifyService>;

  beforeEach(
    waitForAsync(() => {
      notifyServiceSpy = jasmine.createSpyObj('notifyService', ['select', 'publish']);
      TestBed.configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule, RouterTestingModule],
        declarations: [
          MockComponent(LoginComponent),
          MockComponent(RegisterComponent),
          MockComponent(FieldErrorComponent),
          AuthorizeComponent,
        ],
        providers: [
          provideMockStore({ initialState }),
          { provide: NotifyService, useValue: notifyServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();

    mockInitialUsernameSelector = store.overrideSelector(
      selectRegisteredUsername,
      null
    );
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
