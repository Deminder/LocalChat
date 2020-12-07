import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ConversationNameDto} from '../openapi/model/models';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {

  @Input()
  conversations: ConversationNameDto[] | null = [];

  @Input()
  title: string | null = 'Local Chat';

  @Input()
  subtitle: string | null = 'Conversations';

  @Input()
  conversationId = -1;

  @Input()
  opened: boolean;

  @Input()
  overlay = false;

  @Output()
  openedChange = new EventEmitter<boolean>();

  @Output()
  createConv = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  toggle(): void {
    this.opened = !this.opened;
    this.openedChange.emit(this.opened);
  }
}
