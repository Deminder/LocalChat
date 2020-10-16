import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appScrollable]',
})
export class ScrollableDirective implements OnInit, OnDestroy, OnChanges {
  @Output()
  atTop = new EventEmitter<void>();

  @Input()
  scrollDown = false;

  atTop$ = new Subject<void>();

  sub: Subscription;

  constructor(private ref: ViewContainerRef) {}
  ngOnInit(): void {
    this.sub = this.atTop$
      .pipe(debounceTime(100))
      .subscribe(() => this.atTop.emit());
  }

  ngOnChanges(): void {
    if (this.scrollDown) {
      const e = this.ele();
      const topMax = (e as any).scrollTopMax;
      e.scrollTop = topMax !== undefined ? topMax : e.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @HostListener('scroll', ['$event'])
  onScroll(): void {
    const e = this.ele();
    const t = (e as any).scrollTopMax !== undefined ? e.scrollHeight + e.scrollTop : e.scrollTop;
    if (t < 1.5 * e.clientHeight) {
      this.atTop$.next();
    }
  }

  ele(): Element {
    return this.ref.element.nativeElement;
  }
}
