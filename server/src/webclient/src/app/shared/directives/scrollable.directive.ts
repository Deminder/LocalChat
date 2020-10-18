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
import { Subject, Subscription, asyncScheduler } from 'rxjs';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';
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
  atTop = new EventEmitter<void>();

  @Input()
  scrollDown = false;

  atTop$ = new Subject<void>();

  dynamicStrategy = new DynamicScrollStrategy();
  sub: Subscription;
  sub2: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.sub = this.dynamicStrategy.endOffset
      .subscribe((endOffset) => {
        if (endOffset === 0) {
          this.dynamicStrategy.scrollToEnd();
        }
      });

    this.sub2 = this.dynamicStrategy.startOffset
      .pipe(auditTime(200, asyncScheduler))
      .subscribe((startOffset) => {
        if (startOffset < 1.5 * this.dynamicStrategy.getViewportSize()) {
          this.atTop.emit();
        }
      });
  }

  ngOnChanges(): void {
    if (this.scrollDown) {
      this.dynamicStrategy.scheduleScrollToEnd();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
