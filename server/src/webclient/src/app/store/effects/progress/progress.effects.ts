import {Injectable} from '@angular/core';
import {Actions, createEffect} from '@ngrx/effects';
import {filter, map} from 'rxjs/operators';
import {progressStart, progressStop} from '../../actions/progress.actions';

const startPattern = /^\[.+\/API\](?!.*(Success|Failure))$/;
const stopPattern = /^\[.+\/API\].*(Success|Failure)$/;

@Injectable()
export class ProgressEffects {
  startProgress$ = createEffect(() =>
    this.actions$.pipe(
      filter((action) => startPattern.test(action.type)),
      map((action) => progressStart({ action: action.type }))
    )
  );

  stopProgress$ = createEffect(() =>
    this.actions$.pipe(
      filter((action) => stopPattern.test(action.type)),
      map((action) => progressStop({ action: action.type.replace(/ (Success|Failure)$/, '')}))
    )
  );

  constructor(private actions$: Actions) {}
}
