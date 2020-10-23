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
import { Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  withLatestFrom,
} from 'rxjs/operators';
import { startMessageSearch } from '../store/actions/conversation.actions';
import { selectedConversationId } from '../store/reducers/router.reducer';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
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
        debounceTime(700),
        distinctUntilChanged(),
        withLatestFrom(this.conversationId$)
      )
      .subscribe(([[search, regex], conversationId]) => {
        this.store.dispatch(
          startMessageSearch({ conversationId, search, regex })
        );
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchText || changes.regex) {
      this.searchTexts.next([this.searchText, this.regex]);
    }
  }

  focusSearch(): void {
    this.shouldFocusOnSearchShow = true;
    this.searchCollapsed = false;
  }

  get isClear(): boolean {
    return this.searchText === '';
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
