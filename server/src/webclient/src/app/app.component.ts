import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import {isProgressActive} from './store/selectors/progress.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webclient';

  isProgressActive$ = this.store.select(isProgressActive);

  constructor(private store: Store) { }
}
