import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { MaterialModule } from '../material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '../store/reducers/app.reducer';
import {
  selectSelfName,
  selectLoginTokens,
} from '../store/selectors/user.selectors';
import { By } from '@angular/platform-browser';
import { logout } from '../store/actions/authorize.actions';
import { userKey } from '../store/reducers/user.reducer';
import { LoginTokenDto } from '../openapi/model/models';
import { MockComponent } from 'ng-mocks';
import { TokenTableComponent } from './token-table/token-table.component';
import {FormsModule} from '@angular/forms';

const sampleLoginTokens: LoginTokenDto[] = [
  {
    createDate: 0,
    description: 'ip address and user agent...',
    id: 1,
    lastUsed: Date.now(),
  },
];

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let store: MockStore;
  let _mockSelfNameSelector: MemoizedSelector<AppState, string>;
  let _mockTokensSelector: MemoizedSelector<AppState, LoginTokenDto[]>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, FormsModule, NoopAnimationsModule],
        declarations: [MockComponent(TokenTableComponent), SettingsComponent],
        providers: [
          provideMockStore({
            initialState: {
              [userKey]: {
                desktopNotifications: false,
                soundAlerts: false,
              },
            },
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    _mockSelfNameSelector = store.overrideSelector(selectSelfName, 'user1');
    _mockTokensSelector = store.overrideSelector(
      selectLoginTokens,
      sampleLoginTokens
    );
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should dispatch on logout button',
    waitForAsync(() => {
      fixture.whenStable().then(() => {
        const button = fixture.debugElement.query(By.css('#logoutButton'))
          .nativeElement;
        expect(button).toBeTruthy();

        spyOn(store, 'dispatch');
        button.click();

        expect(store.dispatch).toHaveBeenCalledWith(logout());
      });
    })
  );
});
