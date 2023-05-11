import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MaterialModule } from '../material/material.module';
import { SearcherComponent } from './searcher.component';
import { MemoizedSelector } from '@ngrx/store';
import { AppState } from '../store/reducers/app.reducer';
import { selectedConversationId } from '../store/reducers/router.reducer';
import { selectMessageSearchIndex, selectMessageSearchCount } from '../store/selectors/conversation.selectors';
import {FormsModule} from '@angular/forms';

describe('SearcherComponent', () => {
  let store: MockStore;
  let component: SearcherComponent;
  let fixture: ComponentFixture<SearcherComponent>;
  let _mockConversationIdSelector: MemoizedSelector<AppState, number>;
  let _mockSearchItemIndexSelector: MemoizedSelector<AppState, number>;
  let _mockSearchItemCountSelector: MemoizedSelector<AppState, number>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, MaterialModule, NoopAnimationsModule],
        declarations: [SearcherComponent],
        providers: [provideMockStore()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    _mockConversationIdSelector = store.overrideSelector(
      selectedConversationId,
      1
    );
    _mockSearchItemIndexSelector = store.overrideSelector(
      selectMessageSearchIndex,
      -1
    );
    _mockSearchItemCountSelector = store.overrideSelector(
      selectMessageSearchCount,
      0
    );

    fixture = TestBed.createComponent(SearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
