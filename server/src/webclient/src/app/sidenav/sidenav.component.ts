import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {

  @Input()
  conversations = [];

  @Input()
  conversationId = -1;

  @Input()
  opened: boolean;

  @Output()
  openedChange = new EventEmitter<boolean>();

  @Output()
  createConv = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  toggle(): void {
    this.opened = !this.opened;
  }
}
