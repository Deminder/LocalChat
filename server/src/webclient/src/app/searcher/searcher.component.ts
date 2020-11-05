import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Subscription, asyncScheduler } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  withLatestFrom,
  delay,
} from 'rxjs/operators';
import {
  changeMessageSearch,
  changeMessageSearchIndex,
} from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';
import {
  selectMessageSearchIndex,
  selectMessageSearchCount,
} from '../store/selectors/conversation.selectors';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit, OnDestroy, AfterViewChecked {
  conversationId$ = this.store.select(selectedConversationId);
  searchItemIndex$ = this.store.select(selectMessageSearchIndex);
  searchItemCount$ = this.store.select(selectMessageSearchCount);

  searchCollapsed = true;

  shouldFocusOnSearchShow = true;

  searchText = '';
  regex = false;

  /* state of text search focused */
  focused = false;

  searchTexts = new Subject<[string, boolean]>();

  @ViewChild('searcher', { static: true })
  inputElement: ElementRef<HTMLElement>;

  sub: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.sub = this.searchTexts
      .pipe(
        debounceTime(200, asyncScheduler),
        distinctUntilChanged(),
        delay(0),
        withLatestFrom(this.conversationId$)
      )
      .subscribe(([[search, regex], conversationId]) => {
        this.store.dispatch(
          changeMessageSearch({ conversationId, search, regex })
        );
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  searchUpdate(refocus = true): void {
    if (refocus) {
      this.inputElement.nativeElement.focus();
    }
    this.searchTexts.next([this.searchText, this.regex]);
  }

  focusSearch(): void {
    this.shouldFocusOnSearchShow = true;
    this.searchCollapsed = false;
  }

  get isClear(): boolean {
    return this.searchText === '';
  }

  escapeKeydown(event: KeyboardEvent): void {
    this.inputElement.nativeElement.blur();
    event.preventDefault();
  }
  enterKeydown(event: KeyboardEvent): void {
    if (event.shiftKey) {
      this.previousItem();
    } else {
      this.nextItem();
    }
    event.preventDefault();
  }

  previousItem(): void {
    this.changeItemIndex(-1);
  }

  nextItem(): void {
    this.changeItemIndex(1);
  }

  private changeItemIndex(indexChange: number): void {
    this.store.dispatch(changeMessageSearchIndex({ indexChange }));
  }

  ngAfterViewChecked(): void {
    if (!this.searchCollapsed) {
      if (this.shouldFocusOnSearchShow) {
        // focus search input element after not collapsed
        this.shouldFocusOnSearchShow = false;
        setTimeout(() => {
          this.inputElement.nativeElement.focus();
        }, 10);
      } else if (!this.focused && this.isClear) {
        // collapse search if not used anymore
        setTimeout(() => {
          if (!this.focused) {
            this.searchCollapsed = true;
          }
        }, 500);
      }
    }
  }
}
