import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { MaterialModule } from '../material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store, MemoizedSelector, DefaultProjectorFn } from '@ngrx/store';
import { AppState } from '../store/reducers/app.reducer';
import { selectSelfName } from '../store/selectors/user.selectors';
import { By } from '@angular/platform-browser';
import { logout } from '../store/actions/authorize.actions';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let store: MockStore;
  let mockSelfNameSelector: MemoizedSelector<AppState, string>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [SettingsComponent],
        providers: [provideMockStore({})],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    mockSelfNameSelector = store.overrideSelector(selectSelfName, 'user1');
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
