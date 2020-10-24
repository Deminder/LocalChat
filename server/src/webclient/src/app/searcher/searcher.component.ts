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
} from 'rxjs/operators';
import { changeMessageSearch } from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit, OnDestroy, AfterViewChecked {
  conversationId$ = this.store.select(selectedConversationId);

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

  searchUpdate(): void {
    this.searchTexts.next([this.searchText, this.regex]);
  }

  focusSearch(): void {
    this.shouldFocusOnSearchShow = true;
    this.searchCollapsed = false;
  }

  get isClear(): boolean {
    return this.searchText === '';
  }

  keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.inputElement.nativeElement.blur();
      event.preventDefault();
    }
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
