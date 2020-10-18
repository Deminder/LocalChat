import {
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { DynamicScrollDirective } from './scrollable.directive';

class ViewContainerRefMock extends ViewContainerRef {
  constructor(private eelement: Element) {
    super();
  }

  get element(): ElementRef<any> {
    return { nativeElement: this.eelement };
  }
  get injector(): Injector {
    throw new Error('Method not implemented.');
  }
  get parentInjector(): Injector {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  get(): ViewRef {
    throw new Error('Method not implemented.');
  }
  get length(): number {
    throw new Error('Method not implemented.');
  }
  createEmbeddedView<C>(): EmbeddedViewRef<C> {
    throw new Error('Method not implemented.');
  }
  createComponent<C>(): ComponentRef<C> {
    throw new Error('Method not implemented.');
  }
  insert(): ViewRef {
    throw new Error('Method not implemented.');
  }
  move(): ViewRef {
    throw new Error('Method not implemented.');
  }
  indexOf(): number {
    throw new Error('Method not implemented.');
  }
  remove(): void {
    throw new Error('Method not implemented.');
  }
  detach(): ViewRef {
    throw new Error('Method not implemented.');
  }
}

describe('ScrollableDirective', () => {
  let element: Element;
  let directive: DynamicScrollDirective;

  beforeEach(() => {
    element = document.createElement('div');
    directive = new DynamicScrollDirective(new ViewContainerRefMock(element));
    directive.ngOnInit();
  });

  afterEach(() => {
    directive.ngOnDestroy();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should scroll down on changes', () => {
    const sh = 77;
    spyOnProperty(element, 'scrollHeight', 'get').and.returnValue(sh);

    const stSpy = spyOnProperty(element, 'scrollTop', 'set')

    directive.ngOnChanges();
    expect(stSpy).not.toHaveBeenCalled();

    directive.scrollDown = true;
    directive.ngOnChanges();
    expect(stSpy).toHaveBeenCalledWith(sh);
  });
});
