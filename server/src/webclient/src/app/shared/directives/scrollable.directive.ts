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
  forwardRef,
} from '@angular/core';
import {
  Subject,
  Subscription,
  asyncScheduler,
  animationFrameScheduler,
} from 'rxjs';
import { auditTime, distinctUntilChanged, map } from 'rxjs/operators';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { DynamicScrollStrategy } from '../dynamic-scroll-strategy';

export const dynamicScrollStrategyFactory = (dir: DynamicScrollDirective) => {
  return dir.dynamicStrategy;
};

@Directive({
  selector: 'cdk-virtual-scroll-viewport[appDynamicScroll]',
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: dynamicScrollStrategyFactory,
      deps: [forwardRef(() => DynamicScrollDirective)],
    },
  ],
})
export class DynamicScrollDirective implements OnInit, OnDestroy, OnChanges {
  @Output()
  atTop = new EventEmitter<boolean>();

  @Input()
  scrollDown = false;

  atTop$ = new Subject<void>();

  dynamicStrategy = new DynamicScrollStrategy();
  sub: Subscription;
  sub2: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.sub = this.dynamicStrategy.bottomPos.subscribe((endOffset) => {
      if (endOffset === 0) {
        this.dynamicStrategy.scrollToEnd();
      }
    });

    this.sub2 = this.dynamicStrategy.topPos
      .pipe(
        auditTime(200, asyncScheduler),
        map(
          (scrollTop) =>
            scrollTop < 1.5 * this.dynamicStrategy.getViewportSize()
        ),
        distinctUntilChanged()
      )
      .subscribe((atTop) => {
        this.atTop.emit(atTop);
      });
  }

  ngOnChanges(): void {
    if (this.scrollDown) {
      setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            this.dynamicStrategy.scrollToEnd();
          }),
        1000
      );
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
