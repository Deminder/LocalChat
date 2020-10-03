import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthorizeComponent } from './authorize.component';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MockRender,
  MockBuilder,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppModule } from '../app.module';
import { Store } from '@ngrx/store';
import { login } from '../store/actions/authorize.actions';

describe('AuthorizeComponent', () => {
  const storeStub = jasmine.createSpyObj('store', ['dispatch']);

  beforeEach(() =>
    MockBuilder(AuthorizeComponent, AppModule)
      .keep(MatTabsModule)
      .keep(LoginComponent)
      .keep(RegisterComponent)
      .mock(Store, storeStub)
      .build()
  );

  it('should create', () => {
    const fixture = MockRender(AuthorizeComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should login on submit', () => {
    const fixture = MockRender(AuthorizeComponent);

    fixture.detectChanges();
    const loginComponent = ngMocks.find(fixture.debugElement, LoginComponent)
      .componentInstance;
    const creds = { username: 'abc', password: 'pwd' };
    loginComponent.login.emit(creds);

    fixture.detectChanges();

    expect(storeStub.dispatch).toHaveBeenCalledWith(login({ creds }));
  });
});
