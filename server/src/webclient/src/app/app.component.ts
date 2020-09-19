import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import {isProgressActive} from './store/selectors/progress.selectors';
import {isSettingsOpen} from './store/reducers/router.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webclient';

  isProgressActive$ = this.store.select(isProgressActive);
  isSettingsOpen$ = this.store.select(isSettingsOpen);

  constructor(private store: Store) { }
}
