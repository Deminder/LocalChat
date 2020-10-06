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
import { throttleTime } from 'rxjs/operators';

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
      .pipe(throttleTime(1000))
      .subscribe(() => this.atTop.emit());
  }

  ngOnChanges(): void {
    if (this.scrollDown) {
      const e = this.ele();
      e.scrollTop = e.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @HostListener('scroll', ['$event'])
  onScroll(): void {
    const e = this.ele();
    if (e.scrollTop < e.scrollHeight / 2) {
      this.atTop$.next();
    }
  }

  ele(): Element {
    return this.ref.element.nativeElement;
  }
}
