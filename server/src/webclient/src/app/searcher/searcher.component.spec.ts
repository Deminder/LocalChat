import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MaterialModule } from '../material/material.module';
import { SearcherComponent } from './searcher.component';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '../store/reducers/app.reducer';
import { selectedConversationId } from '../store/reducers/router.reducer';

describe('SearcherComponent', () => {
  let store: MockStore;
  let component: SearcherComponent;
  let fixture: ComponentFixture<SearcherComponent>;
  let mockConversationIdSelector: MemoizedSelector<AppState, number>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, NoopAnimationsModule],
        declarations: [SearcherComponent],
        providers: [provideMockStore()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockConversationIdSelector = store.overrideSelector(
      selectedConversationId,
      1
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
