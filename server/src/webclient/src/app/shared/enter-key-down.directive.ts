import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appEnterKeydown]',
})
export class EnterKeyDownDirective {
  @Output()
  enterKeydown = new EventEmitter<KeyboardEvent>();

  @Output()
  escapeKeydown = new EventEmitter<KeyboardEvent>();

  @HostListener('keydown', ['$event'])
  onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      this.enterKeydown.emit(ev);
    }

    if (ev.key === 'Escape') {
      this.escapeKeydown.emit(ev);
    }
  }
}
