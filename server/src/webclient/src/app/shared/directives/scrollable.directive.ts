import {
  Directive,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { asyncScheduler, Subject, Subscription } from 'rxjs';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[appDynamicScroll]',
})
export class DynamicScrollDirective implements OnInit, OnDestroy {
  @Output()
  atTop = new EventEmitter<boolean>();

  atTop$ = new Subject<boolean>();

  sub: Subscription;

  constructor(private ref: ViewContainerRef) {}

  ngOnInit(): void {
    this.sub = this.atTop$
      .pipe(auditTime(200, asyncScheduler), distinctUntilChanged())
      .subscribe((atTop) => {
        this.atTop.emit(atTop);
      });

  }

  scrollDown(): void {
    window.requestAnimationFrame(() => {
      const e = this.ele();
      e.scrollTop = e.scrollHeight;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @HostListener('scroll', ['$event'])
  onScroll(): void {
    const e = this.ele();
    this.atTop$.next(e.scrollTop < 1.5 * e.clientHeight);
  }

  ele(): HTMLElement {
    return this.ref.element.nativeElement;
  }
}
