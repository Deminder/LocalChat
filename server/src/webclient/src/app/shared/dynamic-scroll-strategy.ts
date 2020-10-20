import {
  CdkVirtualScrollViewport,
  VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import { Observable, Subject, asyncScheduler } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

function searchInGen<T>(
  gen: Generator<T>,
  searchPredicate: (v: T) => boolean
): T {
  let res: IteratorResult<T, any>;
  do {
    res = gen.next();
    if (res.done) {
      return null;
    }
  } while (!searchPredicate(res.value));
  return res.value;
}

export class DynamicScrollStrategy implements VirtualScrollStrategy {
  private pscrolledIndexChange = new Subject<number>();

  private elementCount = 0;

  /* pixel size of mean element size */
  private elementSizeEstimate = 60;

  private minBufferPixel: number;
  private maxBufferPixel: number;

  /* pixel size of the elements when rendered */
  private recoredElementSizes: { [index: number]: number } = {};

  private viewport: CdkVirtualScrollViewport | null = null;

  scrolledIndexChange: Observable<number> = this.pscrolledIndexChange.pipe(
    distinctUntilChanged()
  );

  topPos = new Subject<number>();
  bottomPos = new Subject<number>();

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;

    this.onDataLengthChanged();
  }

  detach(): void {
    this.pscrolledIndexChange.complete();
    this.viewport = null;
  }

  private updateTotalContentSize(): void {
    if (this.viewport) {
      const recoredSize = Object.values(this.recoredElementSizes).reduce(
        (s, size) => s + size,
        0
      );
      const recordCount = Object.keys(this.recoredElementSizes).length;

      this.elementSizeEstimate =
        recordCount > 2 ? recoredSize / recordCount : 100;

      // update buffer pixel estimates
      this.minBufferPixel = 250;
      /* Math.floor(
        Object.values(this.recoredElementSizes).reduce(
          (m, size) => Math.max(m, size),
          this.elementSizeEstimate * 2
        )
      ); */
      this.maxBufferPixel = Math.floor(this.minBufferPixel * 1.5);

      this.viewport.setTotalContentSize(
        recoredSize +
          this.elementSizeEstimate * (this.elementCount - recordCount)
      );
    }
  }

  private pixelSizeOfRange(start: number, end: number): number {
    let pixels = 0;
    for (let i = start; i < end; i++) {
      pixels += this.elementSize(i);
    }
    return pixels;
  }

  private elementSize(index: number): number {
    return this.recoredElementSizes[index]
      ? this.recoredElementSizes[index]
      : this.elementSizeEstimate;
  }

  private *elementOffsets(
    start: number = 0,
    reverse: boolean = false
  ): Generator<[number, number]> {
    let pixels = 0;
    if (!reverse) {
      for (let i = start; i < this.elementCount; i++) {
        pixels += this.elementSize(i);
        yield [i + 1, pixels];
      }
    } else {
      for (let i = start - 1; i >= 0; i--) {
        pixels -= this.elementSize(i);
        yield [i, pixels];
      }
    }
  }

  private updateRenderRange(): void {
    if (this.viewport) {
      const scrollOffset = this.viewport.measureScrollOffset();

      const range = this.viewport.getRenderedRange();

      // forward and backward offsets are relative to startOffset
      const startOffset = this.viewport.getOffsetToRenderedContentStart();
      console.log('offset', startOffset);

      const hardStart = Math.max(0, scrollOffset - this.maxBufferPixel);
      const targetStart = Math.max(0, scrollOffset - this.minBufferPixel);
      const targetEnd =
        scrollOffset + this.viewport.getViewportSize() + this.minBufferPixel;
      const hardEnd =
        scrollOffset + this.viewport.getViewportSize() + this.maxBufferPixel;

      let start = range.start;
      let relativeOffset = 0;
      if (startOffset > targetStart) {
        // backward-search to capture targetStart
        [start, relativeOffset] = searchInGen(
          this.elementOffsets(range.start, true),
          ([_, offset]) => offset + startOffset <= targetStart
        ) ?? [range.start, 0];
      } else if (startOffset < hardStart) {
        // forward-search to cut everything before hardStart
        [start, relativeOffset] = searchInGen(
          this.elementOffsets(range.start),
          ([_, offset]) => offset + startOffset >= hardStart
        ) ?? [range.start, 0];
      }

      // forward-search to include everything until targetEnd
      const [minEnd, relativeOffset2] = searchInGen(
        this.elementOffsets(start),
        ([index, offset]) =>
          index === this.elementCount ||
          offset + startOffset + relativeOffset >= targetEnd
      ) ?? [start, 0];

      let end = minEnd;
      if (minEnd < this.elementCount) {
        const fsearch = this.elementOffsets(minEnd);
        while (end >= range.start && end < range.end) {
          // forward-search to cut only after hardEnd (keep loaded)
          const res = fsearch.next();
          if (res.done) {
            break;
          }
          const [index, offset] = res.value;
          if (
            offset + startOffset + relativeOffset + relativeOffset2 >=
            hardEnd
          ) {
            break;
          }
          end = index;
        }
      }

      // index of first element in viewport
      const [firstVisibleIndex] = searchInGen(
        this.elementOffsets(start),
        ([_, offset]) => offset + startOffset + relativeOffset >= scrollOffset
      ) ?? [start];

      start = Math.max(0, start);
      end = Math.min(this.elementCount, end);

      if (end - range.end > range.start - start) {
        // range moved down
        start = start > range.start ? start : range.start; // keep or shrink old start
        this.viewport.setRenderedContentOffset(
          this.pixelSizeOfRange(0, start),
          'to-start'
        );
      } else {
        // range moved up
        end = end < range.end ? end : range.end; // keep or shrink old end
        this.viewport.setRenderedContentOffset(
          this.pixelSizeOfRange(0, end),
          'to-end'
        );
      }

      this.viewport.setRenderedRange({ start, end });
      this.pscrolledIndexChange.next(firstVisibleIndex);
    }
  }

  onContentScrolled(): void {
    this.bottomPos.next(this.viewport.measureScrollOffset('bottom'));
    this.topPos.next(this.viewport.measureScrollOffset('top'));
    // measure element sizes
    if (this.measueCurrentRange()) {
      this.updateTotalContentSize();
    }

    this.updateRenderRange();
  }

  onDataLengthChanged(): void {
    if (this.viewport) {
      // all indexes are now invalid
      this.recoredElementSizes = {};
      this.elementCount = this.viewport.getDataLength();

      this.measueCurrentRange();
      this.updateTotalContentSize();
      this.updateRenderRange();
    }
  }

  measueCurrentRange(): boolean {
    const renderedRange = this.viewport.getRenderedRange();
    let change = false;
    for (let i = renderedRange.start; i < renderedRange.end; i++) {
      const pixelSize = this.viewport.measureRangeSize({
        start: i,
        end: i + 1,
      });
      if (pixelSize !== this.recoredElementSizes[i]) {
        change = true;
        this.recoredElementSizes[i] = pixelSize;
      }
    }
    //const newStartOffset = this.pixelSizeOfRange(0, renderedRange.start);
    //this.viewport.setRenderedContentOffset(newStartOffset);
    return change;
  }

  onContentRendered(): void {}

  getViewportSize(): number {
    return this.viewport?.getViewportSize() ?? 1;
  }

  onRenderedOffsetChanged(): void {}

  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (this.viewport) {
      this.viewport.scrollToOffset(this.pixelSizeOfRange(0, index), behavior);
    }
  }

  scrollToEnd(): void {
    if (this.viewport) {
      this.viewport.scrollTo({ bottom: 0 });
    }
  }
}
